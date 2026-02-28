import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  label: 'Hero',
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Background Image',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
      label: 'Subtitle',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'overlay',
      type: 'select',
      options: [
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' },
        { label: 'None', value: 'none' },
      ],
      defaultValue: 'dark',
      label: 'Overlay Type',
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Button Text',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Button URL',
        },
      ],
    },
  ],
}
