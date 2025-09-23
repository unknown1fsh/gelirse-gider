import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const refData = await Promise.all([
      prisma.refTxType.findMany({ where: { active: true } }),
      prisma.refTxCategory.findMany({ 
        include: { txType: true },
        where: { active: true },
        orderBy: [{ txTypeId: 'asc' }, { name: 'asc' }]
      }),
      prisma.refPaymentMethod.findMany({ where: { active: true } }),
      prisma.refBank.findMany({ where: { active: true }, orderBy: { name: 'asc' } }),
      prisma.refCurrency.findMany({ where: { active: true } }),
      prisma.account.findMany({ 
        include: { bank: true, currency: true },
        where: { active: true },
        orderBy: { name: 'asc' }
      }),
      prisma.creditCard.findMany({ 
        include: { bank: true, currency: true },
        where: { active: true },
        orderBy: { name: 'asc' }
      })
    ])

    const [txTypes, categories, paymentMethods, banks, currencies, accounts, creditCards] = refData

    return NextResponse.json({
      txTypes,
      categories,
      paymentMethods,
      banks,
      currencies,
      accounts,
      creditCards
    })
  } catch (error) {
    console.error('Reference data API error:', error)
    return NextResponse.json(
      { error: 'Referans verileri alınamadı' },
      { status: 500 }
    )
  }
}

