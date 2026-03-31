import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container py-28 flex items-center justify-center min-h-[80vh]">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Massive Glitch Title */}
        <div className="space-y-4">
          <h1
            className="text-9xl md:text-10xl leading-none"
            style={{
              fontFamily: '"Rubik Glitch", sans-serif',
              textShadow: '0.1em 0.1em 0 rgba(255, 0, 0, 0.5), 0.2em 0.2em 0 rgba(0, 255, 255, 0.5)',
              letterSpacing: '-0.05em',
              marginBottom: 0,
              fontWeight: 700,
            }}
          >
            404
          </h1>
          <p className="text-xl md:text-2xl opacity-70">Page not found</p>
        </div>

        {/* Subtitle */}
        <div className="space-y-3">
          <p className="text-base md:text-lg opacity-60 max-w-lg mx-auto">
            The page you're looking for has too much distortion.
            Nobody actually goes to 11.
          </p>
        </div>

        {/* Call to Action */}
        <div className="pt-4">
          <Button asChild variant="default" size="lg">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
