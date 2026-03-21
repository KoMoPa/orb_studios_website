import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Custom',
          value: 'custom',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => type === 'custom',
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'custom',
      },
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'custom',
      },
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'custom',
      },
    },
    {
      name: 'overlay',
      type: 'select',
      defaultValue: 'dark',
      options: [
        {
          label: 'Dark',
          value: 'dark',
        },
        {
          label: 'Light',
          value: 'light',
        },
        {
          label: 'None',
          value: 'none',
        },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'custom',
      },
    },
    {
      name: 'titleFont',
      type: 'select',
      defaultValue: 'vinyl',
      options: [
        {
          label: 'Vinyl',
          value: 'vinyl',
        },
        {
          label: 'Default',
          value: 'default',
        },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'custom',
      },
    },
    {
      name: 'cta',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'custom',
      },
      fields: [
        {
          name: 'text',
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
  label: false,
}
