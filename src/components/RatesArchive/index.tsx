import { cn } from '@/utilities/ui'
import React from 'react'

import { RateCard, RateCardData } from '@/components/RateCard'

export type Props = {
  rates: RateCardData[]
}

const RateGrid: React.FC<{ rates: RateCardData[] }> = ({ rates }) => (
  <div className="flex flex-wrap justify-center gap-6">
    {rates?.map((result, index) => {
      if (typeof result === 'object' && result !== null) {
        return (
          <div key={index} className="w-full md:w-1/2 lg:w-1/3">
            <RateCard className="h-full" doc={result} />
          </div>
        )
      }
      return null
    })}
  </div>
)

export const RatesArchive: React.FC<Props> = (props) => {
  const { rates } = props

  const hourlyRates = rates.filter((rate) => rate.type === 'hourly')
  const monthlyRates = rates.filter((rate) => rate.type === 'monthly')
  const otherRates = rates.filter((rate) => rate.type === 'other')

  return (
    <div className={cn('container')}>
      {hourlyRates.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Hourly Rates</h2>
          <RateGrid rates={hourlyRates} />
        </div>
      )}

      {monthlyRates.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Monthly Rates</h2>
          <RateGrid rates={monthlyRates} />
        </div>
      )}

      {otherRates.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Other Rates</h2>
          <RateGrid rates={otherRates} />
        </div>
      )}
    </div>
  )
}
