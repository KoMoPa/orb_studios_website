'use client'

import React from 'react'
import type { ParallaxBlock as ParallaxBlockProps } from '@/payload-types'
import { Media } from '../../components/Media'
import RichText from '@/components/RichText'
import type { StaticImageData } from 'next/image'
import { Parallax, useParallax } from 'react-scroll-parallax'

type Props = ParallaxBlockProps & {
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const ParallaxBlock: React.FC<Props> = ({
  media,
  overlayOpacity = 0.5,
  overlayColor = '#000000',
  title,
  richText,
  staticImage,
}) => {
  // Background moves slower than the viewport scroll — classic parallax depth effect.
  // shouldAlwaysCompleteAnimation ensures progress starts at 0 when the hero is
  // visible at the top of the page (not mid-way through as the default calculates).
  const bgParallax = useParallax<HTMLDivElement>({
    speed: -10,
    shouldAlwaysCompleteAnimation: true,
  })

  return (
    <div>
      {/* ── Hero: full viewport height ────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        {/* Background image — extends well beyond the container so the slower
            parallax movement never reveals the edges */}
        <div
          ref={bgParallax.ref}
          className="absolute"
          style={{ top: '-20%', left: 0, right: 0, bottom: '-20%' }}
        >
          {media && (
            <Media
              resource={media}
              {...(staticImage && { src: staticImage })}
              imgClassName="w-full h-full object-cover"
              priority
            />
          )}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
          />
        </div>

        {/* Title — fades out and drifts upward as the hero scrolls past */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-6">
          <Parallax
            opacity={[1, 0]}
            translateY={['0px', '-60px']}
            shouldAlwaysCompleteAnimation
          >
            <h1 className="text-6xl md:text-7xl lg:text-9xl font-bold text-white text-center drop-shadow-lg max-w-5xl leading-tight">
              {title}
            </h1>
          </Parallax>
        </div>

        {/* Scroll indicator — fades out as soon as the user starts scrolling */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <Parallax opacity={[1, 0]} shouldAlwaysCompleteAnimation>
            <div className="flex flex-col items-center gap-2 text-white/70">
              <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
              <div className="animate-bounce">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </Parallax>
        </div>
      </section>

      {/* ── Details: slides up and fades in as it enters the viewport ─── */}
      {richText && (
        <div className="relative py-20 px-4 bg-background">
          <Parallax
            translateY={['50px', '0px']}
            opacity={[0, 1]}
            easing="easeOutQuart"
          >
            <div className="max-w-5xl mx-auto bg-white dark:bg-card rounded-xl shadow-2xl p-10 md:p-16">
              <div className="prose prose-xl dark:prose-invert max-w-none">
                <RichText data={richText} enableGutter={false} />
              </div>
            </div>
          </Parallax>
        </div>
      )}
    </div>
  )
}
