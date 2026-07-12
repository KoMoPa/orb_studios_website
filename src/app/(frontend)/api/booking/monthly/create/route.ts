import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability, createCalendarEvent } from '@/lib/booking/google-calendar';
import { sendMonthlyClientBookingConfirmationEmail } from '@/lib/booking/email';
import { generateInvoicePDF, generateInvoiceNumber } from '@/lib/booking/pdf-generator';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { getAvailableMonthlyHours, getMonthlyOverageCost } from '@/lib/booking/monthly-client';

const TIMEZONE = 'America/Toronto';
const MONTHLY_ALLOCATION = 24;
const REHEARSAL_RATE_ID = 1; // Assuming rehearsal is ID 1, adjust if needed

/**
 * Create a UTC date from a date string and time string in Eastern timezone
 */
function createEasternDate(dateString: string, timeString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);

  // Create a candidate date (in system local time)
  const candidateDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  
  // Get what time this date represents in Toronto timezone
  const torontoFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  const parts = torontoFormatter.formatToParts(candidateDate);
  const partMap: Record<string, number> = {};
  parts.forEach(p => {
    partMap[p.type] = parseInt(p.value, 10);
  });
  
  // Calculate the offset: how many hours/minutes we need to adjust
  const hourDiff = hours - partMap.hour;
  const minuteDiff = minutes - partMap.minute;
  
  // Adjust the candidate date to represent the correct Eastern time in UTC
  return new Date(candidateDate.getTime() + hourDiff * 3600000 + minuteDiff * 60000);
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
 * POST /api/booking/monthly/create
 * Create a quick booking for a monthly client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, preferredDate, preferredTime, duration } = body;

    // Validate required fields
    const requiredFields = ['email', 'preferredDate', 'preferredTime', 'duration'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate duration is a number
    const durationNum = Number(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      return NextResponse.json({ error: 'Duration must be a positive number' }, { status: 400 });
    }

    // Parse date and time as Eastern time
    const startTime = createEasternDate(preferredDate, preferredTime);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + durationNum * 60);

    // Validate date is in the future
    const now = new Date();
    if (startTime < now) {
      return NextResponse.json({ error: 'Cannot book times in the past' }, { status: 400 });
    }

    // Validate booking is not in the current hour
    // Round up to the next full hour
    const nextFullHour = new Date(now);
    nextFullHour.setMinutes(0, 0, 0);
    if (now.getMinutes() > 0 || now.getSeconds() > 0) {
      nextFullHour.setHours(nextFullHour.getHours() + 1);
    }

    if (startTime < nextFullHour) {
      return NextResponse.json(
        { error: 'Bookings must start from the next full hour' },
        { status: 400 }
      );
    }

    // Get payload
    const payload = await getPayload({ config });

    // Verify client and get details
    const clients = await payload.find({
      collection: 'clients',
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (clients.docs.length === 0 || !clients.docs[0].isMonthlyClient) {
      return NextResponse.json({ error: 'Not authorized as a monthly client' }, { status: 403 });
    }

    const client = clients.docs[0];

    // Check availability on google calendar
    console.log(`[Monthly] Checking availability for ${startTime.toISOString()} to ${endTime.toISOString()}`);
    const isAvailable = await checkAvailability(startTime, endTime);

    if (!isAvailable) {
      return NextResponse.json(
        {
          error: 'This time slot is no longer available. Please choose another time.',
          available: false,
        },
        { status: 409 }
      );
    }

    // Get rehearsal hourly rate
    let rehearsalHourlyRate = 30;
    try {
      const rateResponse = await fetch(
        `${process.env.PAYLOAD_PUBLIC_API_BASE || 'http://localhost:3000'}/api/rates?where[id][equals]=1`
      );
      if (rateResponse.ok) {
        const rateData = await rateResponse.json();
        if (rateData.docs && rateData.docs.length > 0) {
          rehearsalHourlyRate = rateData.docs[0].amount || 30;
        }
      }
    } catch (err) {
      console.error('[Monthly] Failed to fetch rate details:', err);
    }

    // Calculate available hours and overage
    const availableHours = getAvailableMonthlyHours(
      client.monthlyStartDate,
      client.monthlyHoursUsed || 0,
      client.monthlyHoursCancelled || 0
    );

    const overageInfo = getMonthlyOverageCost(durationNum, availableHours, rehearsalHourlyRate);

    // Create calendar event
    const eventTitle = `${client.bandName || client.name} - Monthly Booking`;
    const eventDescription = `
Client: ${client.name}
Email: ${client.email}
Duration: ${durationNum} hour${durationNum > 1 ? 's' : ''}
Rental Type: Rehearsal (Monthly Client)
${overageInfo.overageHours > 0 ? `OVERAGE: ${overageInfo.overageHours} hours charged at $${(rehearsalHourlyRate * 0.5).toFixed(2)}/hr` : 'Included in monthly allocation'}
    `.trim();

    let googleEventId: string | undefined;
    try {
      googleEventId = await createCalendarEvent(eventTitle, startTime, endTime, eventDescription);
      console.log(`[Monthly] Created Google Calendar event: ${googleEventId}`);
    } catch (error) {
      console.error('[Monthly] Error creating calendar event:', error);
    }

    // Update client's monthly hours used
    try {
      await payload.update({
        collection: 'clients',
        id: client.id,
        data: {
          monthlyHoursUsed: (client.monthlyHoursUsed || 0) + durationNum,
        },
      });
      console.log(`[Monthly] Updated client hours: ${client.id}`);
    } catch (error) {
      console.error('[Monthly] Error updating client hours:', error);
    }

    // Log transaction for overage charges if applicable
    if (overageInfo.overageHours > 0) {
      try {
        const HST_RATE = 0.13;
        const overageRate = rehearsalHourlyRate * 0.5;
        const overageSubtotal = overageInfo.overageCost;
        const hst = overageSubtotal * HST_RATE;
        const today = new Date().toISOString().split('T')[0];

        await payload.create({
          collection: 'transactions',
          data: {
            transactionDate: today,
            purchasePrice: Number(overageSubtotal.toFixed(2)),
            taxAmount: Number(hst.toFixed(2)),
            clientEmail: email,
            bookingStartTime: startTime.toISOString(),
          },
        });
        console.log('[Monthly] Transaction logged for overage charges');
      } catch (transactionError) {
        console.error('[Monthly] Error logging transaction:', transactionError);
      }
    }

    // Generate invoice PDF if there are overage charges
    let invoicePdfBuffer: Buffer | undefined;
    if (overageInfo.overageHours > 0) {
      try {
        const bookingId = `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const invoiceNumber = generateInvoiceNumber(bookingId);

        // Calculate overage pricing with HST
        const HST_RATE = 0.13;
        const overageRate = rehearsalHourlyRate * 0.5; // 50% of normal rate
        const overageSubtotal = overageInfo.overageCost; // Already calculated with 50% rate
        const hst = overageSubtotal * HST_RATE;
        const overageTotal = overageSubtotal + hst;

        invoicePdfBuffer = await generateInvoicePDF({
          invoiceNumber,
          clientName: client.name,
          clientEmail: email,
          bookingDate: new Date(),
          startTime,
          endTime,
          pricing: {
            rentalType: 'monthly' as any,
            hourlyRate: overageRate,
            totalHours: overageInfo.overageHours,
            subtotal: Number(overageSubtotal.toFixed(2)),
            total: Number(overageTotal.toFixed(2)),
          },
          rentalType: 'Rehearsal (Monthly - Overage)',
          isMonthly: true,
        });
        console.log(`[Monthly] Invoice PDF generated for overage charges`);
      } catch (pdfError) {
        console.error('[Monthly] Error generating invoice PDF:', pdfError);
        // Don't fail the booking if PDF generation fails
      }
    }

    // Send confirmation email with pricing info
    try {
      let monthlyDoorCode: string | undefined;
      try {
        const doorCodeResult = await payload.find({
          collection: 'doorCodes',
          where: { location: { equals: 'Monthly Front Door' } },
          limit: 1,
        });
        monthlyDoorCode = doorCodeResult.docs[0]?.code ?? undefined;
      } catch (dcError) {
        console.error('[Monthly] Error fetching door code:', dcError);
      }

      await sendMonthlyClientBookingConfirmationEmail(
        email,
        client.name,
        startTime,
        endTime,
        durationNum,
        overageInfo.monthlyIncluded,
        overageInfo.overageHours,
        overageInfo.overageCost,
        googleEventId,
        invoicePdfBuffer,
        eventTitle,
        eventDescription,
        monthlyDoorCode
      );
      console.log(`[Monthly] Confirmation email sent to ${email}`);
    } catch (error) {
      console.error('[Monthly] Error sending confirmation email:', error);
      // Don't fail the booking if email fails
    }

    // Calculate remaining hours
    const remainingHours = Math.max(0, MONTHLY_ALLOCATION - ((client.monthlyHoursUsed || 0) + durationNum - (client.monthlyHoursCancelled || 0)));

    return NextResponse.json(
      {
        success: true,
        booking: {
          googleCalendarEventId: googleEventId,
          clientName: client.name,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration: durationNum,
          monthlyAllocationStatus: {
            monthlyIncluded: overageInfo.monthlyIncluded,
            overageHours: overageInfo.overageHours,
            overageCost: overageInfo.totalCost,
            availableHoursAfter: remainingHours,
          },
        },
        message: `Booking confirmed! ${overageInfo.overageHours > 0 ? `You have ${overageInfo.overageHours} hours of overage charges totaling $${overageInfo.overageCost.toFixed(2)}.` : 'All hours included in your monthly allocation!'}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Monthly] Error creating monthly booking:', error);
    return NextResponse.json({ error: 'Failed to create booking. Please try again.' }, { status: 500 });
  }
}
