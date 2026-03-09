import type { AccessArgs } from 'payload'

export const adminOrEditor = ({ req: { user } }: AccessArgs) => {
  return user?.roles?.some((role: string) => ['admin', 'editor'].includes(role))
}
