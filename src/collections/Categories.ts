import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
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
