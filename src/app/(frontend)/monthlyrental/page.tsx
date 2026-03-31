// import type { Metadata } from 'next'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Form } from '@payloadcms/plugin-form-builder/types'
import { MonthlyRentalContent } from './MonthlyRentalContent'

// Note: Metadata export not compatible with server component if needed later
// export const metadata: Metadata = {
//   title: 'All-Inclusive Monthly Rental',
//   description: 'Explore our flexible monthly rental options for studio space.',
// }

export default async function MonthlyRentalsPage() {
  const payload = await getPayload({ config: configPromise })
  
  // Fetch the form by title
  const formsData = await payload.find({
    collection: 'forms',
    where: {
      title: {
        equals: 'Sign Up For Monthly Waitlist',
      },
    },
  })
  
  const form = formsData.docs[0] as Form | undefined

  const richTextData = {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              version: 1,
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
              format: 0,
            },
          ],
          format: '',
          indent: 0,
        },
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              version: 1,
              text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
              format: 0,
            },
          ],
          format: '',
          indent: 0,
        },
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              version: 1,
              text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
              format: 0,
            },
          ],
          format: '',
          indent: 0,
        },
      ],
      format: '',
      indent: 0,
      version: 3,
    },
  }

  return <MonthlyRentalContent form={form} richTextData={richTextData} />
}
