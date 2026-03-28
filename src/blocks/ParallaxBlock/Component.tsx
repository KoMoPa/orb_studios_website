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
  minHeight = 1800,
  staticImage,
  disableInnerContainer,
}) => {
  const containerParallax = useParallax<HTMLDivElement>({
    onProgressChange: (progress) => {
      if (containerParallax.ref.current) {
        containerParallax.ref.current.style.setProperty('--scroll-progress', progress.toString())
      }
    },
  })

  return (
    <div
      ref={containerParallax.ref}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: `${minHeight}px`,
        '--scroll-progress': 0,
      } as React.CSSProperties & { '--scroll-progress': number }}
    >
      {/* Background Image with Parallax - Fades in as you scroll */}
      <Parallax speed={-15} className="absolute inset-0 w-full h-full">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: `calc(0.1 + 1.4 * var(--scroll-progress))`,
            filter: 'blur(4px)',
          } as React.CSSProperties}
        >
          {media && (
            <Media
              resource={media}
              {...(staticImage && { src: staticImage })}
              imgClassName="w-full h-full object-cover"
              priority
            />
          )}
          {/* Overlay with dynamic opacity */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: overlayColor,
              opacity: `calc(${overlayOpacity} * max(0.3, var(--scroll-progress)))`,
            } as React.CSSProperties}
          />
        </div>
      </Parallax>

      {/* Title - Only visible at start, quickly fades as scroll begins */}
      <div
        className="absolute inset-0 flex items-start justify-center pt-12 pointer-events-none"
        style={{
          opacity: `calc(max(0, 1 - var(--scroll-progress) * 1.5))`,
        } as React.CSSProperties}
      >
        <h1 className="text-6xl md:text-7xl lg:text-9xl font-bold text-white text-center px-6 drop-shadow-lg max-w-5xl">
          {title}
        </h1>
      </div>

      {/* Content Box - Custom effect with scale and blur based on progress */}
      <div
        className="absolute inset-0 flex items-start justify-center px-4"
        style={{
          paddingTop: '20vh',
        }}
      >
        <div
          className="bg-white bg-opacity-97 rounded-xl shadow-2xl p-10 md:p-16 max-w-5xl w-full"
          style={{
            opacity: `calc(max(0, var(--scroll-progress) - 0.15) / 0.25)`,
            transform: `scale(calc(0.85 + 0.15 * max(0, var(--scroll-progress) - 0.15) / 0.25)) blur(calc(8px * (1 - max(0, var(--scroll-progress) - 0.15) / 0.25)))`,
            pointerEvents: `calc(var(--scroll-progress)) > 0.25 ? 'auto' : 'none'`,
          } as React.CSSProperties}
        >
          <div className="prose prose-xl dark:prose-invert max-w-none">
            {richText && (
              <RichText
                data={richText}
                enableGutter={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
