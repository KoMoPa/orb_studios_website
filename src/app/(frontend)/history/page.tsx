import type { Metadata } from 'next'
import React from 'react'
import { HistoryContent } from './HistoryContent'

export const metadata: Metadata = {
  title: 'Our History | Orb Studios',
  description:
    'From an Etobicoke art gallery to a full commercial recording facility — the story of Orb Studios, told through the art on the walls and the music that never stopped.',
  openGraph: {
    title: 'Our History | Orb Studios',
    description:
      'Fourteen years in one building. Art gallery, backroom recording hideout, dedicated studio, full commercial facility. Every wall tells a story.',
    type: 'website',
  },
}

export default function HistoryPage() {
  return (
    <main className="-mt-[10.4rem]">
      <HistoryContent />
    </main>
  )
}
