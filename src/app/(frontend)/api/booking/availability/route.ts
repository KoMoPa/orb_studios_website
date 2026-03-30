import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability, getCalendarEvents } from '@/lib/booking/google-calendar';

const TIMEZONE = 'America/Toronto'; // Eastern time

// Time slot configuration
const SLOT_DURATION_MINUTES = 30; // 30-minute slots
const STUDIO_OPENS = 9; // 9 AM
const STUDIO_CLOSES = 22; // 10 PM
const BOOKING_MIN_ADVANCE_HOURS = 24; // Must book 24 hours in advance

/**
 * Create a UTC date from a date string and time string in Eastern timezone
 * dateString: "2026-04-01", timeString: "14:00"
 */
function createEasternDate(dateString: string, timeString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Create a date interpreting the input as Eastern time
  // Get current offset to determine if EDT or EST
  const testDate = new Date(year, month - 1, day);
  
  // Create the date in UTC, then adjust for Eastern timezone offset
  const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
  
  // Calculate the offset between UTC and Eastern on this date
  // Format the UTC date as a string that represents Eastern time
  // Create a temporary date to check offset
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  // We need to find the UTC time that equals the given Eastern time
  // Start with UTC time and adjust
  let offset = new Date(year, month - 1, day).getTimezoneOffset() * 60000;
  return new Date(utcDate.getTime() + offset);
}

/**
 * Generate all possible time slots for a given date
 */
function generateTimeSlots(date: Date): string[] {
  const slots: string[] = [];
  
  for (let hour = STUDIO_OPENS; hour < STUDIO_CLOSES; hour++) {
    for (let minute = 0; minute < 60; minute += SLOT_DURATION_MINUTES) {
      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  
  return slots;
}

/**
 * POST /api/booking/availability
 * Get available time slots for a specific date
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, durationMinutes = 60, rentalType = 'hourly-rehearsal' } = body;

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    // Parse and validate date - treating as Eastern time
    let requestedDate: Date;
    try {
      requestedDate = createEasternDate(date, '00:00');
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    const now = new Date();
    
    if (isNaN(requestedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Check minimum advance booking requirement
    const minBookingDate = new Date(now);
    minBookingDate.setHours(minBookingDate.getHours() + BOOKING_MIN_ADVANCE_HOURS);
    
    if (requestedDate < minBookingDate) {
      return NextResponse.json(
        { 
          error: `Bookings must be made at least ${BOOKING_MIN_ADVANCE_HOURS} hours in advance`,
          availableDate: minBookingDate.toISOString().split('T')[0]
        },
        { status: 400 }
      );
    }

    // Don't allow bookings more than 6 months in advance
    const maxBookingDate = new Date(now);
    maxBookingDate.setMonth(maxBookingDate.getMonth() + 6);
    
    if (requestedDate > maxBookingDate) {
      return NextResponse.json(
        { error: 'Bookings can only be made up to 6 months in advance' },
        { status: 400 }
      );
    }

    // Get the date string in YYYY-MM-DD format for slot creation
    const [year, month, day] = date.split('-').map(Number);

    // Generate all possible slots for the day
    const allSlots = generateTimeSlots(new Date());
    const availableSlots = [];

    // Check each slot for availability
    for (const slot of allSlots) {
      const [hours, minutes] = slot.split(':').map(Number);
      
      // Create Eastern time dates and convert to UTC
      const dateStr = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      const endTimeStr = `${String(hours).padStart(2, '0')}:${String(minutes + durationMinutes).padStart(2, '0')}`;
      
      const slotStart = createEasternDate(dateStr, timeStr);
      const slotEnd = createEasternDate(dateStr, endTimeStr);

      // Calculate actual end time if it crosses hour boundary
      if (minutes + durationMinutes >= 60) {
        const endDate = new Date(slotStart);
        endDate.setMinutes(endDate.getMinutes() + durationMinutes);
        slotEnd.setTime(endDate.getTime());
      }

      // Check if slot ends after studio closes (in Eastern time)
      const slotEndHours = (minutes + durationMinutes) / 60;
      const slotEndHoursInt = Math.floor(slotEndHours);
      if (slotEndHoursInt >= STUDIO_CLOSES) {
        continue;
      }

      try {
        const isAvailable = await checkAvailability(slotStart, slotEnd);
        
        if (isAvailable) {
          const totalMinutes = minutes + durationMinutes;
          const endHours = hours + Math.floor(totalMinutes / 60);
          const endMinutes = totalMinutes % 60;
          availableSlots.push({
            startTime: slot,
            endTime: `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`,
            available: true,
          });
        }
      } catch (error) {
        console.error(`Error checking availability for slot ${slot}:`, error);
        // Still include the slot but mark as potentially unavailable
        availableSlots.push({
          startTime: slot,
          endTime: `${String(slotEnd.getHours()).padStart(2, '0')}:${String(slotEnd.getMinutes()).padStart(2, '0')}`,
          available: false,
        });
      }
    }

    return NextResponse.json({
      date: date,
      durationMinutes,
      slots: availableSlots,
      availableCount: availableSlots.filter(s => s.available).length,
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/booking/availability
 * Quick check if specific date/time is available
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const durationMinutes = parseInt(searchParams.get('durationMinutes') || '60');

    if (!date || !time) {
      return NextResponse.json(
        { error: 'Date and time are required' },
        { status: 400 }
      );
    }

    const [hours, minutes] = time.split(':').map(Number);
    const requestedDate = new Date(date);
    
    const slotStart = new Date(requestedDate);
    slotStart.setHours(hours, minutes, 0, 0);
    
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);

    const isAvailable = await checkAvailability(slotStart, slotEnd);

    return NextResponse.json({
      date,
      time,
      available: isAvailable,
    });

  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
