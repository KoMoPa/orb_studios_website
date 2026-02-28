import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: async ({ req }) => !!req.user,
    create: async ({ req }) => {
      // Allow first user (unauthenticated) or admin users
      const userCount = await req.payload.count({
        collection: 'users',
      })
      if (userCount === 0) return true
      return req.user?.roles?.includes('admin') || false
    },
    update: async ({ req }) => {
      if (!req.user) return false
      if (req.user?.roles?.includes('admin')) return true
      const userCount = await req.payload.count({ collection: 'users' })
      return userCount === 1
    },
    delete: async ({ req }) => {
      if (!req.user) return false
      const userCount = await req.payload.count({ collection: 'users' })
      return req.user?.roles?.includes('admin') || userCount === 1
    },
  },
  hooks: {
    beforeCreate: [
      async ({ data, req }) => {
        // Automatically assign admin role to first user
        const userCount = await req.payload.count({
          collection: 'users',
        })
        if (userCount === 0) {
          data.roles = ['admin']
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
}
