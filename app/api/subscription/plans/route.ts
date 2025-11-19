import { NextResponse } from 'next/server'
import { getAllPlans } from '@/lib/plan-config'

export function GET() {
  // Merkezi plan konfigürasyonundan tüm planları al
  const plans = getAllPlans()

  return NextResponse.json({
    success: true,
    plans,
    lastUpdated: new Date().toISOString(),
  })
}
