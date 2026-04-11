import { cn } from '@/utilities/ui'
import React from 'react'
import NextLink from 'next/link'

import type { Rate } from '@/payload-types'
import RichText from '@/components/RichText'

export type RateCardData = Pick<Rate, 'title' | 'amount' | 'type' | 'includes' | 'link'>

export const RateCard: React.FC<{
  className?: string
  doc?: RateCardData
}> = (props) => {
  const { className, doc } = props

  if (!doc) return null

  const { title, amount, type, includes, link } = doc
  const typeLabel = type === 'hourly' ? '/hour' : type === 'monthly' ? '/month' : ''

  const card = (
    <div
      className={cn(
        'rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow h-full',
        link && 'cursor-pointer',
        !link && className,
      )}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">${amount}</span>
          {typeLabel && <span className="text-sm text-gray-600 dark:text-gray-400">{typeLabel}  -- (before GST/HST)</span>}
        </div>
      </div>

      {includes && (
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          <RichText data={includes} />
        </div>
      )}
    </div>
  )

  if (link) {
    return (
      <NextLink href={link} className={cn('block no-underline', className)}>
        {card}
      </NextLink>
    )
  }

  return card
}
