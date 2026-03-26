'use client'

import React from 'react'

import { CustomHero } from '@/heros/CustomHero'
import { ArticleBlock } from '@/blocks/ArticleBlock/Component'

export default function Home() {
  return (
    <>
      {/* Hero Block Example */}
      <CustomHero
        type="custom"
        backgroundImage={{
          id: 1,
          filename: 'liveroom1.jpg',
          alt: 'Recording studio',
          url: '/media/liveroom1.jpg',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        } as any}
        title="ORB STUDIOS"
        titleFont="spraypaint"
        subtitle="Premier Boutique Music Space"
        description="Etobicoke's premier recording and rehearsal space with world-class equipment and professional tracking facilities."
        cta={{ text: 'Book Now', url: '#booking' }}
      />

      

      <main style={{ minHeight: '70vh', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Additional content goes here */}
        </div>
      </main>
    </>
  )
}
