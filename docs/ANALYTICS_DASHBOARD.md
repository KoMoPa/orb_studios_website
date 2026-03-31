# Analytics Dashboard & Admin Tools

This guide explains the analytics features and customizations added to your Payload admin dashboard.

## Overview

Your dashboard now includes three main analytics sections:

1. **Door Codes Quick Access** - Easy access to all door codes from the dashboard
2. **Monthly Renters Overview** - View all current monthly clients and their hour usage
3. **Income Visualization** - Track total income and view daily income trends

## Collections

### Door Codes Collection

A dedicated admin-only collection for storing door codes.

**Location**: `/admin/collections/doorCodes`

**Fields**:
- `location` (text, required) - Door location description (e.g., "Front Door", "Studio A")
- `code` (text, required) - The actual door code/PIN
- `description` (textarea) - Optional notes about the door or code

**Access**: Admin only (read/create/update/delete)

**Usage**:
1. Go to the Payload admin panel
2. Click on "Door Codes" in the sidebar
3. Add new codes by clicking "Create"
4. Codes will automatically appear on your dashboard

### Transactions Collection

Tracks all financial transactions (bookings, monthly payments, etc.) for analytics and reporting.

**Location**: `/admin/collections/transactions`

**Fields**:
- `description` (text, required) - Transaction description
- `amount` (number, required) - Amount in CAD
- `type` (select, required) - Transaction type: "Booking", "Monthly", "Other"
- `clientEmail` (email) - Client email address
- `clientName` (text) - Client name
- `notes` (textarea) - Additional notes

**Access**: Admin only (read/create/update/delete)

**Automatic Transactions**:
- When a customer books through the website, a transaction is automatically created with:
  - Description: `{rentalType} - {bandName or clientName}`
  - Amount: Total booking price (including HST)
  - Type: "Booking" or "Monthly" (depending on client status)
  - Client details: Name and email

**Manual Transactions**:
You can manually add transactions for cash payments, invoices, refunds, etc.

## Dashboard Components

### Door Codes Card Grid

Displays all door codes in an easy-to-read grid format at the top of the dashboard.

**Features**:
- Color-coded cards for each location
- Large, readable code display (monospace font)
- Optional description for each code
- Hover effect for better visibility

### Monthly Renters Table

Shows all current monthly clients with usage statistics.

**Columns**:
- **Name**: Client name or email
- **Band/Artist**: Band/artist name (if provided)
- **Hours Used**: Total hours booked this month
- **Hours Cancelled**: Refunded hours from cancellations
- **Email**: Client email address

**Usage**:
- Review at a glance which monthly clients are active
- Check hour usage to identify highly used plans
- Sort by clicking table headers (if needed)

### Income Visualization

Displays financial data for the last 30 days.

**Metrics**:
- **Total Income**: Sum of all transactions in the period
- **Transaction Count**: Total number of transactions
- **Daily Income Chart**: Bar chart showing income by date

**Chart**:
- Hover over bars to see exact daily amounts
- Responsive design adapts to screen size
- Blue gradient bars with hover effects

## API Endpoints

### GET /api/analytics/door-codes

Returns all door codes.

**Response**:
```json
{
  "total": 2,
  "codes": [
    {
      "id": "code-id-1",
      "location": "Front Door",
      "code": "1234",
      "description": "Main entrance"
    }
  ]
}
```

### GET /api/analytics/monthly-renters

Returns all current monthly clients with usage data.

**Response**:
```json
{
  "total": 3,
  "renters": [
    {
      "id": "client-id-1",
      "name": "John Doe",
      "email": "john@example.com",
      "bandName": "The Band",
      "hoursUsed": 12,
      "hoursCancelled": 2,
      "monthlyStartDate": "2026-03-01"
    }
  ]
}
```

### GET /api/analytics/income?days=30

Returns income data for a specified number of days.

**Query Parameters**:
- `days` (number, optional) - Number of days to look back (default: 30)

**Response**:
```json
{
  "totalIncome": 1250.50,
  "transactionCount": 8,
  "days": 30,
  "chartData": [
    {
      "date": "2026-03-01",
      "amount": 150.00
    }
  ]
}
```

## Transaction Helper Functions

Located in `src/lib/analytics/transaction-helper.ts`, these utility functions help manage transactions programmatically:

### logTransaction(data)

Manually log a transaction.

```typescript
import { logTransaction } from '@/lib/analytics/transaction-helper'

await logTransaction({
  description: 'Studio A - 2 hours',
  amount: 59.80,
  type: 'booking',
  clientEmail: 'client@example.com',
  clientName: 'Client Name',
  notes: 'Cash payment'
})
```

### getTotalIncome(startDate, endDate)

Get total income for a date range.

```typescript
import { getTotalIncome } from '@/lib/analytics/transaction-helper'

const total = await getTotalIncome(
  new Date('2026-03-01'),
  new Date('2026-03-31')
)
```

### getIncomeBreakdown(startDate, endDate)

Get income breakdown by transaction type.

```typescript
import { getIncomeBreakdown } from '@/lib/analytics/transaction-helper'

const breakdown = await getIncomeBreakdown(
  new Date('2026-03-01'),
  new Date('2026-03-31')
)
// Returns: { booking: 500, monthly: 200, total: 700 }
```

## Customization

### Updating the Dashboard

The analytics dashboard is located at:
`src/components/AnalyticsDashboard/AnalyticsDashboard.tsx`

To customize:
1. Edit the component to add/remove sections
2. Modify the styling in `analytics-dashboard.scss`
3. Update API endpoints as needed

### Adding New Analytics Sections

1. Create a new API endpoint in `src/app/(payload)/api/analytics/`
2. Add a fetch call in `AnalyticsDashboard.tsx`
3. Render the data in your desired format
4. Style with CSS in the SCSS file

### Changing Update Frequency

By default, the dashboard fetches data on component mount. To add auto-refresh:

```typescript
useEffect(() => {
  const interval = setInterval(fetchAnalytics, 60000) // Refresh every 60 seconds
  return () => clearInterval(interval)
}, [])
```

## Notes

- **Door codes are admin-only** - They won't appear on the public website
- **Transactions are automatic** - Each booking automatically creates a transaction record
- **No booking collection needed** - Income tracking happens through the Transactions collection
- **Monthly client detection** - The system automatically checks if booking clients are monthly subscribers
- **Data persistence** - All analytics data is stored in your PostgreSQL database

## Troubleshooting

### Dashboard not showing data?

1. Check browser console for errors (F12)
2. Verify door codes and transactions exist in the collections
3. Confirm API endpoints are working: `/api/analytics/door-codes`

### Transactions not being created?

1. Check booking creation API responses in browser Network tab
2. Verify Transactions collection exists in Payload
3. Check Payload server logs for errors

### Charts not displaying?

1. Ensure you have transactions in the database
2. Check date ranges for filtering
3. Verify response format from `/api/analytics/income`
