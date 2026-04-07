import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Rooms: CollectionConfig = {
  slug: 'rooms',
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
        description: 'URL-friendly identifier (e.g., "jamroom", "mixroom")',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
    {
      name: 'heroImage',
      type: 'relationship',
      relationTo: 'media',
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
      name: 'heroGradientColor',
      type: 'select',
      options: [
        { label: 'Red to Yellow', value: 'from-red-500 to-yellow-400' },
        { label: 'Red to Orange', value: 'from-red-500 to-orange-400' },
        { label: 'Blue to Purple', value: 'from-blue-500 to-purple-400' },
        { label: 'Green to Teal', value: 'from-green-500 to-teal-400' },
      ],
      defaultValue: 'from-red-500 to-yellow-400',
    },
    {
      name: 'aboutSection',
      type: 'richText',
      required: false,
      admin: {
        description: 'Main content section about the room',
      },
    },
    {
      name: 'gearList',
      type: 'richText',
      required: false,
      admin: {
        description: 'Equipment and gear included in this space',
      },
    },
    {
      name: 'galleryImages',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      required: false,
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
          required: false,
          admin: {
            description: 'e.g., "357 Sq Ft" or "600 Square Meters"',
          },
        },
        {
          name: 'areaDetails',
          type: 'text',
          admin: {
            description: 'Additional area details, e.g., "3927 Cubic Feet (L x W x H)"',
          },
        },
        {
          name: 'etc',
          type: 'text',
          admin: {
            description: 'Additional miscellaneous information',
          },
        },
      ],
    },
    {
      name: 'rate',
      type: 'relationship',
      relationTo: 'rates',
      hasMany: true,
      admin: {
        description: 'Select a rate associated with this room',
      },
    },
    {
      name: 'customHeroCtaText',
      type: 'text',
      admin: {
        description: 'Text for the Custom Hero CTA button',
      },
    },
  ],
}