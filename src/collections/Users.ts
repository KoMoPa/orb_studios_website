import type { CollectionConfig } from 'payload'
import { admin } from '../access/admin'
import { authenticated } from '../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: authenticated,
    create: admin,
    update: ({ req }) => {
      if (!req.user) return false
      // Admins can update anyone, users can update themselves
      if (req.user?.roles?.includes('admin')) return true
      return {
        id: {
          equals: req.user.id,
        },
      }
    },
    delete: admin,
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
