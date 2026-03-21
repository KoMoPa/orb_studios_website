import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Link', value: 'link' },
                { label: 'Collection Dropdown', value: 'collectionDropdown' },
              ],
              defaultValue: 'link',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        // Regular link (existing functionality)
        link({
          appearances: false,
          overrides: {
            admin: {
              condition: (data, siblingData) => siblingData?.type === 'link',
            },
          },
        }),
        // Collection dropdown configuration
        {
          name: 'collectionDropdown',
          type: 'group',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'collectionDropdown',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Label for the dropdown button (e.g., "Rooms", "Services")',
              },
            },
            {
              name: 'collection',
              type: 'text',
              required: true,
              admin: {
                description: 'Collection slug to fetch items from (e.g., "rooms", "pages")',
              },
            },
            {
              name: 'titleField',
              type: 'text',
              defaultValue: 'title',
              admin: {
                description: 'Field name to use as the display title (default: "title")',
              },
            },
            {
              name: 'slugField',
              type: 'text',
              defaultValue: 'slug',
              admin: {
                description: 'Field name to use for the URL path (default: "slug")',
              },
            },
            {
              name: 'basePath',
              type: 'text',
              admin: {
                description: 'Base URL path (e.g., "/rooms", "/services"). Leave empty to use collection slug.',
              },
            },
          ],
        },
      ],
      maxRows: 10,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}