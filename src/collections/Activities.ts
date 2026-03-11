import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { adminOrEditor } from '../access/adminOrEditor'

export const Activities: CollectionConfig = {
  slug: 'activities',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: anyone,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "podcast", "masterclass")',
      },
    },
    {
      name: 'heroImage',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Background image for the hero section',
      },
    },
    {
      name: 'heroTitle',
      type: 'text',
      required: true,
      admin: {
        description: 'Main heading in the hero section',
      },
    },
    {
      name: 'heroGradient',
      type: 'group',
      fields: [
        {
          name: 'startColor',
          type: 'text',
          required: true,
          defaultValue: '#ef4444',
          admin: {
            description: 'Start color in hex format (e.g., #ef4444) or rgb format (e.g., rgb(239, 68, 68))',
          },
        },
        {
          name: 'endColor',
          type: 'text',
          required: true,
          defaultValue: '#facc15',
          admin: {
            description: 'End color in hex format (e.g., #facc15) or rgb format (e.g., rgb(250, 204, 21))',
          },
        },
      ],
    },
    {
      name: 'aboutSection',
      type: 'richText',
      required: true,
      admin: {
        description: 'Main content section about the activity',
      },
    },
    {
      name: 'gearList',
      type: 'richText',
      required: true,
      admin: {
        description: 'Equipment and gear included in this activity',
      },
    },
    {
      name: 'galleryImages',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      required: true,
      admin: {
        description: 'Images to display in the gallery section',
      },
    },
    {
      name: 'infoBox',
      type: 'group',
      fields: [
        {
          name: 'area',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., any deets',
          },
        },
        {
          name: 'hourlyRate',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "$30" or "€25"',
          },
        },
        {
          name: 'hourlyRateLabel',
          type: 'text',
          defaultValue: 'Hourly Rate',
        },
        {
          name: 'test',
          type: 'text',
          defaultValue: 'Test',
        }
      ],
    },
    {
      name: 'bookingSection',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Got another idea?',
        },
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'Email to Let us Know What!',
        },
      ],
    },
  ],
}
