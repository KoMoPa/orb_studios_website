import type { Metadata } from 'next/types'
import React from 'react'

import { getCachedPayloadInstance } from '@/utilities/getGlobals'
import { RoomsArchive } from '@/components/RoomsArchive'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getCachedPayloadInstance()

  const rooms = await payload.find({
    collection: 'rooms',
    depth: 1,
    limit: 100,
    sort: 'order',
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      heroImage: true,
      heroTitle: true,
      infoBox: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Rooms</h1>
        </div>
      </div>

      <RoomsArchive rooms={rooms.docs} />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Rooms`,
  }
}
