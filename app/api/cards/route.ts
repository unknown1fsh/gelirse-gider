import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const creditCards = await prisma.creditCard.findMany({
      include: {
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

    return NextResponse.json(creditCards)
  } catch (error) {
    console.error('Credit cards API error:', error)
    return NextResponse.json(
      { error: 'Kredi kartları alınamadı' },
      { status: 500 }
    )
  }
}