import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Room, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

export type RoomCardData = Pick<Room, 'title' | 'slug' | 'heroImage' | 'heroTitle' | 'infoBox'>

export const RoomCard: React.FC<{
  className?: string
  doc?: RoomCardData
  href?: string
}> = (props) => {
  const { className, doc, href: hrefOverride } = props

  if (!doc) return null

  const { title, slug, heroImage, infoBox } = doc
  const href = hrefOverride ?? `/rooms/${slug}`

  return (
    <Link href={href} className={cn('group block', className)}>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full">
        {heroImage && typeof heroImage === 'object' && (
          <div className="relative aspect-video w-full overflow-hidden">
            <Media
              resource={heroImage as MediaType}
              imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              fill
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          {infoBox?.area && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{infoBox.area}</p>
          )}
          <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
            View Room &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
