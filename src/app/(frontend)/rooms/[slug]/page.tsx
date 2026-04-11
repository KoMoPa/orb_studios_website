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
import { GalleryBlock } from '@/blocks/GalleryBlock/Component'
import { AudioPlayer } from '@/components/AudioPlayer'

export const dynamic = 'force-static'

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
        text: roomData.customHeroCtaText || `Book ${roomData.title}`,
        url: `/booking?room=${roomData.slug}`,
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

            {/* Audio Sample */}
            {roomData.audioSample && typeof roomData.audioSample === 'object' && roomData.audioSample.url && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Hear the Room</h2>
                <AudioPlayer
                  url={roomData.audioSample.url}
                  label={roomData.audioSampleLabel ?? roomData.audioSample.filename ?? undefined}
                />
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
                  {roomData.infoBox.area && (
                    <div>
                      <h3 className="font-semibold text-white">Area Info</h3>
                      <p className="text-gray-300">{roomData.infoBox.area}</p>
                      {roomData.infoBox.areaDetails && (
                        <p className="text-sm text-gray-500">{roomData.infoBox.areaDetails}</p>
                      )}
                      {roomData.infoBox.etc && (
                        <p className="text-xs text-gray-400">{roomData.infoBox.etc}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Section - Full Width Below Content */}
        {roomData.galleryImages && Array.isArray(roomData.galleryImages) && roomData.galleryImages.length > 0 && (
          <div className="mb-12">
            <GalleryBlock images={roomData.galleryImages} />
          </div>
        )}

        {/* Rate Card Section - Full Width Below */}
        {roomData.rate && Array.isArray(roomData.rate) && roomData.rate.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomData.rate.map((rate, index) => {
                // Handle both object rates and reference IDs
                if (typeof rate === 'object' && rate !== null) {
                  return <RateCard key={rate.id || index} doc={rate} />
                }
                return null
              })}
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="pb-24 text-center">
      <a href="/rooms" className="btn-console btn-console--red">
        Looking for something else?
      </a>
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