# 🚀 Quick Start: Google Calendar Booking Integration

Your Orb Studios website now has a complete booking system! Here's how to get started:

## 1️⃣ Verify Your Environment Variables

Make sure your `.env.local` file has these variables set (from your previous Google Calendar setup):

```env
GOOGLE_CALENDAR_PROJECT_ID=your-project-id
GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_CALENDAR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_EMAIL=orbmusicstudios@gmail.com
RESEND_API_KEY=your-resend-key
```

## 2️⃣ Start Your Dev Server

```bash
pnpm dev
```

## 3️⃣ Test the Booking System

1. Go to: `http://localhost:3000/booking`
2. You should see:
   - A calendar on the right showing available dates
   - A booking form on the left
   - Time slots appear below the calendar once you select a date

## 4️⃣ Make a Test Booking

1. Select a future date (tomorrow or later)
2. Choose an available time slot
3. Fill in your test information
4. Review the estimated price
5. Click "Complete Booking"

## 5️⃣ Verify Everything Works

After booking, check:

- ✅ **Google Calendar** - New event should appear (https://calendar.google.com)
- ✅ **Email** - Confirmation email sent to the email address used
- ✅ **Admin Email** - Check orbmusicstudios@gmail.com for admin notification

## 📋 Features

| Feature | Status |
|---------|--------|
| Calendar UI with date picker | ✅ Ready |
| Real-time availability sync | ✅ Ready |
| Automatic blocking of booked times | ✅ Ready |
| Create calendar events | ✅ Ready |
| Send confirmation emails | ✅ Ready |
| Double-booking prevention | ✅ Ready |
| Automatic price calculation | ✅ Ready |

## 🎛️ Customization Options

### Change Studio Hours
Edit: `src/app/(frontend)/api/booking/availability/route.ts`
```typescript
const STUDIO_OPENS = 9;    // Time studio opens
const STUDIO_CLOSES = 22;  // Time studio closes
```

### Change Pricing
Edit: `src/lib/booking/pricing.ts`
```typescript
const HOURLY_RATES = {
    'hourly-rehearsal': 30,    // $30/hr rehearsal
    'hourly-recording': 50,    // $50/hr recording
};
```

### Change Minimum Advance Booking
Edit: `src/app/(frontend)/api/booking/availability/route.ts`
```typescript
const BOOKING_MIN_ADVANCE_HOURS = 24;  // At least 24 hours in advance
```

## 📚 Full Documentation

For complete documentation, API details, troubleshooting, and more:

👉 See: `docs/GOOGLE_CALENDAR_BOOKING.md`

## 🚨 Troubleshooting

**Bookings showing "no available slots"?**
- Check Google Calendar is shared with service account (with Editor access)
- Verify environment variables are correct
- Check server logs for Google Calendar errors

**Emails not sending?**
- Verify Resend API key is correct
- Check domain is verified in Resend
- Check spam folder

**Calendar event not created?**
- Check Google Cloud Console quota limits
- Verify service account still has Editor access to calendar
- Review server console logs

## ✨ What's Happening Behind the Scenes

When someone books a session:

1. 🔍 Availability is checked against your Google Calendar
2. 📝 Their information is collected from the form
3. 💰 Price is automatically calculated
4. 📅 A new event is created on your Google Calendar
5. ✉️ Confirmation email sent to the client
6. 🔔 Admin notification sent to you

All blocked times on your calendar are automatically removed from available slots!

## 📈 Next Steps (Optional)

Want to enhance the booking system? Consider:

- [ ] Add payment processing (Stripe is ready!)
- [ ] Store bookings in Payload CMS for history/reports
- [ ] Add reminder emails (24h before, 1h before)
- [ ] Create booking management dashboard
- [ ] Add multiple team member calendars
- [ ] Implement cancellation requests

## 🎯 You're All Set!

Your booking system is ready to go. Users can now book sessions at:

👉 **`https://yourdomain.com/booking`**

For questions or customization, refer to the full documentation in `docs/GOOGLE_CALENDAR_BOOKING.md` or check the API routes in `src/app/(frontend)/api/booking/`.
