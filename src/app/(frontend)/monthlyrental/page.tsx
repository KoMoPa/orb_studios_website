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

  return <MonthlyRentalContent form={form} />
}
