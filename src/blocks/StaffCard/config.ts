import type { Block } from 'payload'

export const StaffCard: Block = {
  slug: 'staffCard',
  interfaceName: 'StaffCardBlock',
  fields: [
    {
      name: 'staffMembers',
      type: 'relationship',
      relationTo: 'staff',
      hasMany: true,
      required: true,
      label: 'Staff Members',
      admin: {
        description: 'Select the staff members to display',
      },
    },
  ],
  labels: {
    plural: 'Staff Cards',
    singular: 'Staff Card',
  },
}
