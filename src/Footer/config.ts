import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: async () => true,
    update: async ({ req }) => {
      return req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor')
    },
  },
  fields: [
    {
      name: 'copyright',
      type: 'text',
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
