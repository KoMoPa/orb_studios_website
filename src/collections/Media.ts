import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
  },
  upload: {
    staticDir: 'public/media',
    staticURL: '/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'center',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'center',
      },
      {
        name: 'tablet',
        width: 1024,
        height: 768,
        position: 'center',
      },
    ],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'],
  },
  access: {
    read: async () => true,
    create: async ({ req }) => {
      if (!req.user) return false
      if (req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor')) {
        return true
      }
      const userCount = await req.payload.count({ collection: 'users' })
      return userCount === 1
    },
    update: async ({ req }) => {
      if (!req.user) return false
      if (req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor')) {
        return true
      }
      const userCount = await req.payload.count({ collection: 'users' })
      return userCount === 1
    },
    delete: async ({ req }) => {
      if (!req.user) return false
      const userCount = await req.payload.count({ collection: 'users' })
      return req.user?.roles?.includes('admin') || userCount === 1
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
  ],
}
