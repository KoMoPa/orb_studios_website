import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Faq } from '../../../payload-types'

export const revalidateFAQ: CollectionAfterChangeHook<Faq> = ({ req: { payload } }) => {
  payload.logger.info('Revalidating all pages due to FAQ change')
  
  // Revalidate all pages since FAQ blocks can appear on multiple pages dynamically
  revalidatePath('/', 'layout')
  revalidateTag('faq', 'default')
  return
}

export const revalidateDeleteFAQ: CollectionAfterDeleteHook<Faq> = ({ req: { payload } }) => {
  payload.logger.info('Revalidating all pages after FAQ deletion')
  revalidatePath('/', 'layout')
  revalidateTag('faq', 'default')
  return
}
