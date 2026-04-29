import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  textClassName?: string
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, textClassName } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      {/* eslint-disable @next/next/no-img-element */}
      <img
        alt="ORB Studios"
        width={40}
        height={40}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className="w-10 h-10"
        src="/api/media/file/record.png"
      />
      <span className={clsx('text-4xl font-bold tracking-wide text-white', textClassName)}>
        ORB Studios
      </span>
    </div>
  )
}
