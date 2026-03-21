import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()
  const payload = await getPayload({ config: configPromise })

  // Dynamically fetch items for each collection dropdown
  const navItemsWithData = await Promise.all(
    (headerData.navItems || []).map(async (navItem) => {
      if (navItem.type === 'collectionDropdown' && navItem.collectionDropdown) {
        const { collection, titleField = 'title', slugField = 'slug' } = navItem.collectionDropdown

        try {
          // Dynamically fetch from the specified collection
          const items = await payload.find({
            collection: collection as any,
            limit: 100,
            sort: titleField,
            overrideAccess: false,
            select: {
              [titleField]: true,
              [slugField]: true,
            },
          })

          return {
            ...navItem,
            dropdownItems: items.docs.map((doc: any) => ({
              title: doc[titleField],
              slug: doc[slugField],
            })),
          }
        } catch (error) {
          console.error(`Error fetching collection "${collection}":`, error)
          return {
            ...navItem,
            dropdownItems: [],
          }
        }
      }

      return navItem
    }),
  )

  return <HeaderClient data={headerData} navItemsWithData={navItemsWithData} />
}