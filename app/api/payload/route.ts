import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(
      {
        message: 'Payload API is configured',
        status: 'ready',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Payload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

