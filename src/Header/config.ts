import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  access: {
    read: async () => true,
    update: async ({ req }) => {
      return req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor')
    },
  },
  fields: [
    {
      name: 'nav',
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
