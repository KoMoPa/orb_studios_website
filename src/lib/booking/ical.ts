import IcalGenerator from 'ical-generator';

/**
 * Generate iCalendar event and return as string
 */
export function generateIcalEvent(
    title: string,
    startTime: Date,
    endTime: Date,
    description: string,
    attendeeEmail: string,
    organizerEmail: string = 'orbmusicstudios@gmail.com'
): string {
    const cal = new IcalGenerator({
        prodId: '//Orb Studios//Studio Booking System//EN',
        name: 'Orb Studios Bookings',
        ttl: 60 * 60 * 24 * 7, // 7 days
    });

    cal.createEvent({
        id: `${Date.now()}@orbmusicstudios.com`,
        summary: title,
        description,
        start: startTime,
        end: endTime,
        location: '124 Portland St, Etobicoke, ON M8Y 1B2',
        organizer: {
            name: 'Orb Studios',
            email: organizerEmail,
        },
        attendees: [
            {
                email: attendeeEmail,
                name: attendeeEmail,
                rsvp: true,
                partstat: 'ACCEPTED',
            },
        ],
        timezone: 'America/Toronto',
        transp: 'OPAQUE',
        status: 'CONFIRMED',
    });

    return cal.toString();
}

/**
 * Generate iCalendar event as buffer (for email attachment)
 */
export function generateIcalEventBuffer(
    title: string,
    startTime: Date,
    endTime: Date,
    description: string,
    attendeeEmail: string
): Buffer {
    const icalString = generateIcalEvent(title, startTime, endTime, description, attendeeEmail);
    return Buffer.from(icalString, 'utf-8');
}
