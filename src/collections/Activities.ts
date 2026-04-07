import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Activities: CollectionConfig = {
  slug: 'activities',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Studio',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
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
        description: 'URL-friendly identifier (e.g., "vocal-coaching", "beat-making")',
      },
    },
    {
      name: 'picture',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description: 'Featured image for the activity',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Short description of the suggested activity for the studio',
      },
    },
    {
      name: 'equipmentIncluded',
      type: 'richText',
      required: true,
      admin: {
        description: 'Equipment and resources included for this activity',
      },
    },
  ],
}
