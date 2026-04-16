import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability, createCalendarEvent } from '@/lib/booking/google-calendar';
import { sendBookingConfirmationEmail, notifyAdminNewBooking } from '@/lib/booking/email';
import { calculatePrice } from '@/lib/booking/pricing';
import { BookingRequest } from '@/lib/booking/types';
import { generateInvoicePDF, generateInvoiceNumber, formatRentalType } from '@/lib/booking/pdf-generator';
import { getPayload } from 'payload';
import config from '@/payload.config';

const TIMEZONE = 'America/Toronto'; // Eastern time

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
 * Create a UTC date from a date string and time string in Eastern timezone
 * dateString: "2026-04-01", timeString: "14:00"
 */
function createEasternDate(dateString: string, timeString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);

  // Probe the UTC offset for Toronto on this date using noon UTC.
  // Noon UTC is always within the same calendar day across all UTC offsets,
  // so the formatter will never return a different day or a 24/0 edge case.
  const noonUTC = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(noonUTC);

  const pMap: Record<string, number> = {};
  parts.forEach(p => { if (p.type !== 'literal') pMap[p.type] = parseInt(p.value, 10); });

  // offsetHours: how many hours to ADD to Eastern local time to get UTC
  // (e.g. 4 for EDT, 5 for EST)
  const offsetHours = 12 - pMap.hour;

  // Build the UTC timestamp directly — Date.UTC handles hour overflow across day boundaries
  return new Date(Date.UTC(year, month - 1, day, hours + offsetHours, minutes));
}

/**
 * POST /api/booking/create
 * Create a new booking and add event to Google Calendar
 */
