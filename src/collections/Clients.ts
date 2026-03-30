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
