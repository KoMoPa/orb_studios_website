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
    create: async ({ req }) => req.user?.roles?.includes('admin'),
    update: async ({ req }) => req.user?.roles?.includes('admin'),
    delete: async ({ req }) => req.user?.roles?.includes('admin'),
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
