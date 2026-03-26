import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import React from 'react'
import type { Room, Page } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedCollectionItemsForStaticGeneration, getCachedDocument } from '@/utilities/getGlobals'
import RichText from '@/components/RichText'
import { CustomHero } from '@/heros/CustomHero'
import { RateCard } from '@/components/RateCard'

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
    2,
  )()

  if (!room.docs[0]) {
    return <div>Room not found</div>
  }

  const roomData = room.docs[0]

  return (
    <>
    <CustomHero
      backgroundImage={roomData.heroImage}
      title={roomData.heroTitle}
      overlay={roomData.heroGradientColor || 'dark'}
      overlayOpacity={50}
      minHeight="380px"
      alignment="left"
      cta={{
        text: `Book ${roomData.title}`,
        url: '#booking',
      }}
    />

    <div className="pt-16 pb-24">
      <div className="container">
        {/* Main Content: Two Column Layout (responsive) */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Left Column: About Section (full width on mobile, 75% on lg+) */}
          <div className="w-full lg:w-3/4">
            {/* <h1 className="text-4xl font-bold mb-8">{roomData.heroTitle}</h1> */}
            
            {roomData.aboutSection && (
              <div className="mb-12">
                <RichText data={roomData.aboutSection} enableGutter={false} />
              </div>
            )}
          </div>

          {/* Right Column: Gear and Info Box (full width on mobile, 25% on lg+, stacked) */}
          <div className="w-full lg:w-1/4 space-y-6 h-fit">
            {/* Gear List Box */}
            {roomData.gearList && (
              <div className="bg-gray-900/40 border border-gray-700 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gear</h2>
                <RichText data={roomData.gearList} enableGutter={false} />
              </div>
            )}

            {/* Info Box */}
            {roomData.infoBox && (
              <div className="bg-gray-900/40 border border-gray-700 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-white">Area</h3>
                    <p className="text-gray-300">{roomData.infoBox.area}</p>
                    {roomData.infoBox.areaDetails && (
                      <p className="text-sm text-gray-500">{roomData.infoBox.areaDetails}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{roomData.infoBox.hourlyRateLabel}</h3>
                    <p className="text-gray-300">{roomData.infoBox.hourlyRate}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rate Card Section - Full Width Below */}
        {roomData.rate && typeof roomData.rate === 'object' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Pricing</h2>
            <div className="max-w-md">
              <RateCard doc={roomData.rate} />
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise

  const room = await getCachedDocument(
    'rooms',
    { slug: { equals: slug } },
    false,
    1,
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