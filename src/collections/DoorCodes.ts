import type { CollectionConfig } from 'payload'
import { admin } from '../access/admin'

export const DoorCodes: CollectionConfig = {
  slug: 'doorCodes',
  admin: {
    useAsTitle: 'location',
    group: 'Operations',
    defaultColumns: ['location', 'code', 'description', 'updatedAt'],
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
      name: 'location',
      type: 'text',
      required: true,
      label: 'Door Location',
      admin: {
        description: 'e.g., "Front Door", "Studio A", "Main Entrance"',
      },
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      label: 'Door Code',
      admin: {
        description: 'The actual door code/PIN',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional notes about this door or code',
      },
    },
  ],
  timestamps: true,
}
