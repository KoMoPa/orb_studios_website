import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoiceDocument } from '@/lib/booking/invoice-document';
import { calculatePrice } from '@/lib/booking/pricing';
import { checkAvailability, createCalendarEvent } from '@/lib/booking/google-calendar';
import { sendBookingConfirmationEmail } from '@/lib/booking/email';
import { getOrCreateClient, isMonthlyClient } from '@/lib/booking/client-db';
import { generateIcalEventBuffer } from '@/lib/booking/ical';
import { addMinutes, parse } from 'date-fns';

// Validation schema
const BookingRequestSchema = z.object({
    clientName: z.string().min(2),
    clientEmail: z.string().email(),
    clientPhone: z.string().optional(),
    bandName: z.string().optional(),
    preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    preferredTime: z.string().regex(/^\d{2}:\d{2}$/),
    duration: z.number().min(30).max(480),
    rentalType: z.enum(['monthly', 'hourly-recording', 'hourly-rehearsal']),
    sessionType: z.enum(['rehearsal', 'recording', 'rehearsal-recording']),
    additionalInfo: z.string().optional(),
    gearStorage: z.boolean().default(false),
});

/**
 * POST /api/booking/create
 * Create a new booking
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = BookingRequestSchema.parse(body);

        // Parse date and time
        const startTime = parse(
            `${validatedData.preferredDate} ${validatedData.preferredTime}`,
            'yyyy-MM-dd HH:mm',
            new Date()
        );
        const endTime = addMinutes(startTime, validatedData.duration);

        // Check availability on Google Calendar
        const isAvailable = await checkAvailability(startTime, endTime);

        if (!isAvailable) {
            return NextResponse.json(
                { error: 'Time slot is not available. Please choose another time.' },
                { status: 409 }
            );
        }

        // Get or create client
        const client = await getOrCreateClient(
            validatedData.clientEmail,
            validatedData.clientName
        );

        // Check if client is monthly subscriber
        const isMonthly = await isMonthlyClient(validatedData.clientEmail);

        // Calculate price
        const pricing = calculatePrice(
            validatedData.rentalType,
            validatedData.duration,
            isMonthly,
            validatedData.gearStorage
        );

        // Generate invoice
        const invoiceNumber = `INV-${Date.now()}`;
        const invoiceDocument = React.createElement(InvoiceDocument, {
            invoiceNumber,
            clientName: validatedData.clientName,
            clientEmail: validatedData.clientEmail,
            bookingDate: new Date(),
            startTime,
            endTime,
            pricing,
            sessionType: validatedData.sessionType,
            rentalType: validatedData.rentalType,
        });

        const invoicePdf = await renderToBuffer(invoiceDocument);

        // Generate iCal event
        const eventTitle = `Orb Studios - ${validatedData.sessionType}`;
        const icalBuffer = generateIcalEventBuffer(
            eventTitle,
            startTime,
            endTime,
            validatedData.additionalInfo || 'Booking at Orb Studios',
            validatedData.clientEmail
        );

        // Create Google Calendar event
        const calendarEventId = await createCalendarEvent(
            eventTitle,
            startTime,
            endTime,
            validatedData.additionalInfo || '',
            [validatedData.clientEmail]
        );

        // Send confirmation emails with attachments
        await sendBookingConfirmationEmail(
            validatedData.clientEmail,
            validatedData.clientName,
            startTime,
            endTime,
            pricing.total,
            validatedData.sessionType,
            validatedData.rentalType,
            invoicePdf
        );

        // Return success response
        return NextResponse.json({
            success: true,
            bookingId: `BOOK-${Date.now()}`,
            clientEmail: validatedData.clientEmail,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            totalPrice: pricing.total,
            invoiceNumber,
            calendarEventId,
            message: 'Booking confirmed! Confirmation email sent.',
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid booking data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Booking creation error:', error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to create booking',
            },
            { status: 500 }
        );
    }
}
