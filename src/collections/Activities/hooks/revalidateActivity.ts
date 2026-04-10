import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Activity } from '../../../payload-types'

export const revalidateActivity: CollectionAfterChangeHook<Activity> = ({ doc, previousDoc, req: { payload } }) => {
  payload.logger.info(`Revalidating activity pages for slug: ${doc.slug}`)
  
  // Revalidate the activities archive page
  revalidatePath('/activities')
  
  // Revalidate this specific activity page
  if (doc.slug) {
    revalidatePath(`/activities/${doc.slug}`)
  }
  
  // Revalidate if the slug changed
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    revalidatePath(`/activities/${previousDoc.slug}`)
  }
  
  revalidateTag('activities', 'default')
  return
}

export const revalidateDeleteActivity: CollectionAfterDeleteHook<Activity> = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating activity pages after deletion: ${doc.slug}`)
  revalidatePath('/activities')
  if (doc.slug) {
    revalidatePath(`/activities/${doc.slug}`)
  }
  revalidateTag('activities', 'default')
  return
}
