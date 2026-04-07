import type { Metadata } from 'next'
import React from 'react'
import { ArticleBlock } from '@/blocks/ArticleBlock/Component'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedCollectionItemsForStaticGeneration } from '@/utilities/getGlobals'

export async function generateStaticParams() {
  // Activities archive page doesn't need slug-based params
  return []
}

type Args = {
  params: Promise<Record<string, string>>
}

export default async function ActivitiesPage({ params: paramsPromise }: Args) {
  await paramsPromise

  try {
    const activitiesData = await getCachedCollectionItemsForStaticGeneration(
      'activities',
      1000,
      {
        title: true,
        slug: true,
        picture: true,
        description: true,
        equipmentIncluded: true,
      },
    )()

    const activities = activitiesData.docs || []

    return (
      <div className="min-h-screen py-24">
        <div className="container">
          <div className="mb-16">
            <h1 className="text-5xl font-bold mb-4 tracking-wider">Suggested Activities</h1>
            <p className="text-xl text-muted-foreground">
              Explore the different activities we recommend for our studio spaces.
            </p>
          </div>

          {activities.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">No activities found.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {activities.map((activity, index) => (
                <ArticleBlock
                  key={activity.id}
                  title={activity.title}
                  content={activity.description}
                  media={activity.picture}
                  imagePosition={index % 2 === 0 ? 'right' : 'left'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching activities:', error instanceof Error ? error.message : error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400">Error loading activities.</p>
        </div>
      </div>
    )
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    doc: {
      meta: {
        title: 'Activities',
        description: 'Suggested activities and ways to use our studio spaces.',
      },
    } as any,
  })
}