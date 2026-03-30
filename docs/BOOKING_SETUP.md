# Orb Studios Booking System - Environment Setup Guide

## Step 1: Google Calendar API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (e.g., "Orb Studios Booking")
3. Enable the **Google Calendar API**:
   - Click "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

4. Create a Service Account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in service account name and click "Create and Continue"
   - Grant Editor role and continue
   - Click "Create Key" and select JSON
   - Save the JSON file securely

5. Share your Google Calendar with the service account:
   - Copy the service account email from the JSON key
   - Go to [Google Calendar](https://calendar.google.com)
   - Settings > Calendars > Select your calendar
   - Share with the service account email, grant Editor access

6. Update `.env.local`:
   ```env
   GOOGLE_CALENDAR_PROJECT_ID=<project-id from JSON>
   GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL=<client_email from JSON>
   GOOGLE_CALENDAR_PRIVATE_KEY="<private_key from JSON, keep quotes>"
   GOOGLE_CALENDAR_EMAIL=orbmusicstudios@gmail.com
   ```

## Step 2: Resend Email Service Setup

1. Go to [Resend.com](https://resend.com) and sign up for a free account
2. Navigate to API Keys and create a new one
3. Add to `.env.local`:
   ```env
   RESEND_API_KEY=<your-resend-api-key>
   ```

4. Verify your sending domain (Resend docs)

## Step 3: Stripe Setup (Optional - for payments)

1. Sign up at [stripe.com](https://stripe.com)
2. Get your API keys from Dashboard > Developers > API Keys
3. Add to `.env.local`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

## Complete `.env.local` Example

```env
# Database (already configured)
DATABASE_URI=postgresql://user:password@localhost:5432/orb-studios
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Google Calendar
GOOGLE_CALENDAR_PROJECT_ID=your-project-id
GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_CALENDAR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBA....\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_EMAIL=orbmusicstudios@gmail.com

# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxxx

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# App URLs
NEXT_PUBLIC_BOOKING_PAGE_URL=http://localhost:3000/booking
NEXT_PUBLIC_INVOICE_BASE_URL=http://localhost:3000/api/invoices
```

## Testing the Booking System

### 1. Start the dev server (if not running):
```bash
pnpm dev
```

### 2. Access the booking page:
```
http://localhost:3000/booking
```

### 3. Test the Availability API:
```bash
# Check if a date/time has availability
curl -X GET "http://localhost:3000/api/booking/availability?date=2026-03-15&durationMinutes=120"

# Get available time slots for a date
curl -X POST http://localhost:3000/api/booking/availability \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-03-15"}'
```

### 4. Test Create Booking API:
```bash
curl -X POST http://localhost:3000/api/booking/create \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test User",
    "clientEmail": "test@example.com",
    "clientPhone": "555-1234",
    "bandName": "Test Band",
    "preferredDate": "2026-03-15",
    "preferredTime": "14:00",
    "duration": 120,
    "rentalType": "hourly-rehearsal",
    "additionalInfo": "Test booking",
    "gearStorage": false
  }'
```

### Expected Response:
```json
{
  "success": true,
  "bookingId": "BOOK-1234567890",
  "clientEmail": "test@example.com",
  "startTime": "2026-03-15T14:00:00.000Z",
  "endTime": "2026-03-15T16:00:00.000Z",
  "totalPrice": 60,
  "invoiceNumber": "INV-1234567890",
  "calendarEventId": "googleapis-event-id",
  "message": "Booking confirmed! Confirmation email sent."
}
```

## Troubleshooting

**Google Calendar errors?**
- Verify service account email has been shared calendar access
- Check that `GOOGLE_CALENDAR_PRIVATE_KEY` includes full `-----BEGIN/END-----` lines
- Escape newlines properly in env var: use `\n` or keep it multiline in `.env.local`

**Email not sending?**
- Verify Resend API key is correct
- Check that sender domain is verified in Resend
- Check spam folder

**Availability showing no slots?**
- Ensure Google Calendar is properly shared with service account
- Verify the date is in the future
