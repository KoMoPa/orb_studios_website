import React from 'react'
import { getCachedPayloadInstance } from '@/utilities/getGlobals'
import type { Form } from '@payloadcms/plugin-form-builder/types'
import { MonthlyRentalContent } from './MonthlyRentalContent'

export const revalidate = 3600

export default async function MonthlyRentalsPage() {
  const payload = await getCachedPayloadInstance()
  
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
