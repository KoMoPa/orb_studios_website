# PDF Invoice Generator Implementation

## System Overview

The PDF invoice generator is integrated into the booking system to automatically generate and email invoices, while also providing manual invoice generation via the Payload admin panel.

## Features

### 1. Automatic Invoice Generation on Booking
- **Location**: `src/app/(frontend)/api/booking/create/route.ts`
- **Process**:
  1. When a booking is created via the booking API
  2. Invoice PDF is automatically generated with the booking details
  3. PDF is attached to the confirmation email sent to the client and admin
  4. Invoice includes booking details, pricing breakdown, and studio information

### 2. Manual Invoice Generation in Payload Admin
- **Location**: `/api/admin/generate-invoice` endpoint
- **Components**: `src/components/InvoiceGenerator/`
- **Admin Page**: `/admin/invoice-generator`
- **Usage**: Admins can manually generate invoices for any booking (useful for regenerating lost copies or generating invoices for offline bookings)

## Files Created/Modified

### New Files
1. **`src/lib/booking/pdf-generator.ts`** - PDF generation utilities
   - `generateInvoicePDF()` - Main function to render PDF buffer
   - `generateInvoiceNumber()` - Creates invoice number from booking ID
   - `formatRentalType()` - Display-friendly rental type formatting

2. **`src/app/(payload)/api/admin/generate-invoice/route.ts`** - Admin API endpoint
   - POST endpoint for generating invoices from admin panel
   - Validates booking data and generates PDF
   - Returns PDF as downloadable file attachment

3. **`src/components/InvoiceGenerator/InvoiceGenerator.tsx`** - Admin UI component
   - React component with form for entering booking details
   - Calls admin API and triggers PDF download
   - Client-side validation and error handling

4. **`src/components/InvoiceGenerator/InvoiceGenerator.module.scss`** - Component styling
   - Modern, responsive form design
   - Error and success message styling
   - Mobile-friendly layout

5. **`src/app/(payload)/admin/invoice-generator/page.tsx`** - Admin page
   - Payload admin page at `/admin/invoice-generator`
   - Embeds the InvoiceGenerator component

### Modified Files
1. **`src/app/(frontend)/api/booking/create/route.ts`**
   - Added PDF generation on booking creation
   - Passes invoice PDF buffer to email function
   - Improved error handling to not fail booking if PDF generation fails

2. **`src/lib/booking/email.tsx`** (Already had support)
   - `sendBookingConfirmationEmail()` accepts optional `invoicePdfAttachment: Buffer`
   - Attaches PDF to both client and admin emails

## PDF Invoice Document

The PDF is generated using `@react-pdf/renderer` via the `InvoiceDocument` component:
- **Location**: `src/lib/booking/invoice-document.tsx`
- **Contents**:
  - Invoice header with invoice number and studio details
  - Billing information (client name, email)
  - Booking details (session type, rental type, date/time, duration)
  - Pricing breakdown (hourly rate, subtotal, discounts, fees)
  - Professional styling with Orb Studios branding (orange accent #FF6B35)

## API Endpoints

### POST /api/booking/create (Existing - Enhanced)
**Automatic invoice generation workflow**
- Generates invoice PDF automatically
- Attaches to confirmation email
- No changes needed to client integration

### POST /api/admin/generate-invoice (New)
**Manual invoice generation**
```json
Request Body:
{
  "clientName": "string",
  "clientEmail": "string",
  "startTime": "ISO 8601 datetime",
  "endTime": "ISO 8601 datetime",
  "rentalType": "hourly-rehearsal | hourly-recording | monthly",
  "hourlyRate": 30 (optional),
  "monthlyDiscount": 0 (optional),
  "gearStorageFee": 0 (optional)
}

Response: PDF file as attachment
```

## Pricing Calculation

Both automatic and manual invoice generation use the same pricing function:
- **Location**: `src/lib/booking/pricing.ts`
- Calculates based on:
  - Hourly rate (fetched from Rates collection or provided)
  - Duration in minutes
  - Monthly discounts
  - Gear storage fees

## Invoice Number Format

Format: `INV-YYYY-MM-HASH`
Example: `INV-2026-03-ABC123XYZ`

- Year and month from invoice generation date
- Hash derived from booking ID for uniqueness

## Admin Panel Access

1. Navigate to `/admin/invoice-generator` in Payload CMS
2. Fill in booking details (client info, dates/times, rental type)
3. Optionally customize hourly rate and fees
4. Click "Generate & Download Invoice"
5. PDF downloads automatically with filename: `invoice-[client-name]-[date].pdf`

## Booking Storage Strategy

- **No Payload Collection**: Bookings are NOT stored in Postgres
- **Source of Truth**: Google Calendar
- **Client Metadata**: User info stored in Payload Users collection
- **Invoice Approach**: Stateless - invoices generated on-demand using booking details

## Environment Variables Required

```
# For admin API (optional, adds security layer)
PAYLOAD_ADMIN_TOKEN=your-secure-token

# Existing variables used:
PAYLOAD_PUBLIC_API_BASE=http://localhost:3000
RESEND_API_KEY=...
RESEND_SENDER_EMAIL=...
ADMIN_EMAIL=...
```

## Error Handling

### Automatic Generation
- PDF generation failures don't block booking creation
- Booking proceeds with or without PDF attachment
- Errors logged to console for debugging

### Manual Generation
- Client-side validation of required fields
- Server-side validation of date/time logic
- User-friendly error messages returned
- PDF generation errors trigger detailed error response

## Testing

### Manual Invoice Generation Test
```bash
curl -X POST http://localhost:3000/api/admin/generate-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test User",
    "clientEmail": "test@example.com",
    "startTime": "2026-04-15T14:00:00Z",
    "endTime": "2026-04-15T16:00:00Z",
    "rentalType": "hourly-rehearsal"
  }' \
  --output invoice.pdf
```

## Future Enhancements

1. **Invoice Search**: Add ability to search and regenerate invoices by booking ID
2. **Batch Generation**: Generate invoices for multiple bookings at once
3. **Invoice Customization**: Allow custom logos, terms, payment info
4. **Invoice History**: Archive and retrieve previously generated invoices
5. **Email Resend**: Admin panel option to resend invoice to client email
6. **PDF Preview**: Show PDF preview before download in admin panel
