import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { transactionSchema } from '@/lib/validators'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Kullanıcı doğrulama
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 401 }
      )
    }

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
      where: {
        userId: user.id
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
    // Kullanıcı doğrulama
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validasyon
    const validatedData = transactionSchema.parse({
      ...body,
      transactionDate: new Date(body.transactionDate)
    })

    const transaction = await prisma.transaction.create({
      data: {
        ...validatedData,
        userId: user.id
      },
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

