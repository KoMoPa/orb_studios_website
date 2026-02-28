import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: async () => true,
    create: async ({ req }) => {
      return req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor') || false
    },
    update: async ({ req }) => {
      return req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor') || false
    },
    delete: async ({ req }) => {
      return req.user?.roles?.includes('admin') || false
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
  ],
}
