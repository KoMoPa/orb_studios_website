import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkAvailability } from '@/lib/booking/google-calendar';
import { addMinutes, startOfDay, endOfDay } from 'date-fns';

// Validation schema
const AvailabilityRequestSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
    durationMinutes: z.number().min(30).max(480), // 30 min to 8 hours
});

type AvailabilityRequest = z.infer<typeof AvailabilityRequestSchema>;

/**
 * GET /api/booking/availability
 * Check if a specific date and duration is available
 * Query: date=2026-03-15, durationMinutes=120
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const date = searchParams.get('date');
        const durationMinutes = searchParams.get('durationMinutes');

        // Validate input
        const validatedData = AvailabilityRequestSchema.parse({
            date: date,
            durationMinutes: parseInt(durationMinutes || '120'),
        });

        const targetDate = new Date(`${validatedData.date}T09:00:00`); // Default 9 AM start
        const endDate = addMinutes(targetDate, validatedData.durationMinutes);

        // Check Google Calendar availability
        const isAvailable = await checkAvailability(targetDate, endDate);

        return NextResponse.json({
            date: validatedData.date,
            durationMinutes: validatedData.durationMinutes,
            available: isAvailable,
            suggestedStartTime: '09:00',
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request parameters', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Availability check error:', error);
        return NextResponse.json(
            { error: 'Failed to check availability' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/booking/availability
 * Get available time slots for a given date
 * Body: { date: "2026-03-15" }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { date } = z.object({
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        }).parse(body);

        const dayStart = new Date(`${date}T09:00:00`); // 9 AM
        const dayEnd = new Date(`${date}T21:00:00`); // 9 PM

        // Define available slots (9 AM to 9 PM in 2-hour increments)
        const slots = [];
        let current = new Date(dayStart);

        while (current < dayEnd) {
            const slotEnd = addMinutes(current, 120); // 2-hour slots
            const isAvailable = await checkAvailability(current, slotEnd);

            slots.push({
                startTime: current.toISOString().substr(11, 5), // HH:mm
                endTime: slotEnd.toISOString().substr(11, 5),
                available: isAvailable,
            });

            current = addMinutes(current, 120);
        }

        return NextResponse.json({
            date,
            slots: slots.filter((s) => s.available),
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request parameters', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Availability fetch error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to fetch availability',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
