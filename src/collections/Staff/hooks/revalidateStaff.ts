import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Staff } from '../../../payload-types'

export const revalidateStaff: CollectionAfterChangeHook<Staff> = ({ req: { payload } }) => {
  payload.logger.info('Revalidating staff page')
  revalidatePath('/staff')
  revalidateTag('staff', 'default')
  return
}

export const revalidateDeleteStaff: CollectionAfterDeleteHook<Staff> = ({ req: { payload } }) => {
  payload.logger.info('Revalidating staff page after deletion')
  revalidatePath('/staff')
  revalidateTag('staff', 'default')
  return
}
