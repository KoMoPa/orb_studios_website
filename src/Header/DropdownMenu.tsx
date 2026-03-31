'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { CMSLink } from '@/components/Link'
import { ChevronDown } from 'lucide-react'
import type { Header as HeaderType } from '@/payload-types'

interface DropdownMenuProps {
  isOpen: boolean
  onClose: () => void
  navItemsWithData: any[]
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, onClose, navItemsWithData }) => {
  const menuRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl py-3 z-50"
    >
      <div className="max-h-[70vh] overflow-y-auto">
        {navItemsWithData.length === 0 ? (
          <div className="px-4 py-2 text-sm text-gray-400">No menu items</div>
        ) : (
          navItemsWithData.map((navItem, i) => {
            // Render regular link
            if (navItem.type === 'link' && navItem.link) {
              return (
                <div key={i} onClick={onClose} className="block">
                  <div className="px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
                    <CMSLink {...navItem.link} appearance="inline" />
                  </div>
                </div>
              )
            }

            // Render collection dropdown
            if (navItem.type === 'collectionDropdown') {
              return (
                <NestedCollectionDropdown
                  key={i}
                  label={navItem.collectionDropdown.label}
                  items={navItem.dropdownItems || []}
                  basePath={navItem.collectionDropdown.basePath || `/${navItem.collectionDropdown.collection}`}
                  onItemClick={onClose}
                />
              )
            }

            return null
          })
        )}
      </div>
    </div>
  )
}

interface NestedCollectionDropdownProps {
  label: string
  items: Array<{ title: string; slug: string }>
  basePath: string
  onItemClick: () => void
}

const NestedCollectionDropdown: React.FC<NestedCollectionDropdownProps> = ({
  label,
  items,
  basePath,
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-700 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="bg-gray-800 border-l-2 border-gray-600">
          {items.length === 0 ? (
            <div className="px-6 py-2 text-sm text-gray-400">No items available</div>
          ) : (
            items.map((item) => (
              <Link
                key={item.slug}
                href={`${basePath}/${item.slug}`}
                className="block px-6 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                onClick={onItemClick}
              >
                {item.title}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
