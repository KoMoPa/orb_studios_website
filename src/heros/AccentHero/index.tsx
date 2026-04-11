import React from 'react'

import { CMSLink } from '@/components/Link'

type AccentHeroProps = {
  title: string
  description: string
  links?: Array<{
    link: {
      type: 'custom' | 'internal'
      url: string
      label: string
      appearance?: string
    }
  }>
  backgroundImage?: {
    url: string
    alt?: string
  }
  minHeight?: string
}

export const AccentHero: React.FC<AccentHeroProps> = ({
  title,
  description,
  links,
  backgroundImage,
  minHeight = '50vh',
}) => {
  return (
    <section
      className="relative w-full flex items-center justify-center"
      style={{
        minHeight,
      }}
    >
      {/* Blurred parallax background */}
      {backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage.url})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            filter: 'blur(8px) brightness(0.4)',
            zIndex: 0,
          }}
        />
      )}

      {/* Semi-opaque overlay */}
      <div className="absolute inset-0 bg-black/40 z-1" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg tracking-wide" style={{ fontFamily: '"Rubik Doodle Shadow", sans-serif' }}>
            {title}
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl text-white/90 mb-8 drop-shadow-md max-w-2xl mx-auto">
            {description}
          </p>

          {/* Links */}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex gap-4 justify-center flex-wrap pb-4">
              {links.map(({ link }, i) => {
                return (
                  <div key={i}>
                    <a href={link.url} className="btn-console btn-console--red">
                      {link.label}
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
