'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  navItemsWithData: any[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, navItemsWithData }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  useEffect(() => {
    let lastScrollY = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsCollapsed(currentScrollY > 50)
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`sticky top-0 w-full relative z-20 transition-all duration-300 bg-black ${isCollapsed ? 'py-3' : 'py-8'}`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="flex justify-between px-4 md:px-8 lg:px-12">
        <Link href="/">
          <Logo 
          loading="eager" 
          priority="high" 
          textClassName="doodle"
          />
        </Link>
        <HeaderNav data={data} navItemsWithData={navItemsWithData} />
      </div>
    </header>
  )
}