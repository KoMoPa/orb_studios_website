import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import { getCachedPayloadInstance } from '@/utilities/getGlobals'
import { RatesArchive } from '@/components/RatesArchive'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getCachedPayloadInstance()

  const rates = await payload.find({
    collection: 'rates',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      amount: true,
      type: true,
      includes: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Rates</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="rates"
          currentPage={rates.page}
          limit={12}
          totalDocs={rates.totalDocs}
        />
      </div>

      <RatesArchive rates={rates.docs} />

      <div className="container">
        {rates.totalPages > 1 && rates.page && (
          <Pagination page={rates.page} totalPages={rates.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Rates`,
  }
}
