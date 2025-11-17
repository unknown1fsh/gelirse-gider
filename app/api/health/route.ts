import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateEnvironment } from '@/lib/env-validation'

export async function GET() {
  const healthStatus: {
    status: string
    timestamp: string
    database?: string
    environment?: {
      valid: boolean
      errors: string[]
      warnings: string[]
    }
  } = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }

  // Database bağlantı kontrolü (timeout ile)
  try {
    const dbCheck = Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000)),
    ])
    await dbCheck
    healthStatus.database = 'connected'
  } catch (error) {
    healthStatus.database = 'disconnected'
    healthStatus.status = 'degraded'
  }

  // Environment validation (sadece bilgi amaçlı, hata throw etmez)
  try {
    healthStatus.environment = validateEnvironment()
    if (!healthStatus.environment.valid) {
      healthStatus.status = 'degraded'
    }
  } catch (error) {
    // Environment validation hatası
    healthStatus.status = 'degraded'
  }

  const statusCode = healthStatus.status === 'ok' ? 200 : 503

  return NextResponse.json(healthStatus, { status: statusCode })
}
