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
        titleFont="vinyl"
        subtitle="Where Legends Make Records"
        description="Etobicoke's premier recording and rehearsal space with world-class equipment and professional tracking facilities."
        cta={{ text: 'Book Now', url: '#booking' }}
      />

      {/* Article Block Example - Image on Right */}
      <ArticleBlock
        blockType="articleBlock"
        title="The Gear"
        media={{
          id: 2,
          filename: 'controlroom1.jpg',
          alt: 'Professional microphones',
          url: '/media/controlroom1.jpg',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        } as any}
        imagePosition="right"
        content={{
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Industry-leading equipment and vintage boutique gear in one place. Everything you need to create your masterpiece.',
                  },
                ],
              },
            ],
          },
        } as any}
        cta={{ text: 'Explore Equipment', url: '#equipment' }}
      />

      {/* Article Block Example - Image on Left */}
      <ArticleBlock
        blockType="articleBlock"
        title="About Orb Studios"
        media={{
          id: 3,
          filename: 'liveroom1.jpg',
          alt: 'Studio interior',
          url: '/media/liveroom1.jpg',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        } as any}
        imagePosition="left"
        content={{
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Founded with a passion for exceptional sound, Orb Studios has established itself as Etobicoke\'s premier destination for recording, mixing, and rehearsal.',
                  },
                ],
              },
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Our state-of-the-art facilities and experienced team have helped countless artists bring their visions to life. Whether you\'re a seasoned professional or just starting your musical journey, we\'re committed to providing the highest quality production environment.',
                  },
                ],
              },
            ],
          },
        } as any}
      />

      <main style={{ minHeight: '70vh', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Additional content goes here */}
        </div>
      </main>
    </>
  )
}
