import { NextRequest, NextResponse } from 'next/server';
import { generateInvoicePDF, generateInvoiceNumber, formatRentalType } from '@/lib/booking/pdf-generator';
import { calculatePrice } from '@/lib/booking/pricing';
import { PricingBreakdown } from '@/lib/booking/types';
import { sendBookingConfirmationEmail, notifyAdminNewBooking, sendMonthlyRentalInvoiceEmail, notifyAdminMonthlyRentalInvoice } from '@/lib/booking/email';
import { createCalendarEvent } from '@/lib/booking/google-calendar';
import { getPayload } from 'payload';
import config from '@/payload.config';

const MONTHLY_RATE = 400;
const HST_RATE = 0.13;

// Rental type rates and formatting
const RENTAL_TYPE_CONFIG: Record<string, { rate: number; title: string }> = {
  'hourly-rehearsal': { rate: 30, title: 'Hourly Rehearsal' },
  'hourly-recording': { rate: 50, title: 'Hourly Recording' },
};

/**
 * Create a UTC date from a date string and time string in Eastern timezone
 * dateString: "2026-04-01", timeString: "14:00"
 */
function createEasternDate(dateString: string, timeString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);

  // Probe the UTC offset for Toronto on this date using noon UTC.
  const noonUTC = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(noonUTC);

  const pMap: Record<string, number> = {};
  parts.forEach(p => { if (p.type !== 'literal') pMap[p.type] = parseInt(p.value, 10); });

  const offsetHours = 12 - pMap.hour;
  return new Date(Date.UTC(year, month - 1, day, hours + offsetHours, minutes));
}

/**
 * Get the date string in Eastern timezone from a UTC date
 * Returns format: "2026-06-10"
 */
function getEasternDateString(utcDate: Date): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const parts = formatter.formatToParts(utcDate);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  
  return `${year}-${month}-${day}`;
}

