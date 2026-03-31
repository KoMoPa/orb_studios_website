import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Github,
} from 'lucide-react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

const SOCIAL_LINKS = [
  { platform: 'Instagram', url: 'https://instagram.com/orb.musicstudios', icon: Instagram },
  { platform: 'Facebook', url: 'https://www.facebook.com/61577238612978/', icon: Facebook },
]

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const {
    description = '',
    linkGroups = [],
    contactInfo = {},
    copyright = '',
  } = footerData || {}

  return (
    <footer className="mt-auto border-t border-border" style={{ backgroundColor: 'var(--card)', color: 'var(--dark)' }}>
      <div className="container py-12 gap-12">
        {/* Top Section: Logo, Description, and Social Links */}
        <div className="border-b border-border p-10 flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="flex flex-col gap-4 max-w-xs">
            <Link className="flex items-center w-fit" href="/">
              <Logo />
            </Link>
            {description && <p className="text-sm" style={{ color: 'var(--element-text)' }}>{description}</p>}
            {SOCIAL_LINKS.length > 0 && (
              <div className="flex gap-4 pt-2">
                {SOCIAL_LINKS.map(({ platform, url, icon: Icon }, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className="transition-opacity hover:opacity-70"
                    style={{ color: 'var(--element-text)' }}
                  >
                    <Icon size={50} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <ThemeSelector />
        </div>

        {/* Link Groups and Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-10">
          {/* Link Groups */}
          {linkGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.title && <h3 className="font-semibold mb-4 uppercase text-sm tracking-wide" style={{ color: 'var(--dark)' }}>{group.title}</h3>}
              <nav className="flex flex-col gap-3">
                {group.links?.map(({ link }, linkIndex) => (
                  <CMSLink
                    className="hover:opacity-70 transition-opacity text-sm"
                    key={linkIndex}
                    {...link}
                    style={{ color: 'var(--element-text)' }}
                  />
                ))}
              </nav>
            </div>
          ))}

          {/* Contact Info */}
          {(contactInfo?.address || contactInfo?.email || contactInfo?.phone) && (
            <div>
              <h3 className="font-semibold mb-4 uppercase text-sm tracking-wide" style={{ color: 'var(--dark)' }}>CONTACT</h3>
              <div className="flex flex-col gap-3 text-sm" style={{ color: 'var(--element-text)' }}>
                {contactInfo.address && <p>{contactInfo.address}</p>}
                {contactInfo.email && (
                  <a href={`mailto:${contactInfo.email}`} className="hover:opacity-70 transition-opacity">
                    {contactInfo.email}
                  </a>
                )}
                {contactInfo.phone && (
                  <a href={`tel:${contactInfo.phone}`} className="hover:opacity-70 transition-opacity">
                    {contactInfo.phone}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Copyright */}
        {copyright && (
          <div className="border-t border-border pt-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: 'var(--element-text)' }}>{copyright}</p>
          </div>
        )}
      </div>
    </footer>
  )
}
