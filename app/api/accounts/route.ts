import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      include: {
        accountType: true,
        bank: true,
        currency: true
      },
      where: {
        active: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Accounts API error:', error)
    return NextResponse.json(
      { error: 'Hesaplar alınamadı' },
      { status: 500 }
    )
  }
}

