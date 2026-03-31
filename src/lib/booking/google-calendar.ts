import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

/**
 * Initialize Google Calendar API client with service account credentials
 */
export function initializeGoogleCalendar() {
    const auth = new google.auth.GoogleAuth({
        projectId: process.env.GOOGLE_CALENDAR_PROJECT_ID,
        credentials: {
            type: 'service_account',
            project_id: process.env.GOOGLE_CALENDAR_PROJECT_ID,
            private_key_id: 'key-id',
            private_key: process.env.GOOGLE_CALENDAR_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            client_email: process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL,
            client_id: 'client-id',
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            token_uri: 'https://oauth2.googleapis.com/token',
            auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        },
        scopes: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
        ],
    });

    return google.calendar({ version: 'v3', auth });
}

/**
 * Check availability for a given date and time range
 */
export async function checkAvailability(
    startTime: Date,
    endTime: Date,
    calendarEmail: string = process.env.GOOGLE_CALENDAR_EMAIL!
) {
    try {
        const calendar = initializeGoogleCalendar();

        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin: startTime.toISOString(),
                timeMax: endTime.toISOString(),
                items: [{ id: calendarEmail }],
            },
        });

        const busy = response.data.calendars?.[calendarEmail]?.busy || [];

        // Check if any busy slot overlaps with requested time
        const isAvailable = !busy.some((slot) => {
            const slotStart = new Date(slot.start!);
            const slotEnd = new Date(slot.end!);
            return startTime < slotEnd && endTime > slotStart;
        });

        return isAvailable;
    } catch (error) {
        console.error('Error checking calendar availability:', error);
        throw new Error('Failed to check availability');
    }
}

/**
 * Create a Google Calendar event for confirmed booking
 */
export async function createCalendarEvent(
    title: string,
    startTime: Date,
    endTime: Date,
    description: string,
    attendeesEmail?: string[],
    calendarEmail: string = process.env.GOOGLE_CALENDAR_EMAIL!
) {
    try {
        const calendar = initializeGoogleCalendar();

        // Start with minimal event structure
        const event: any = {
            summary: title,
            start: {
                dateTime: startTime.toISOString(),
                timeZone: 'America/Toronto',
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: 'America/Toronto',
            },
        };

        // Only add description if provided and not too long
        if (description && description.trim().length > 0) {
            const sanitizedDescription = description
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join('\n');
            
            // Google Calendar has a limit on description length
            if (sanitizedDescription.length < 8000) {
                event.description = sanitizedDescription;
            }
        }

        console.log('Creating calendar event:', { 
            title, 
            startTime: event.start.dateTime, 
            endTime: event.end.dateTime,
            hasDescription: !!event.description,
        });

        const response = await calendar.events.insert({
            calendarId: calendarEmail,
            requestBody: event,
        });

        console.log('Calendar event created successfully:', response.data.id);
        return response.data.id;
    } catch (error: any) {
        console.error('Error creating calendar event:', error?.message || error);
        if (error?.errors) {
            console.error('Calendar API errors:', JSON.stringify(error.errors, null, 2));
        }
        if (error?.response?.data) {
            console.error('Calendar API response data:', JSON.stringify(error.response.data, null, 2));
        }
        if (error?.error) {
            console.error('Calendar error details:', JSON.stringify(error.error, null, 2));
        }
        throw new Error(`Failed to create calendar event: ${error?.message || 'Unknown error'}`);
    }
}

/**
 * Get all bookings for a date range
 */
export async function getCalendarEvents(
    startDate: Date,
    endDate: Date,
    calendarEmail: string = process.env.GOOGLE_CALENDAR_EMAIL!
) {
    try {
        const calendar = initializeGoogleCalendar();

        const response = await calendar.events.list({
            calendarId: calendarEmail,
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        return response.data.items || [];
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        throw new Error('Failed to fetch calendar events');
    }
}
