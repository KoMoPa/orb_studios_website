import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Rate } from '../../../payload-types'

export const revalidateRate: CollectionAfterChangeHook<Rate> = ({ req: { payload } }) => {
  payload.logger.info('Revalidating rates page')
  revalidatePath('/rates')
  revalidateTag('rates', 'default')
  return
}

export const revalidateDeleteRate: CollectionAfterDeleteHook<Rate> = ({ req: { payload } }) => {
  payload.logger.info('Revalidating rates page after deletion')
  revalidatePath('/rates')
  revalidateTag('rates', 'default')
  return
}
