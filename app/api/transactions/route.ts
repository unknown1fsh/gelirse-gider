import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { transactionSchema } from '@/lib/validators'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        txType: true,
        category: true,
        paymentMethod: true,
        account: {
          include: {
            bank: true,
            currency: true
          }
        },
        creditCard: {
          include: {
            bank: true,
            currency: true
          }
        },
        currency: true
      },
      orderBy: {
        transactionDate: 'desc'
      },
      take: 50
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Transactions API error:', error)
    return NextResponse.json(
      { error: 'İşlemler alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validasyon
    const validatedData = transactionSchema.parse({
      ...body,
      transactionDate: new Date(body.transactionDate)
    })

    const transaction = await prisma.transaction.create({
      data: validatedData,
      include: {
        txType: true,
        category: true,
        paymentMethod: true,
        account: {
          include: {
            bank: true,
            currency: true
          }
        },
        creditCard: {
          include: {
            bank: true,
            currency: true
          }
        },
        currency: true
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Transaction creation error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'İşlem oluşturulamadı' },
      { status: 500 }
    )
  }
}

