'use client'

import React, { useState, useRef, useEffect } from 'react'
import FaderMenuIcon from '@/components/FaderMenuIcon';
import type { Header as HeaderType } from '@/payload-types'

import { DropdownMenu } from '@/Header/DropdownMenu'

interface HeaderNavProps {
  data: HeaderType
  navItemsWithData: any[]
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, navItemsWithData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuWrapperRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuWrapperRef.current && !menuWrapperRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  return (
    <nav className="flex gap-3 items-center relative">
      {/* Menu wrapper for dropdown */}
      <div ref={menuWrapperRef} className="relative">
        <FaderMenuIcon isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(prev => !prev)} />
        <DropdownMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          navItemsWithData={navItemsWithData}
        />
      </div>
    </nav>
  )
}