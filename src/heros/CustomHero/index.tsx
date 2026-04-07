'use client'

import React, { useEffect, useState } from 'react'

import type { Page } from '@/payload-types'

import { useHeaderTheme } from '@/providers/HeaderTheme'

type CustomHeroProps = {
  backgroundImage?: any
  fallbackImage?: any
  title?: string
  subtitle?: string
  description?: string
  cta?: {
    text: string
    url: string
  }
  overlay?: 'dark' | 'light' | 'none' | string
  overlayOpacity?: number
  titleFont?: string
  alignment?: 'center' | 'left'
  minHeight?: string
}

export const CustomHero: React.FC<CustomHeroProps> = ({
  backgroundImage,
  fallbackImage,
  title,
  subtitle,
  description,
  cta,
  overlay = 'dark',
  overlayOpacity = 50,
  titleFont = 'glitch',
  alignment = 'center',
  minHeight = '80vh',
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  let mediaUrl = ''
  let isVideo = false
  if (backgroundImage) {
    if (typeof backgroundImage === 'string') {
      mediaUrl = backgroundImage
    } else if (backgroundImage.url) {
      mediaUrl = backgroundImage.url
    } else if (backgroundImage.filename) {
      mediaUrl = `/api/media/file/${backgroundImage.filename}`
    }
    // Check if it's a video file
    isVideo = /\.(mp4|webm|mov|ogg)$/i.test(mediaUrl)
  }

  // Handle fallback image
  let fallbackUrl = ''
  if (fallbackImage) {
    if (typeof fallbackImage === 'string') {
      fallbackUrl = fallbackImage
    } else if (fallbackImage.url) {
      fallbackUrl = fallbackImage.url
    } else if (fallbackImage.filename) {
      fallbackUrl = `/api/media/file/${fallbackImage.filename}`
    }
  }

  const overlayClass = overlay === 'dark' 
    ? 'bg-black' 
    : overlay === 'light' 
    ? 'bg-white' 
    : !overlay || overlay === 'none'
    ? ''
    : overlay

  const isGradient = overlay && (overlay.includes('gradient') || overlay.includes('from-'))

  return (
    <section
      className={`relative z-0 w-full flex items-center overflow-hidden`}
      style={{ 
        minHeight,
      }}
      data-theme="dark"
    >
      {mediaUrl && isVideo && !videoFailed && (
        <video
          src={mediaUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          onError={() => setVideoFailed(true)}
        />
      )}
      {mediaUrl && !isVideo && (
        <img
          src={mediaUrl}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {(videoFailed || !mediaUrl) && fallbackUrl && (
        <img
          src={fallbackUrl}
          alt="Hero background fallback"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {overlay !== 'none' && !isGradient && (
        <div 
          className={`absolute inset-0 z-10 ${overlayClass}`}
          style={{ opacity: overlayOpacity / 100 }}
        ></div>
      )}
      {isGradient && (
        <div 
          className={`absolute inset-0 z-10 bg-gradient-to-r ${overlay}`}
          style={{ opacity: overlayOpacity / 100 }}
        ></div>
      )}

      <div className={`relative z-20 w-full max-w-5xl px-4 py-12 ${alignment === 'left' ? 'text-left' : 'mx-auto text-center'}`}>
        {title && (
          <h1
            className={`${titleFont} text-5xl font-bold uppercase text-white mb-4 drop-shadow-lg tracking-wider`}
          >
            {title}
          </h1>
        )}
        {subtitle && <h2 className="text-4xl font-semibold mb-6 drop-shadow-md text-white">{subtitle}</h2>}

        {description && (
          <p className={`text-lg mb-8 max-w-2xl drop-shadow-md text-white ${alignment === 'center' ? 'mx-auto' : ''}`}>
            {description}
          </p>
        )}

        {cta && (
          <a
            href={cta.url}
            className="btn-console btn-console--red"
          >
            {cta.text}
          </a>
        )}
      </div>
    </section>
  )
}
