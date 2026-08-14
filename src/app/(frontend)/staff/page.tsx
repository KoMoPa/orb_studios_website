import type { Metadata } from 'next'
import React from 'react'
import { StaffCardBlock } from '@/blocks/StaffCard/Component'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedCollectionItemsForStaticGeneration } from '@/utilities/getGlobals'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return []
}

type Args = {
  params: Promise<Record<string, string>>
}

export default async function StaffPage({ params: paramsPromise }: Args) {
  await paramsPromise

  try {
    const staffData = await getCachedCollectionItemsForStaticGeneration(
      'staff',
      1000,
      {
        name: true,
        bio: true,
        headshot: true,
        skills: true,
        order: true,
      },
      'order',
    )()

    const staff = staffData.docs || []

    return (
      <div className="min-h-screen py-24">
        <div className="container">
          <div className="mb-16">
            <h1 className="text-5xl font-bold mb-4 tracking-wider">Our Team</h1>
            <p className="text-xl text-muted-foreground">Meet the talented individuals behind ORB Studios.</p>
          </div>

          {staff.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">No staff members found.</p>
            </div>
          ) : (
            <StaffCardBlock
              blockType="staffCard"
              staffMembers={staff as any}
            />
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching staff:', error instanceof Error ? error.message : error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400">Error loading staff.</p>
        </div>
      </div>
    )
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    doc: {
      meta: {
        title: 'Our Team',
        description: 'Meet the talented team at ORB Studios.',
      },
    } as any,
  })
}
