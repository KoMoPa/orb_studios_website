'use client'

import React, { useState } from 'react'
import type { GalleryBlock as GalleryBlockProps } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const GalleryBlock: React.FC<GalleryBlockProps> = ({ 
  images 
}) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)

  const getImageUrl = (media: any): string => {
    if (!media) return ''
    if (typeof media === 'object' && media.url) {
      return getMediaUrl(media.url)
    }
    if (typeof media === 'string') {
      return getMediaUrl(media)
    }
    return ''
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      <section className="mt-12 px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => {
            const imageUrl = getImageUrl(image)
            if (!imageUrl) return null
            
            return (
              <div
                key={index}
                className="relative w-full aspect-video rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => setSelectedImageUrl(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt={typeof image === 'object' && image.alt ? image.alt : `Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImageUrl}
              alt="Selected gallery image"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedImageUrl(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              aria-label="Close lightbox"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
