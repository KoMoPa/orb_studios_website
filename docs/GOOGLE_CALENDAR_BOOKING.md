# Google Calendar Booking Integration Guide

## Overview

This guide covers the complete Google Calendar booking integration for your Orb Studios website. Users can now:

- 🗓️ Browse a calendar to select available dates
- ⏰ View only available time slots (blocked times are automatically hidden)
- ✅ Complete a booking instantly
- 📧 Receive confirmation emails
- 📅 Have the event automatically added to your Google Calendar

## Files Added

### API Routes
- `src/app/(frontend)/api/booking/availability/route.ts` - Get available time slots for a date
- `src/app/(frontend)/api/booking/create/route.ts` - Create a new booking

### Components
- `src/components/BookingCalendar/BookingCalendarComponent.tsx` - Interactive calendar UI component

### Pages
- `src/app/(frontend)/booking/page.tsx` - Main booking page

## Setup Steps

### 1. Verify Environment Variables

Make sure you have all required environment variables in `.env.local`:

```env
# Google Calendar (required)
GOOGLE_CALENDAR_PROJECT_ID=your-project-id
GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_CALENDAR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_EMAIL=orbmusicstudios@gmail.com

# Email Service (required for confirmations)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

> **Note:** If you haven't set up Google Calendar API yet, follow the detailed instructions in `BOOKING_SETUP.md`.

### 2. Start Your Development Server

```bash
pnpm dev
```

### 3. Access the Booking Page

Navigate to: `http://localhost:3000/booking`

## Features

### Availability Checking
- Syncs in real-time with your Google Calendar
- Automatically hides blocked/booked times
- Shows 30-minute time slots
- Studio hours: 9 AM - 10 PM
- Minimum 24-hour advance booking required
- Maximum 6 months in advance booking allowed

### Booking Creation
When a user completes a booking:

1. ✅ Availability is verified one final time (prevents double-booking)
2. 📅 Event is created on your Google Calendar
3. 📧 Confirmation email sent to client with booking details
4. 📨 Admin notification email sent to `orbmusicstudios@gmail.com`
5. 💰 Price is calculated based on rental type and duration

### Pricing

```
Hourly Rehearsal:  $30/hr
Hourly Recording:  $50/hr
Monthly Rental:    $400/month
Gear Storage:      $50/month (optional add-on)
```

Prices are automatically calculated and displayed in the booking form.

## API Endpoints

### GET /api/booking/availability
Quick check if a specific time slot is available.

**Query Parameters:**
- `date` (required): Date in `YYYY-MM-DD` format
- `time` (required): Time in `HH:mm` format (24-hour)
- `durationMinutes` (optional): Duration in minutes (default: 60)

**Example:**
```bash
curl "http://localhost:3000/api/booking/availability?date=2026-04-15&time=14:00&durationMinutes=120"
```

**Response:**
```json
{
  "date": "2026-04-15",
  "time": "14:00",
  "available": true
}
```

### POST /api/booking/availability
Get all available time slots for a specific date.

**Request Body:**
```json
{
  "date": "2026-04-15",
  "durationMinutes": 120,
  "rentalType": "hourly-rehearsal"
}
```

**Response:**
```json
{
  "date": "2026-04-15",
  "durationMinutes": 120,
  "slots": [
    {
      "startTime": "09:00",
      "endTime": "10:00",
      "available": true
    },
    {
      "startTime": "09:30",
      "endTime": "10:30",
      "available": false
    }
  ],
  "availableCount": 8
}
```

### POST /api/booking/create
Create a new booking and add event to Google Calendar.

**Request Body:**
```json
{
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "clientPhone": "555-123-4567",
  "bandName": "The Rockers",
  "preferredDate": "2026-04-15",
  "preferredTime": "14:00",
  "duration": 120,
  "rentalType": "hourly-rehearsal",
  "additionalInfo": "First time, please help with setup",
  "gearStorage": false
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "bookingId": "BOOK-1704067200000-ABC123XYZ",
  "clientEmail": "john@example.com",
  "clientName": "John Doe",
  "rentalType": "hourly-rehearsal",
  "startTime": "2026-04-15T14:00:00.000Z",
  "endTime": "2026-04-15T16:00:00.000Z",
  "duration": 120,
  "totalPrice": 60,
  "googleCalendarEventId": "abcd1234efgh5678ijkl",
  "message": "Booking confirmed! A confirmation email has been sent to john@example.com"
}
```

**Response (Error - Slot Unavailable):**
```json
{
  "error": "This time slot is no longer available. Please choose another time.",
  "available": false
}
```

## Session Type Options

- `rehearsal` - Band rehearsal/practice
- `recording` - Recording session
- `rehearsal-recording` - Combined rehearsal and recording

## Rental Type Options

- `hourly-rehearsal` - Pay-per-hour rehearsal ($30/hr)
- `hourly-recording` - Pay-per-hour recording ($50/hr)
- `monthly` - Monthly unlimited rental ($400/month)

