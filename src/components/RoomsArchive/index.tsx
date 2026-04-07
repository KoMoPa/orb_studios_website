import { cn } from '@/utilities/ui'
import React from 'react'

import { RoomCard, RoomCardData } from '@/components/RoomCard'

export type Props = {
  rooms: RoomCardData[]
}

export const RoomsArchive: React.FC<Props> = ({ rooms }) => {
  return (
    <div className={cn('container')}>
      <div className="flex flex-wrap justify-center gap-6">
        {rooms?.map((room, index) => {
          if (typeof room === 'object' && room !== null) {
            return (
              <div key={index} className="w-full md:w-1/2 lg:w-1/3">
                <RoomCard className="h-full" doc={room} />
              </div>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}
