import type { CollectionConfig } from 'payload'

export const Rooms: CollectionConfig = {
  slug: 'rooms',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: async () => true,
    create: async ({ req }) => {
      if (!req.user) return false
      // Allow admin and editor roles
      if (req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor')) {
        return true
      }
      // Fallback: if this is the only/first user, grant access
      const userCount = await req.payload.count({
        collection: 'users',
      })
      return userCount === 1
    },
    update: async ({ req }) => {
      if (!req.user) return false
      // Allow admin and editor roles
      if (req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor')) {
        return true
      }
      // Fallback: if this is the only/first user, grant access
      const userCount = await req.payload.count({
        collection: 'users',
      })
      return userCount === 1
    },
    delete: async ({ req }) => {
      if (!req.user) return false
      // Only admins can delete
      const userCount = await req.payload.count({
        collection: 'users',
      })
      return req.user?.roles?.includes('admin') || userCount === 1
    },
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
      required: true,
      admin: {
        description: 'Main content section about the room',
      },
    },
    {
      name: 'gearList',
      type: 'richText',
      required: true,
      admin: {
        description: 'Equipment and gear included in this space',
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
          name: 'monthlyRate',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "$400" or "€350"',
          },
        },
        {
          name: 'monthlyRateLabel',
          type: 'text',
          defaultValue: 'Monthly Rate',
        },
      ],
    },
    {
      name: 'bookingSection',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Ready to Book?',
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'Email to Book',
        },
        {
          name: 'bookingEmail',
          type: 'email',
          required: true,
        },
      ],
    },
  ],
}
