import { NextRequest, NextResponse } from 'next/server';
import { generateInvoicePDF, generateInvoiceNumber } from '@/lib/booking/pdf-generator';
import { calculatePrice } from '@/lib/booking/pricing';
import { PricingBreakdown } from '@/lib/booking/types';
import { sendBookingConfirmationEmail } from '@/lib/booking/email';

const MONTHLY_RATE = 400;
const HST_RATE = 0.13;

/**
 * POST /api/admin/generate-invoice
 * Generate an invoice PDF manually from admin panel
 * 
 * Request body:
 * {
 *   clientName: string;
 *   clientEmail: string;
 *   startTime?: ISO string;
 *   endTime?: ISO string;
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
      if (!body.startTime || !body.endTime) {
        return NextResponse.json(
          { error: 'startTime and endTime are required for hourly bookings' },
          { status: 400 }
        );
      }
    }

    let startTime: Date | undefined;
    let endTime: Date | undefined;
    let durationMinutes = 0;

    if (!isMonthly) {
      startTime = new Date(body.startTime);
      endTime = new Date(body.endTime);

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
      const durationMs = endTime.getTime() - startTime.getTime();
      durationMinutes = Math.round(durationMs / (1000 * 60));

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
      // Hourly booking - fetch rate and calculate with HST
      let hourlyRate = 30;
      try {
        const rateResponse = await fetch(
          `${process.env.PAYLOAD_PUBLIC_API_BASE || 'http://localhost:3000'}/api/rates?where[id][equals]=${body.rentalType}`
        );
        if (rateResponse.ok) {
          const rateData = await rateResponse.json();
          if (rateData.docs && rateData.docs.length > 0) {
            const rate = rateData.docs[0];
            hourlyRate = typeof rate.amount === 'number' ? rate.amount : parseFloat(String(rate.amount)) || 30;
          }
        }
      } catch (err) {
        console.error('Failed to fetch rate details:', err);
      }

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
      rentalType: body.rentalType,
      isMonthly,
    });

    // Send confirmation email to client and admin
    try {
      await sendBookingConfirmationEmail(
        body.clientEmail,
        body.clientName,
        startTime || new Date(),
        endTime || new Date(),
        pricing.total,
        body.rentalType,
        bookingId,
        invoicePdfBuffer
      );
      console.log(`Invoice email sent to ${body.clientEmail}`);
    } catch (emailError) {
      console.error('Error sending invoice email:', emailError);
      throw new Error(`Failed to send invoice email: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`);
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