/**
 * POST /api/admin/generate-invoice
 * Generate an invoice PDF manually from admin panel
 * 
 * Request body:
 * {
 *   clientName: string;
 *   clientEmail: string;
 *   bookingDate?: string (YYYY-MM-DD);
 *   startTime?: string (HH:MM);
 *   duration?: number (hours);
 *   rentalType: 'hourly-rehearsal' | 'hourly-recording' | 'monthly';
 *   isMonthly?: boolean;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['clientName', 'clientEmail', 'rentalType'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const isMonthly = body.isMonthly === true;

    // Validate for monthly vs hourly
    if (!isMonthly) {
      if (!body.bookingDate || !body.startTime || !body.duration) {
        return NextResponse.json(
          { error: 'bookingDate, startTime, and duration are required for hourly bookings' },
          { status: 400 }
        );
      }
    }

    let startTime: Date | undefined;
    let endTime: Date | undefined;
    let durationMinutes = 0;

    if (!isMonthly) {
      // Use createEasternDate to properly handle timezone conversion
      startTime = createEasternDate(body.bookingDate, body.startTime);
      
      // Create end time by adding duration to start time
      endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + body.duration * 60);

      // Validate dates
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        );
      }

      if (endTime <= startTime) {
        return NextResponse.json(
          { error: 'End time must be after start time' },
          { status: 400 }
        );
      }

      // Calculate duration in minutes
      durationMinutes = body.duration * 60;

      if (durationMinutes < 30) {
        return NextResponse.json(
          { error: 'Booking duration must be at least 30 minutes' },
          { status: 400 }
        );
      }
    }

    // Generate invoice number and booking reference
    const bookingId = `MANUAL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const invoiceNumber = generateInvoiceNumber(bookingId);

    // Calculate pricing
    let pricing: PricingBreakdown;

    if (isMonthly) {
      // Monthly rental: $400 + 13% HST = $452
      const subtotal = MONTHLY_RATE;
      const hst = parseFloat((subtotal * HST_RATE).toFixed(2));
      const total = parseFloat((subtotal + hst).toFixed(2));

      pricing = {
        hourlyRate: 0,
        subtotal,
        monthlyDiscount: 0,
        gearStorageFee: 0,
        total,
        totalMinutes: 0,
      };
    } else {
      // Hourly booking - get rate and calculate with HST
      const config = RENTAL_TYPE_CONFIG[body.rentalType] || { rate: 30, title: body.rentalType };
      const hourlyRate = config.rate;
      const rentalTypeTitle = config.title;
      
      console.log(`Using rate for ${body.rentalType}: hourlyRate=${hourlyRate}, title=${rentalTypeTitle}`);
      
      // Store the title for later use in emails and events
      body.rentalTypeTitle = rentalTypeTitle;

      // Calculate pricing WITHOUT HST first
      const subtotal = parseFloat(((hourlyRate * durationMinutes) / 60).toFixed(2));
      const hst = parseFloat((subtotal * HST_RATE).toFixed(2));
      const total = parseFloat((subtotal + hst).toFixed(2));

      pricing = {
        hourlyRate,
        subtotal,
        monthlyDiscount: 0,
        gearStorageFee: 0,
        total,
        totalMinutes: durationMinutes,
      };
    }

    // Generate PDF
    const invoicePdfBuffer = await generateInvoicePDF({
      invoiceNumber,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      bookingDate: new Date(),
      startTime,
      endTime,
      pricing,
      rentalType: body.rentalTypeTitle || body.rentalType,
      isMonthly,
    });

    // Send confirmation email to client and admin
    try {
      if (isMonthly) {
        // For monthly invoices, use the cleaner monthly rental template
        const monthYear = new Date().toLocaleDateString('en-CA', {
          timeZone: 'America/Toronto',
          month: 'long',
          year: 'numeric',
        });
        
        await sendMonthlyRentalInvoiceEmail(
          body.clientEmail,
          body.clientName,
          monthYear,
          pricing.total,
          invoicePdfBuffer
        );
        console.log(`Monthly rental invoice email sent to ${body.clientEmail}`);
        
        await notifyAdminMonthlyRentalInvoice(
          body.clientEmail,
          body.clientName,
          monthYear,
          pricing.total,
          invoicePdfBuffer
        );
        console.log('Admin notification for monthly rental sent');
      } else {
        // For hourly invoices, use the standard booking confirmation template
        await sendBookingConfirmationEmail(
          body.clientEmail,
          body.clientName,
          startTime || new Date(),
          endTime || new Date(),
          pricing.total,
          body.rentalTypeTitle || body.rentalType,
          bookingId,
          invoicePdfBuffer,
          eventTitle,
          eventDescription
        );
        console.log(`Invoice email sent to ${body.clientEmail}`);
        
        // Send admin notification for hourly invoices
        await notifyAdminNewBooking(
          body.clientEmail,
          body.clientName,
          startTime || new Date(),
          endTime || new Date(),
          pricing.total,
          body.rentalTypeTitle || body.rentalType,
          bookingId,
          invoicePdfBuffer,
          eventTitle,
          eventDescription
        );
        console.log('Admin notification email sent');
      }
    } catch (emailError) {
      console.error('Error sending invoice email:', emailError);
      throw new Error(`Failed to send invoice email: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`);
    }

    // Sync client with Payload CMS and log transaction
    try {
      const payload = await getPayload({ config });
      
      // Check if client exists, create if not
      const existingClients = await payload.find({
        collection: 'clients',
        where: {
          email: {
            equals: body.clientEmail,
          },
        },
      });

      if (existingClients.docs.length === 0) {
        await payload.create({
          collection: 'clients',
          data: {
            name: body.clientName,
            email: body.clientEmail,
          },
        });
        console.log(`Created new client: ${body.clientEmail}`);
      }
      
      // Log transaction for analytics
      const today = new Date().toISOString().split('T')[0];
      
      // Split the total into purchase price and tax
      const purchasePrice = pricing.subtotal || (pricing.total / 1.13);
      const taxAmount = pricing.total - purchasePrice;

      await payload.create({
        collection: 'transactions',
        data: {
          transactionDate: today,
          purchasePrice: Number(purchasePrice.toFixed(2)),
          taxAmount: Number(taxAmount.toFixed(2)),
          clientEmail: body.clientEmail,
          bookingStartTime: startTime ? startTime.toISOString() : today,
        },
      });
      console.log('Transaction logged for manual invoice');
    } catch (transactionError) {
      console.error('Error logging transaction:', transactionError);
      // Don't fail the invoice generation if transaction logging fails
    }

    // Create Google Calendar event for hourly invoices only
    let eventTitle: string | undefined;
    let eventDescription: string | undefined;
    
    if (!isMonthly && startTime && endTime) {
      eventTitle = `${body.clientName || 'Client'} - Booking`;
      eventDescription = `
          Client: ${body.clientName}
          Email: ${body.clientEmail}
          Duration: ${durationMinutes / 60} hour${durationMinutes / 60 > 1 ? 's' : ''}
          Rental Type: ${body.rentalTypeTitle || body.rentalType}
        `.trim();
      
      try {
        await createCalendarEvent(
          eventTitle,
          startTime,
          endTime,
          eventDescription
        );
        console.log('Calendar event created for manual hourly invoice');
      } catch (calendarError) {
        console.error('Error creating calendar event:', calendarError);
        // Don't fail the invoice generation if calendar event creation fails
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Invoice sent to ${body.clientEmail}`,
      invoiceNumber,
      bookingId,
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate invoice',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
