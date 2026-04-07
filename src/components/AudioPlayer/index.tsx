'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'

type AudioPlayerProps = {
  url: string
  label?: string
  className?: string
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, label, className }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration)
    }
    const onLoadedMetadata = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration)
      setIsLoaded(true)
    }
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      await audio.play()
      setIsPlaying(true)
    }
  }, [isPlaying])

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current
      const bar = progressRef.current
      if (!audio || !bar || !isLoaded) return
      const rect = bar.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      audio.currentTime = ratio * duration
    },
    [duration, isLoaded],
  )

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className={cn(
        'flex flex-col gap-3 bg-gray-900/60 border border-gray-700 rounded-lg p-5',
        className,
      )}
    >
      {/* Hidden native audio element */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={url} preload="metadata" />

      {label && <p className="text-sm font-medium text-gray-300 truncate">{label}</p>}

      <div className="flex items-center gap-4">
        {/* Play / Pause button */}
        <button
          type="button"
          onClick={togglePlay}
          className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            /* Pause icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            /* Play icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11-6.86a1 1 0 0 0 0-1.74l-11-6.86A1 1 0 0 0 8 5.14z" />
            </svg>
          )}
        </button>

        {/* Progress bar */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div
            ref={progressRef}
            role="slider"
            aria-label="Seek"
            aria-valuenow={Math.round(currentTime)}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            tabIndex={0}
            className="relative h-2 rounded-full bg-gray-700 cursor-pointer group"
            onClick={handleSeek}
            onKeyDown={(e) => {
              const audio = audioRef.current
              if (!audio) return
              if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.currentTime + 5, duration)
              if (e.key === 'ArrowLeft') audio.currentTime = Math.max(audio.currentTime - 5, 0)
            }}
          >
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity"
              style={{ left: `${progress}%` }}
            />
          </div>

          {/* Time display */}
          <div className="flex justify-between text-xs text-gray-500 tabular-nums select-none">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
