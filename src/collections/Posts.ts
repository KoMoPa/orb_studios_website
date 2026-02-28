import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'categories', 'publishedAt', '_status'],
  },
  access: {
    read: ({ req: { user } }) => {
      return {
        or: [
          {
            _status: {
              equals: 'published',
            },
          },
          user && {
            _status: {
              not_equals: 'published',
            },
          },
        ].filter(Boolean),
      }
    },
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
      name: 'slug',
      type: 'text',
      index: true,
      unique: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'Post publish date',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'hero',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  timestamps: true,
  versions: {
    drafts: {
      autosave: {
        interval: 1000,
      },
    },
  },
}
