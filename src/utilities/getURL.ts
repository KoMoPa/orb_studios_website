export const getServerSideURL = (): string => {
  if (typeof window !== 'undefined') return ''

  if (process.env.PAYLOAD_PUBLIC_APP_URL) return process.env.PAYLOAD_PUBLIC_APP_URL
  if (process.env.NEXT_PUBLIC_SERVER_URL) return process.env.NEXT_PUBLIC_SERVER_URL

  return 'http://localhost:3000'
}
