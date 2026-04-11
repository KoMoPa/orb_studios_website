import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { revalidateFAQ, revalidateDeleteFAQ } from './FAQ/hooks/revalidateFAQ'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Question',
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      label: 'Answer',
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Main FAQs',
          value: 'main',
        },
        {
          label: 'Monthly FAQs',
          value: 'monthly',
        },
      ],
      required: true,
      defaultValue: 'main',
    },
  ],
  hooks: {
    afterChange: [revalidateFAQ],
    afterDelete: [revalidateDeleteFAQ],
  },
}