export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();

    // Validate required fields
    const requiredFields = [
      'clientName',
      'clientEmail',
      'preferredDate',
      'preferredTime',
      'duration',
      'rentalType',
    ];

    const missingFields = requiredFields.filter(field => !body[field as keyof BookingRequest]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Parse date and time as Eastern time
    const startTime = createEasternDate(body.preferredDate, body.preferredTime);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + body.duration * 60);

    // Validate date is in the future
    const now = new Date();
    if (startTime < now) {
      return NextResponse.json(
        { error: 'Cannot book times in the past' },
        { status: 400 }
      );
    }

    // Validate minimum 24 hours advance
    const minBookingTime = new Date(now);
    minBookingTime.setHours(minBookingTime.getHours() + 24);
    
    if (startTime < minBookingTime) {
      return NextResponse.json(
        { error: 'Bookings must be made at least 24 hours in advance' },
        { status: 400 }
      );
    }

    // Check availability one final time
    // console.log(`Checking availability for ${startTime.toISOString()} to ${endTime.toISOString()}`);
    const isAvailable = await checkAvailability(startTime, endTime);

    if (!isAvailable) {
      return NextResponse.json(
        { 
          error: 'This time slot is no longer available. Please choose another time.',
          available: false 
        },
        { status: 409 }
      );
    }

    // Fetch the rate details to get the hourly amount and title
    let hourlyRate = 30; // default fallback
    let rentalTypeTitle = body.rentalType; // default to the ID if not found
    try {
      const rateResponse = await fetch(`${process.env.PAYLOAD_PUBLIC_API_BASE || 'http://localhost:3000'}/api/rates?where[id][equals]=${body.rentalType}`);
      if (rateResponse.ok) {
        const rateData = await rateResponse.json();
        if (rateData.docs && rateData.docs.length > 0) {
          const rate = rateData.docs[0];
          hourlyRate = typeof rate.amount === 'number' ? rate.amount : parseFloat(String(rate.amount)) || 30;
          rentalTypeTitle = rate.title || body.rentalType;
        }
      }
    } catch (err) {
      console.error('Failed to fetch rate details:', err);
      // Use default hourly rate and rental type
    }

    // Check if client is a monthly subscriber (for tracking purposes only)
    let isMonthlyClient = false;
    let clientId: string | undefined;
    try {
      const payload = await getPayload({ config });
      
      const existingClients = await payload.find({
        collection: 'clients',
        where: {
          email: {
            equals: body.clientEmail,
          },
        },
      });

      if (existingClients.docs.length > 0) {
        isMonthlyClient = existingClients.docs[0].isMonthlyClient || false;
        clientId = existingClients.docs[0].id;
      }
    } catch (err) {
      console.error('Failed to check client status:', err);
    }

    // Calculate pricing - always at regular rate, no monthly discounts for bookings
    const pricing = calculatePrice(
      hourlyRate,
      body.duration,
      false // Don't apply monthly discount for regular bookings
    );

    // Create the calendar event
    const eventTitle = `${body.bandName || body.clientName} - Booking`;
    const eventDescription = `
      Client: ${body.clientName}
      Email: ${body.clientEmail}
      Phone: ${body.clientPhone || 'N/A'}
      Band: ${body.bandName || 'N/A'}
      Duration: ${body.duration} hour${body.duration > 1 ? 's' : ''}
      Rental Type: ${rentalTypeTitle}
      ${body.additionalInfo ? `Additional Info: ${body.additionalInfo}` : ''}
      Price: $${pricing.total}
    `.trim();

    let googleEventId: string | undefined;
    try {
      googleEventId = await createCalendarEvent(
        eventTitle,
        startTime,
        endTime,
        eventDescription,
        [body.clientEmail]
      );
      // console.log(`Created Google Calendar event: ${googleEventId}`);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      // Don't fail the entire booking if calendar event creation fails
      // Just note it in the response
    }

    // Generate booking ID
    const bookingId = `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const invoiceNumber = generateInvoiceNumber(bookingId);

    // Generate invoice PDF
    let invoicePdfBuffer: Buffer | undefined;
    try {
      invoicePdfBuffer = await generateInvoicePDF({
        invoiceNumber,
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        bookingDate: new Date(),
        startTime,
        endTime,
        pricing,
        rentalType: rentalTypeTitle,
      });
      // console.log('Invoice PDF generated successfully');
    } catch (pdfError) {
      console.error('Error generating invoice PDF:', pdfError);
      // Don't fail the booking if PDF generation fails
    }

    // Sync client with Payload CMS
    try {
      const payload = await getPayload({ config });

      const existingClients = await payload.find({
        collection: 'clients',
        where: {
          email: {
            equals: body.clientEmail,
          },
        },
      });

      let client: any;
      if (existingClients.docs.length > 0) {
        client = existingClients.docs[0];
        client = await payload.update({
          collection: 'clients',
          id: client.id,
          data: {
            phone: body.clientPhone || client.phone,
            bandName: body.bandName || client.bandName,
          },
        });
        // console.log(`Updated existing client: ${client.id}`);
      } else {
        client = await payload.create({
          collection: 'clients',
          data: {
            name: body.clientName,
            email: body.clientEmail,
            phone: body.clientPhone,
            bandName: body.bandName,
          },
        });
        // console.log(`Created new client: ${client.id}`);
      }
    } catch (payloadError) {
      console.error('Error syncing client with Payload CMS:', payloadError);
    }

    // Log transaction for analytics
    try {
      const payload = await getPayload({ config });
      const today = new Date().toISOString().split('T')[0];
      const purchasePrice = pricing.subtotal || pricing.total / 1.13;
      const taxAmount = pricing.total - purchasePrice;

      await payload.create({
        collection: 'transactions',
        data: {
          transactionDate: today,
          purchasePrice: Number(purchasePrice.toFixed(2)),
          taxAmount: Number(taxAmount.toFixed(2)),
          clientEmail: body.clientEmail,
          bookingStartTime: startTime.toISOString(),
        },
      });
      // console.log('Transaction logged for analytics');
    } catch (transactionError) {
      console.error('Error logging transaction:', transactionError);
    }

    // Send confirmation emails
    try {
      await sendBookingConfirmationEmail(
        body.clientEmail,
        body.clientName,
        startTime,
        endTime,
        pricing.total,
        rentalTypeTitle,
        bookingId,
        invoicePdfBuffer
      );

      await notifyAdminNewBooking(
        body.clientEmail,
        body.clientName,
        startTime,
        endTime,
        pricing.total,
        rentalTypeTitle,
        bookingId,
        invoicePdfBuffer
      );

      // console.log('Confirmation emails sent');
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
    }

    // Return success response
    const response = {
      success: true,
      bookingId,
      clientEmail: body.clientEmail,
      clientName: body.clientName,
      rentalType: rentalTypeTitle,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: body.duration,
      totalPrice: pricing.total,
      googleCalendarEventId: googleEventId,
      message: `Booking confirmed! A confirmation email has been sent to ${body.clientEmail}`,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Validate the booking request
 */
function validateBookingRequest(booking: BookingRequest): string | null {
  if (!booking.clientName?.trim()) {
    return 'Client name is required';
  }

  if (!booking.clientEmail?.trim()) {
    return 'Client email is required';
  }

  if (!booking.preferredDate?.trim()) {
    return 'Preferred date is required';
  }

  if (!booking.preferredTime?.trim()) {
    return 'Preferred time is required';
  }

  if (!booking.duration || booking.duration < 0.5) {
    return 'Duration must be at least 0.5 hours';
  }

  if (booking.duration > 8) {
    return 'Duration cannot exceed 8 hours';
  }

  if (!['hourly-rehearsal', 'hourly-recording', 'monthly'].includes(booking.rentalType)) {
    return 'Invalid rental type';
  }

  return null;
}
