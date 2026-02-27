'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // This will be replaced by Payload's admin dashboard
    // For now, redirect to Payload's admin route
    typeof window !== 'undefined' && router.push('/api/admin')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Admin Panel...</h1>
        <p className="text-gray-600">Redirecting to Payload CMS dashboard</p>
      </div>
    </div>
  )
}
