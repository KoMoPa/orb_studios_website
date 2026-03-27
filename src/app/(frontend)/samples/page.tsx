'use client'

import React from 'react'

import { CustomHero } from '@/heros/CustomHero'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { ArticleBlock } from '@/blocks/ArticleBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { GalleryBlock } from '@/blocks/GalleryBlock/Component'
import { CodeBlock } from '@/blocks/Code/Component'

const mockRichText = {
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'This is a sample rich text block with multiple paragraphs to demonstrate the content rendering capabilities.',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
  },
}

const mockMediaObject = (filename: string, alt: string) => ({
  id: 1,
  filename,
  alt,
  url: `/media/${filename}`,
  width: 1200,
  height: 800,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
})

export default function SamplesPage() {
  return (
    <>
      {/* Page Title Section */}
      <div style={{ backgroundColor: 'var(--dark)', color: 'var(--light)' }} className="py-12">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4">Component & Block Samples</h1>
          <p className="text-xl opacity-80">
            Complete showcase of all available blocks and components with sample content
          </p>
        </div>
      </div>

      <main className="py-12" style={{ backgroundColor: 'var(--light)' }}>
        <div className="container space-y-12">
          {/* 1. CustomHero */}
          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark)' }}>1. CustomHero</h2>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <CustomHero
                title="Custom Hero Example"
                titleFont="glitch"
                subtitle="With custom fonts and overlay options"
                description="This is a customizable hero component perfect for landing pages and featured content."
                backgroundImage={mockMediaObject('liveroom1.jpg', 'Live room background')}
                cta={{ text: 'Learn More', url: '#' }}
                overlay="dark"
                overlayOpacity={40}
              />
            </div>
          </section>

          {/* 2. MediumImpactHero */}
          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark)' }}>2. MediumImpactHero</h2>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <MediumImpactHero
                richText={mockRichText}
                media={mockMediaObject('controlroom1.jpg', 'Control room')}
                links={[
                  { link: { label: 'Get Started', url: '#', appearance: 'primary' } },
                  { link: { label: 'Learn More', url: '#', appearance: 'secondary' } },
                ]}
              />
            </div>
          </section>

          {/* 2b. LowImpactHero */}
          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark)' }}>2b. LowImpactHero</h2>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <LowImpactHero richText={mockRichText} />
            </div>
          </section>

          {/* 3. ArticleBlock */}
          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark)' }}>3. ArticleBlock</h2>
            <div style={{ borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <ArticleBlock
                title="Professional Recording Setup"
                titleFont="spraypaint"
                content={mockRichText}
                media={mockMediaObject('console.jpg', 'Professional console')}
                imagePosition="right"
                cta={{ text: 'Book Now', url: '#' }}
              />
            </div>
          </section>

          {/* 4. MediaBlock */}
          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark)' }}>4. MediaBlock</h2>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <MediaBlock
                media={mockMediaObject('liveroom2.jpg', 'Live room 2')}
              />
            </div>
          </section>

          {/* 5. GalleryBlock */}
          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark)' }}>5. GalleryBlock</h2>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <GalleryBlock
                images={[
                  mockMediaObject('controlroom1.jpg', 'Control Room 1'),
                  mockMediaObject('controlroom2.jpg', 'Control Room 2'),
                  mockMediaObject('controlroom3.jpg', 'Control Room 3'),
                  mockMediaObject('liveroom3.jpg', 'Live Room 3'),
                  mockMediaObject('liveroom4.jpg', 'Live Room 4'),
                  mockMediaObject('lounge_couch.jpg', 'Lounge Area'),
                ]}
              />
            </div>
          </section>

          {/* 6. CallToActionBlock */}
          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark)' }}>6. CallToActionBlock</h2>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <CallToActionBlock
                richText={mockRichText}
                links={[
                  { link: { label: 'Browse Rates', url: '#', appearance: 'primary' } },
                  { link: { label: 'Contact Us', url: '#', appearance: 'secondary' } },
                ]}
              />
            </div>
          </section>

          {/* 7. ContentBlock */}
          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark)' }}>7. ContentBlock</h2>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <ContentBlock
                columns={[
                  {
                    size: 'half',
                    richText: {
                      ...mockRichText,
                      root: {
                        ...mockRichText.root,
                        children: [
                          {
                            children: [
                              {
                                detail: 0,
                                format: 0,
                                mode: 'normal',
                                style: '',
                                text: 'Left column content with great sound design and acoustic treatment.',
                                type: 'text',
                                version: 1,
                              },
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1,
                          },
                        ],
                      },
                    },
                  },
                  {
                    size: 'half',
                    richText: {
                      ...mockRichText,
                      root: {
                        ...mockRichText.root,
                        children: [
                          {
                            children: [
                              {
                                detail: 0,
                                format: 0,
                                mode: 'normal',
                                style: '',
                                text: 'Right column content featuring state-of-the-art recording equipment.',
                                type: 'text',
                                version: 1,
                              },
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1,
                          },
                        ],
                      },
                    },
                  },
                ]}
              />
            </div>
          </section>

          {/* 8. BannerBlock */}
          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark)' }}>8. BannerBlock</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', border: '1px solid var(--oorange)' }}>
                <BannerBlock
                  style="info"
                  content={mockRichText}
                />
              </div>
              <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', border: '1px solid var(--oorange)' }}>
                <BannerBlock
                  style="success"
                  content={mockRichText}
                />
              </div>
              <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', border: '1px solid var(--oorange)' }}>
                <BannerBlock
                  style="warning"
                  content={mockRichText}
                />
              </div>
              <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', border: '1px solid var(--oorange)' }}>
                <BannerBlock
                  style="error"
                  content={mockRichText}
                />
              </div>
            </div>
          </section>

          {/* 9. CodeBlock */}
          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark)' }}>9. CodeBlock</h2>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <CodeBlock
                code={`const recordingSetup = {
  microphone: "Neumann U87",
  interface: "Apogee Symphony",
  preamp: "Universal Audio 6176",
  monitoring: "Yamaha HS8"
}`}
                language="javascript"
              />
            </div>
          </section>

          {/* End section */}
          <section style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', border: '1px solid var(--oorange)' }}>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--dark)' }}>End of Samples</h2>
            <p style={{ color: 'var(--dark)' }}>
              Use this page as a reference when building other pages. You now see all available blocks and components fully rendered with real content.
            </p>
          </section>
        </div>
      </main>
    </>
  )
}
