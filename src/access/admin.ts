import type { AccessArgs } from 'payload'

export const admin = ({ req: { user } }: AccessArgs) => {
  return user?.roles?.includes('admin')
}
