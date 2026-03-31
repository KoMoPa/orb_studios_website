'use client'

import React from 'react'

import { CustomHero } from '@/heros/CustomHero'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { HighImpactHero } from '@/heros/HighImpact'
import { ArticleBlock } from '@/blocks/ArticleBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { GalleryBlock } from '@/blocks/GalleryBlock/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { FAQBlock } from '@/blocks/FAQBlock/Component'
import { MonthlyCardsBlock } from '@/blocks/MonthlyCards/Component'

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
          <h1 className="text-6xl font-bold mb-4">Component & Block Showcase</h1>
          <p className="text-xl opacity-80">
            Complete showcase of all available blocks, heros, and components with sample content
          </p>
        </div>
      </div>

      <main className="py-12" style={{ backgroundColor: 'var(--light)' }}>
        <div className="container space-y-12">
          
          {/* HEROS SECTION */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-8 pb-4 border-b-2 border-red-600" style={{ color: 'var(--dark)', fontFamily: '"Rubik Doodle Shadow", sans-serif' }}>Hero Components</h2>
          </div>

          {/* 1. HighImpactHero */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>1. HighImpactHero</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Full-screen impact hero with rich content overlay</p>
            <div style={{ borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--oorange)', overflow: 'hidden' }}>
              <HighImpactHero
                richText={mockRichText}
                media={mockMediaObject('liveroom1.jpg', 'Live room')}
                links={[
                  { link: { label: 'Learn More', url: '#', appearance: 'primary' } },
                ]}
              />
            </div>
          </section>

          {/* 2. CustomHero */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>2. CustomHero</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Customizable hero with multiple font options, overlay settings, and CTAs</p>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)', overflow: 'hidden' }}>
              <CustomHero
                title="Custom Hero with Glitch Title"
                titleFont="glitch"
                subtitle="With custom fonts and overlay options"
                description="This is a customizable hero component perfect for landing pages and featured content."
                backgroundImage={mockMediaObject('controlroom1.jpg', 'Control room background')}
                cta={{ text: 'Learn More', url: '#' }}
                overlay="dark"
                overlayOpacity={40}
              />
            </div>
          </section>

          {/* 3. MediumImpactHero */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>3. MediumImpactHero</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Balanced hero with rich text content and media</p>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <MediumImpactHero
                richText={mockRichText}
                media={mockMediaObject('console.jpg', 'Control room')}
                links={[
                  { link: { label: 'Get Started', url: '#', appearance: 'primary' } },
                  { link: { label: 'Learn More', url: '#', appearance: 'secondary' } },
                ]}
              />
            </div>
          </section>

          {/* 4. LowImpactHero */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>4. LowImpactHero</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Minimal hero with subtle text content</p>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <LowImpactHero richText={mockRichText} />
            </div>
          </section>

          {/* BLOCKS SECTION */}
          <div className="mb-8 mt-16">
            <h2 className="text-4xl font-bold mb-8 pb-4 border-b-2 border-red-600" style={{ color: 'var(--dark)', fontFamily: '"Rubik Doodle Shadow", sans-serif' }}>Content Blocks</h2>
          </div>

          {/* 5. ArticleBlock */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>5. ArticleBlock</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Full-width article layout with image and text, multiple font options, and CTAs</p>
            <div style={{ borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <ArticleBlock
                title="Professional Recording Setup"
                titleFont="spraypaint"
                content={mockRichText}
                media={mockMediaObject('liveroom2.jpg', 'Professional console')}
                imagePosition="right"
                cta={{ text: 'Book Now', url: '#' }}
              />
            </div>
          </section>

          {/* 6. MediaBlock */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>6. MediaBlock</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Simple responsive image container with optional caption</p>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <MediaBlock
                media={mockMediaObject('controlroom2.jpg', 'Live room 2')}
              />
            </div>
          </section>

          {/* 7. GalleryBlock */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>7. GalleryBlock</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Responsive image gallery with lightbox and grid layout</p>
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

          {/* 8. CallToActionBlock */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>8. CallToActionBlock</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Prominent action block with rich text and multiple CTA buttons</p>
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

          {/* 9. ContentBlock */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>9. ContentBlock</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Multi-column layout for flexible content arrangement</p>
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

          {/* 10. BannerBlock */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>10. BannerBlock</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Alert/notification banners with multiple styles (info, success, warning, error)</p>
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

          {/* 11. CodeBlock */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>11. CodeBlock</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Syntax-highlighted code blocks with language support</p>
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

          {/* 12. FAQBlock */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>12. FAQBlock</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Accordion-style FAQ display with collapsible questions</p>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <FAQBlock
                title="Frequently Asked Questions"
                faqs={[
                  {
                    id: '1',
                    question: 'What equipment is included in a booking?',
                    answer: mockRichText,
                    blockType: 'faq'
                  },
                  {
                    id: '2',
                    question: 'Can I book multiple rooms at once?',
                    answer: mockRichText,
                    blockType: 'faq'
                  },
                  {
                    id: '3',
                    question: 'What are your cancellation policies?',
                    answer: mockRichText,
                    blockType: 'faq'
                  },
                ] as any}
              />
            </div>
          </section>

          {/* 13. MonthlyCardsBlock */}
          <section>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark)' }}>13. MonthlyCardsBlock</h3>
            <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--dark)' }}>Card grid for displaying monthly membership options</p>
            <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--oorange)' }}>
              <MonthlyCardsBlock
                title="Monthly Membership Options"
                cards={[
                  {
                    title: 'Book for the Month',
                    description: 'Get unlimited access to ORB Studios for an entire month.',
                    type: 'link',
                    link: {
                      url: '#',
                      label: 'Learn More',
                    },
                  },
                  {
                    title: 'Already a Monthly?',
                    description: 'As a monthly member, you get priority booking and additional perks.',
                    type: 'link',
                    link: {
                      url: '#',
                      label: 'Book Your Session',
                    },
                  },
                  {
                    title: 'Join the Waitlist',
                    description: 'Interested in becoming a monthly member? Sign up for our waitlist.',
                    type: 'link',
                    link: {
                      url: '#',
                      label: 'Join Waitlist',
                    },
                  },
                ]}
              />
            </div>
          </section>


          {/* FONT SHOWCASE SECTION */}
          <div className="mb-8 mt-16">
            <h2 className="text-4xl font-bold mb-8 pb-4 border-b-2 border-red-600" style={{ color: 'var(--dark)', fontFamily: '"Rubik Doodle Shadow", sans-serif' }}>Custom Fonts Showcase</h2>
          </div>

          {/* 14. Font Showcase */}
          <section>
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--dark)' }}>14. Available Custom Fonts</h3>
            <p className="text-sm opacity-70 mb-6" style={{ color: 'var(--dark)' }}>All custom fonts loaded and ready to use throughout the site</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vinyl Font */}
              <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '3rem', border: '1px solid var(--oorange)', textAlign: 'center' }}>
                <h3 className="text-6xl font-bold mb-2" style={{ fontFamily: '"Rubik Vinyl", sans-serif', color: 'var(--dark)' }}>Vinyl</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.6, color: 'var(--dark)' }}>Rubik Vinyl - Bold retro style</p>
              </div>
              
              {/* Doodle Font */}
              <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '3rem', border: '1px solid var(--oorange)', textAlign: 'center' }}>
                <h3 className="text-6xl font-bold mb-2" style={{ fontFamily: '"Rubik Doodle Shadow", sans-serif', color: 'var(--dark)' }}>Doodle</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.6, color: 'var(--dark)' }}>Rubik Doodle Shadow - Playful sketch style</p>
              </div>
              
              {/* Spraypaint Font */}
              <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '3rem', border: '1px solid var(--oorange)', textAlign: 'center' }}>
                <h3 className="text-6xl font-bold mb-2" style={{ fontFamily: '"Rubik Spray Paint", sans-serif', color: 'var(--dark)' }}>Spraypaint</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.6, color: 'var(--dark)' }}>Rubik Spray Paint - Graffiti inspired</p>
              </div>
              
              {/* Glitch Font */}
              <div style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '3rem', border: '1px solid var(--oorange)', textAlign: 'center' }}>
                <h3 className="text-6xl font-bold mb-2" style={{ fontFamily: '"Rubik Glitch", sans-serif', color: 'var(--dark)', textShadow: '0.08em 0.08em 0 rgba(255, 0, 0, 0.6), 0.15em 0.15em 0 rgba(0, 255, 255, 0.6)', letterSpacing: '-0.03em' }}>Glitch</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.6, color: 'var(--dark)' }}>Rubik Glitch - Digital distortion with chromatic aberration</p>
              </div>
            </div>
          </section>

          {/* End section */}
          <section style={{ backgroundColor: 'var(--light)', borderRadius: '0.5rem', padding: '3rem', textAlign: 'center', border: '2px solid var(--oorange)', marginTop: '3rem' }}>
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--dark)', fontFamily: '"Rubik Doodle Shadow", sans-serif' }}>End of Component Showcase</h2>
            <p style={{ color: 'var(--dark)', fontSize: '1.125rem' }}>
              Use this page as a comprehensive reference when building other pages. All available blocks, heros, and components are fully rendered here with real content and features.
            </p>
          </section>
        </div>
      </main>
    </>
  )
}
