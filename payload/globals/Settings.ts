import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Orb Studios',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
    },
    {
      name: 'siteKeywords',
      type: 'text',
    },
    {
      name: 'faviconUrl',
      type: 'text',
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable maintenance mode to display a message to visitors',
      },
    },
    {
      name: 'maintenanceMessage',
      type: 'textarea',
      admin: {
        description: 'Message to display during maintenance mode',
      },
    },
  ],
}
