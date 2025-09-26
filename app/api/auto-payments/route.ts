import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const autoPayments = await prisma.autoPayment.findMany({
      include: {
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
        category: true
      },
      where: {
        active: true
      },
      orderBy: {
        nextPaymentDate: 'asc'
      }
    })

    return NextResponse.json(autoPayments)
  } catch (error) {
    console.error('Auto payments API error:', error)
    return NextResponse.json(
      { error: 'Otomatik ödemeler alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Frequency'den cron schedule oluştur
    const getCronSchedule = (frequency: string) => {
      switch (frequency) {
        case 'WEEKLY': return '0 0 * * 0' // Her pazar
        case 'MONTHLY': return '0 0 1 * *' // Her ayın 1'i
        case 'YEARLY': return '0 0 1 1 *' // Her yılın 1 Ocak'ı
        default: return '0 0 1 * *' // Varsayılan aylık
      }
    }

    const autoPayment = await prisma.autoPayment.create({
      data: {
        name: body.name,
        description: body.description || null,
        amount: body.amount || 0,
        currencyId: 1, // Varsayılan TRY
        paymentMethodId: 1, // Varsayılan nakit
        cronSchedule: getCronSchedule(body.frequency || 'MONTHLY'),
        nextPaymentDate: new Date(body.nextPaymentDate),
        categoryId: body.categoryId,
        accountId: body.accountId || null,
        creditCardId: body.creditCardId || null,
        active: true
      },
      include: {
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
        category: true
      }
    })

    return NextResponse.json(autoPayment, { status: 201 })
  } catch (error) {
    console.error('Auto payment creation error:', error)
    return NextResponse.json(
      { error: 'Otomatik ödeme oluşturulamadı' },
      { status: 500 }
    )
  }
}
