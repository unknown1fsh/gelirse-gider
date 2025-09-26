import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const goldItems = await prisma.goldItem.findMany({
      include: {
        goldType: true,
        goldPurity: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(goldItems)
  } catch (error) {
    console.error('Gold items API error:', error)
    return NextResponse.json(
      { error: 'Altın eşyaları alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const goldItem = await prisma.goldItem.create({
      data: {
        name: body.name,
        goldTypeId: body.goldTypeId,
        goldPurityId: body.goldPurityId,
        weightGrams: body.weight || 0,
        purchasePrice: body.purchasePrice || 0,
        purchaseDate: new Date(),
        currentValueTry: body.purchasePrice || 0, // Başlangıçta alış fiyatı ile aynı
        description: body.description || null
      },
      include: {
        goldType: true,
        goldPurity: true
      }
    })

    return NextResponse.json(goldItem, { status: 201 })
  } catch (error) {
    console.error('Gold item creation error:', error)
    return NextResponse.json(
      { error: 'Altın eşyası oluşturulamadı' },
      { status: 500 }
    )
  }
}
