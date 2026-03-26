import type { Block } from 'payload'

export const Gallery: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  fields: [
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      required: true,
      admin: {
        description: 'Images to display in the gallery grid',
      },
    },
  ],
  labels: {
    plural: 'Galleries',
    singular: 'Gallery',
  },
}
