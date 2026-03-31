import { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { admin } from '@/access/admin'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'phone', 'isMonthlyClient', 'updatedAt'],
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: admin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Client Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Email Address',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'bandName',
      type: 'text',
      label: 'Band/Artist Name',
    },
    {
      name: 'isMonthlyClient',
      type: 'checkbox',
      defaultValue: false,
      label: 'Current Monthly Client',
    },
    {
      name: 'monthlyStartDate',
      type: 'date',
      label: 'Monthly Plan Start Date',
      admin: {
        description: 'When they started their monthly plan (used for calculating monthly reset)',
        condition: (data) => data?.isMonthlyClient,
      },
    },
    {
      name: 'monthlyHoursUsed',
      type: 'number',
      defaultValue: 0,
      label: 'Monthly Hours Used',
      admin: {
        description: 'Hours booked this month',
        condition: (data) => data?.isMonthlyClient,
      },
    },
    {
      name: 'monthlyHoursCancelled',
      type: 'number',
      defaultValue: 0,
      label: 'Monthly Hours Cancelled (Refunded)',
      admin: {
        description: 'Hours from cancelled bookings refunded back to their allocation',
        condition: (data) => data?.isMonthlyClient,
      },
    },
    {
      name: 'monthlyHoursIncluded',
      type: 'number',
      label: 'Monthly Hours Included',
      admin: {
        description: 'Number of hours included in the monthly plan (e.g., 20, 40)',
        condition: (data) => data?.isMonthlyClient,
      },
    },
    {
      name: 'overageRatePercentage',
      type: 'number',
      defaultValue: 100,
      label: 'Overage Rate %',
      admin: {
        description: 'Percentage of hourly rate to charge for hours over the limit (100 = full price)',
        condition: (data) => data?.isMonthlyClient,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes about this client',
      },
    },
  ],
  timestamps: true,
}
