import type { CollectionConfig } from 'payload'
import { admin } from '../access/admin'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: {
    useAsTitle: 'transactionDate',
    group: 'Operations',
    defaultColumns: ['transactionDate', 'purchasePrice', 'taxAmount', 'createdAt'],
    preview: false,
  },
  access: {
    read: admin,
    create: admin,
    update: admin,
    delete: admin,
  },
  fields: [
    {
      name: 'transactionDate',
      type: 'date',
      required: true,
      label: 'Transaction Date',
      admin: {
        description: 'When the transaction occurred',
      },
    },
    {
      name: 'purchasePrice',
      type: 'number',
      required: true,
      label: 'Purchase Price (CAD)',
      admin: {
        description: 'Income amount before tax',
        step: 0.01,
      },
    },
    {
      name: 'taxAmount',
      type: 'number',
      required: true,
      label: 'Tax Amount (CAD)',
      admin: {
        description: 'HST or applicable tax',
        step: 0.01,
      },
    },
    {
      name: 'clientEmail',
      type: 'email',
      required: true,
      label: 'Client Email',
      admin: {
        readOnly: true,
        description: 'Auto-populated from booking',
      },
    },
    {
      name: 'bookingStartTime',
      type: 'date',
      required: false,
      label: 'Booking Start Date',
      admin: {
        readOnly: true,
        description: 'Date of the actual booking (for manual invoices)',
      },
    },
  ],
  timestamps: true,
}
