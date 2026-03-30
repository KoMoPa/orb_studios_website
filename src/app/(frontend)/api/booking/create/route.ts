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
 * Create a UTC date from a date string and time string in Eastern timezone
 * dateString: "2026-04-01", timeString: "14:00"
 */
function createEasternDate(dateString: string, timeString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Create a date interpreting the input as Eastern time
  // Create the date in UTC, then adjust for Eastern timezone offset
  const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
  
  // Calculate the offset between UTC and Eastern on this date
  let offset = new Date(year, month - 1, day).getTimezoneOffset() * 60000;
  return new Date(utcDate.getTime() + offset);
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.clientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Parse date and time as Eastern time
    const startTime = createEasternDate(body.preferredDate, body.preferredTime);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + body.duration);

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
    console.log(`Checking availability for ${startTime.toISOString()} to ${endTime.toISOString()}`);
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

    // Check if client is a monthly subscriber
    let isMonthlyClient = false;
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
      }
    } catch (err) {
      console.error('Failed to check client status:', err);
    }

    // Calculate pricing
    const pricing = calculatePrice(
      hourlyRate,
      body.duration,
      isMonthlyClient
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
      console.log(`Created Google Calendar event: ${googleEventId}`);
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
      console.log('Invoice PDF generated successfully');
    } catch (pdfError) {
      console.error('Error generating invoice PDF:', pdfError);
      // Don't fail the booking if PDF generation fails
    }

    // Sync client data with Payload CMS
    let clientId: string | undefined;
    try {
      const payload = await getPayload({ config });
      
      // Try to find existing client by email
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
        // Update existing client
        client = existingClients.docs[0];
        client = await payload.update({
          collection: 'clients',
          id: client.id,
          data: {
            phone: body.clientPhone || client.phone,
            bandName: body.bandName || client.bandName,
          },
        });
        console.log(`Updated existing client: ${client.id}`);
      } else {
        // Create new client
        client = await payload.create({
          collection: 'clients',
          data: {
            name: body.clientName,
            email: body.clientEmail,
            phone: body.clientPhone,
            bandName: body.bandName,
          },
        });
        console.log(`Created new client: ${client.id}`);
      }

      clientId = client.id;
    } catch (payloadError) {
      console.error('Error syncing client with Payload CMS:', payloadError);
      // Don't fail the booking if Payload sync fails, but log it
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
        body.clientName,
        body.clientEmail,
        startTime,
        rentalTypeTitle
      );
      console.log('Confirmation emails sent');
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't fail the booking if email fails
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

  if (!booking.duration || booking.duration < 30) {
    return 'Duration must be at least 30 minutes';
  }

  if (booking.duration > 480) {
    return 'Duration cannot exceed 8 hours';
  }

  if (!['hourly-rehearsal', 'hourly-recording', 'monthly'].includes(booking.rentalType)) {
    return 'Invalid rental type';
  }

  return null;
}
