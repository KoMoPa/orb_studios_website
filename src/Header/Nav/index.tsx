'use client'

import React, { useState, useRef, useEffect } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, ChevronDown } from 'lucide-react'

interface HeaderNavProps {
  data: HeaderType
  navItemsWithData: any[]
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, navItemsWithData }) => {
  return (
    <nav className="flex gap-3 items-center">
      {navItemsWithData.map((navItem, i) => {
        // Render regular link
        if (navItem.type === 'link') {
          return <CMSLink key={i} {...navItem.link} appearance="link" />
        }

        // Render collection dropdown
        if (navItem.type === 'collectionDropdown') {
          return (
            <CollectionDropdown
              key={i}
              label={navItem.collectionDropdown.label}
              items={navItem.dropdownItems || []}
              basePath={navItem.collectionDropdown.basePath || `/${navItem.collectionDropdown.collection}`}
            />
          )
        }

        return null
      })}
      {/* <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link> */}
    </nav>
  )
}

interface CollectionDropdownProps {
  label: string
  items: Array<{ title: string; slug: string }>
  basePath: string
}

const CollectionDropdown: React.FC<CollectionDropdownProps> = ({ label, items, basePath }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:opacity-70 transition-opacity"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
          {items.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">No items available</div>
          ) : (
            items.map((item) => (
              <Link
                key={item.slug}
                href={`${basePath}/${item.slug}`}
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
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