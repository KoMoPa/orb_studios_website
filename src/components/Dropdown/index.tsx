'use client'

import React, { useState } from 'react'

import type { FAQ } from '@/payload-types'

export type DropdownData = Pick<FAQ, 'id' | 'question' | 'answer'>

export const Dropdown: React.FC<{
  doc?: DropdownData
  isOpen?: boolean
  onToggle?: () => void
}> = (props) => {
  const { doc, isOpen = false, onToggle } = props
  const [localOpen, setLocalOpen] = useState(isOpen)
  const open = onToggle ? isOpen : localOpen

  if (!doc) return null

  const { question, answer } = doc

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setLocalOpen(!localOpen)
    }
  }

  return (
    <div className="border border-gray-300 rounded overflow-hidden transition-all duration-300">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 text-gray-900"
        style={{
          backgroundColor: open ? '#f5f5f5' : 'transparent',
        }}
      >
        <span className="text-lg font-semibold text-left text-gray-900">
          {question}
        </span>
        <span
          className="text-2xl font-bold transition-transform duration-300 text-gray-900"
          style={{
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>

      {open && (
        <div
          className="px-6 py-4 border-t border-gray-300"
          style={{ backgroundColor: '#fafafa' }}
        >
          <div className="text-base leading-relaxed" style={{ color: 'var(--dark)' }}>
            {answer && typeof answer === 'object' ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(answer),
                }}
              />
            ) : (
              answer
            )}
          </div>
        </div>
      )}
    </div>
  )
}
