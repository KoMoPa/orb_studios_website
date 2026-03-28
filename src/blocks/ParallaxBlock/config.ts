import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ParallaxBlock: Block = {
  slug: 'parallaxBlock',
  interfaceName: 'ParallaxBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Background image for the parallax effect',
      },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      defaultValue: 0.5,
      min: 0,
      max: 1,
      step: 0.1,
      admin: {
        description: 'Opacity of the overlay on the background image (0-1)',
      },
    },
    {
      name: 'overlayColor',
      type: 'text',
      defaultValue: '#8B1A1A',
      admin: {
        description: 'Color of the overlay (hex color)',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Large title text at the top',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      admin: {
        description: 'Content to display in the center box (4-5 sentences or bullet points)',
      },
    },
    {
      name: 'minHeight',
      type: 'number',
      defaultValue: 1800,
      admin: {
        description: 'Minimum height of the parallax section in pixels',
      },
    },
  ],
  labels: {
    plural: 'Parallax Blocks',
    singular: 'Parallax Block',
  },
}