## Testing the Integration

### Test 1: Check Availability
```bash
curl -X POST http://localhost:3000/api/booking/availability \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-04-20",
    "durationMinutes": 60,
    "rentalType": "hourly-rehearsal"
  }'
```

### Test 2: Create a Test Booking
```bash
curl -X POST http://localhost:3000/api/booking/create \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test User",
    "clientEmail": "test@example.com",
    "clientPhone": "555-1234",
    "bandName": "Test Band",
    "preferredDate": "2026-04-20",
    "preferredTime": "14:00",
    "duration": 120,
    "rentalType": "hourly-rehearsal",
    "additionalInfo": "Test booking",
    "gearStorage": false
  }'
```

### Test 3: Verify Event in Google Calendar
1. Go to your Google Calendar
2. Check that a new event was created with the booking details
3. Verify the event is listed on the correct date and time

### Test 4: Check Email Confirmations
1. Check the client email (test@example.com) for confirmation
2. Check orbmusicstudios@gmail.com for the admin notification

## Troubleshooting

### "Failed to fetch availability"
- Check that Google Calendar API is enabled in your Google Cloud Console
- Verify the service account email has been shared with your calendar with Editor access
- Check `.env.local` for correct environment variables

### "This time slot is no longer available"
- Another booking was just made for the same time
- Refresh the page and try a different time
- This is expected behavior and indicates proper double-booking prevention

### Emails not sending
- Verify your Resend API key is correct and active
- Check that your sending domain is verified in Resend
- Verify `orbmusicstudios@gmail.com` is configured as the admin email

### Calendar event not created
- Check browser console and server logs for errors
- Verify the time slot is correctly formatted
- Make sure the booking was successful (expect 201 status)

## Calendar Event Details

When a booking is created, the following event is added to your calendar:

- **Title:** "[Client Name] - [Session Type]"
- **Description:** Client details (name, email, phone, band name, session type, rental type, duration, price)
- **Time:** Exact booking date and time
- **Timezone:** America/Toronto
- **Attendees:** Client email (automatically invited)
- **Reminders:**
  - Email notification 24 hours before
  - Popup notification 1 hour before

## Blocking Times on Your Calendar

To block times when the studio is unavailable:

1. Go to Google Calendar (https://calendar.google.com)
2. Create an event on the dates/times you want to block
3. The event will automatically prevent those times from being bookable
4. Event title suggestions: "Studio Closed", "Maintenance", "Private Event", etc.

## Customization

### Adjust Studio Hours
Edit `src/app/(frontend)/api/booking/availability/route.ts`:

```typescript
const STUDIO_OPENS = 9;    // Opens at 9 AM
const STUDIO_CLOSES = 22;  // Closes at 10 PM
```

### Change Time Slot Duration
Edit `src/app/(frontend)/api/booking/availability/route.ts`:

```typescript
const SLOT_DURATION_MINUTES = 30;  // Show 30-minute slots
```

### Adjust Minimum Advance Booking
Edit `src/app/(frontend)/api/booking/availability/route.ts`:

```typescript
const BOOKING_MIN_ADVANCE_HOURS = 24;  // Require 24-hour advance notice
```

### Change Pricing
Edit `src/lib/booking/pricing.ts`:

```typescript
const HOURLY_RATES = {
    'hourly-rehearsal': 30,    // Change rehearsal rate
    'hourly-recording': 50,    // Change recording rate
    'monthly': 400,
};
```

## Next Steps

### Optional: Add Payment Integration
If you want to charge for bookings immediately:

1. Set up Stripe (already configured per your workspace)
2. Add payment processing to the booking creation endpoint
3. Update the booking form UI with payment component

### Optional: Add Booking History
Store booking records in a Payload collection to:

- Track all bookings in your admin
- Send reminders 24 hours before booking
- Allow clients to view/manage their bookings
- Generate revenue reports

### Optional: Add Email Reminders
Implement a cron job to send reminder emails:

- 24 hours before booking
- 1 hour before booking
- Follow-up thank you email after session

## Support

For issues or questions about the booking system:

1. Check the troubleshooting section above
2. Review server logs for detailed error messages
3. Verify all environment variables are correctly set
4. Test individual API endpoints with curl commands

## Files Reference

| File | Purpose |
|------|---------|
| `src/app/(frontend)/api/booking/availability/route.ts` | Availability checking API |
| `src/app/(frontend)/api/booking/create/route.ts` | Booking creation API |
| `src/components/BookingCalendar/BookingCalendarComponent.tsx` | Calendar UI component (Client) |
| `src/app/(frontend)/booking/page.tsx` | Booking page |
| `src/lib/booking/google-calendar.ts` | Google Calendar API functions |
| `src/lib/booking/email.tsx` | Email sending functions |
| `src/lib/booking/pricing.ts` | Price calculation logic |
| `src/lib/booking/types.ts` | TypeScript types |
