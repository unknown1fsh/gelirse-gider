import { NextResponse } from 'next/server'

export function GET() {
  // Simple health check without database dependency
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
}
