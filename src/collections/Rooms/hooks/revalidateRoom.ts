import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Room } from '../../../payload-types'

export const revalidateRoom: CollectionAfterChangeHook<Room> = ({ doc, previousDoc, req: { payload } }) => {
  payload.logger.info(`Revalidating room pages for slug: ${doc.slug}`)
  
  // Revalidate the rooms archive page
  revalidatePath('/rooms')
  
  // Revalidate this specific room page
  if (doc.slug) {
    revalidatePath(`/rooms/${doc.slug}`)
  }
  
  // Revalidate if the slug changed
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    revalidatePath(`/rooms/${previousDoc.slug}`)
  }
  
  revalidateTag('rooms', 'default')
  return
}

export const revalidateDeleteRoom: CollectionAfterDeleteHook<Room> = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating room pages after deletion: ${doc.slug}`)
  revalidatePath('/rooms')
  if (doc.slug) {
    revalidatePath(`/rooms/${doc.slug}`)
  }
  revalidateTag('rooms', 'default')
  return
}
