import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import React from 'react'
import type { Room, Page } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedCollectionItemsForStaticGeneration, getCachedDocument } from '@/utilities/getGlobals'
import RichText from '@/components/RichText'

export async function generateStaticParams() {
  try {
    const rooms = await getCachedCollectionItemsForStaticGeneration('rooms', 1000, {
      slug: true,
    })()

    return rooms.docs.map(({ slug }) => ({ slug }))
  } catch (error) {
    // During builds without database access, return empty array
    // Pages will still be generated on-demand
    console.warn('Could not fetch rooms for static generation:', error instanceof Error ? error.message : error)
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function RoomPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const { isEnabled: isDraftMode } = await draftMode()

  // Use cached document fetcher instead of getPayload directly
  const room = await getCachedDocument(
    'rooms',
    { slug: { equals: slug } },
    isDraftMode,
    0,
  )()

  if (!room.docs[0]) {
    return <div>Room not found</div>
  }

  const roomData = room.docs[0]

  return (
    <div className="pt-16 pb-24">
      <div className="container">
        <h1 className="text-4xl font-bold mb-8">{roomData.heroTitle}</h1>
        
        {/* About Section */}
        {roomData.aboutSection && (
          <div className="mb-12">
            <RichText data={roomData.aboutSection} enableGutter={false} />
          </div>
        )}

        {/* Info Box */}
        {roomData.infoBox && (
          <div className="bg-gray-100 p-6 rounded-lg mb-12">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Area</h3>
                <p>{roomData.infoBox.area}</p>
                {roomData.infoBox.areaDetails && (
                  <p className="text-sm text-gray-600">{roomData.infoBox.areaDetails}</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{roomData.infoBox.hourlyRateLabel}</h3>
                <p>{roomData.infoBox.hourlyRate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Gear List */}
        {roomData.gearList && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Gear</h2>
            <RichText data={roomData.gearList} enableGutter={false} />
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise

  const room = await getCachedDocument(
    'rooms',
    { slug: { equals: slug } },
    false,
    0,
  )()

  const roomDoc = room.docs[0]

  if (!roomDoc) {
    return generateMeta({
      doc: null,
    })
  }

  // Create a partial document structure compatible with generateMeta
  const metaDoc: Partial<Page> = {
    meta: {
      title: roomDoc.title,
      description: roomDoc.heroTitle,
    },
    slug: roomDoc.slug,
  }

  return generateMeta({
    doc: metaDoc as any,
  })
}