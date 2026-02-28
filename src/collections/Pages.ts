import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
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
          {
            _status: {
              exists: false,
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
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'Date this page was published',
      },
    },
    {
      name: 'content',
      type: 'richText',
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
