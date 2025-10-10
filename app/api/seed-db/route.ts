import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Seed scriptini çalıştır
    const { execSync } = require('child_process')
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' })

    return NextResponse.json({ message: 'Demo veriler başarıyla eklendi' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Demo veriler eklenemedi' }, { status: 500 })
  }
}
