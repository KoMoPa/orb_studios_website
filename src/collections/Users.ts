import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: async ({ req }) => !!req.user,
    create: async ({ req }) => req.user?.roles?.includes('admin') || false,
    update: async ({ req }) => req.user?.roles?.includes('admin') || false,
    delete: async ({ req }) => req.user?.roles?.includes('admin') || false,
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
