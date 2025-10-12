import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

interface Currency {
  id: number
  code: string
  name: string
  symbol: string
}

interface PaymentMethod {
  id: number
  code: string
  name: string
}

interface Bank {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
  txTypeId: number
}

export async function GET() {
  try {
    // Sadece temel verileri al
    const [currencies, paymentMethods, banks, categories] = await Promise.all([
      prismaClient.refCurrency.findMany({ where: { active: true } }) as Promise<Currency[]>,
      prismaClient.refPaymentMethod.findMany({ where: { active: true } }) as Promise<
        PaymentMethod[]
      >,
      prismaClient.refBank.findMany({ where: { active: true } }) as Promise<Bank[]>,
      prismaClient.refTxCategory.findMany({ where: { active: true } }) as Promise<Category[]>,
    ])

    // Frontend'in beklediği format
    const response = {
      txTypes: [
        { id: 1, code: 'GELIR', name: 'Gelir' },
        { id: 2, code: 'GIDER', name: 'Gider' },
      ],
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        txTypeId: c.txTypeId,
      })),
      paymentMethods: paymentMethods.map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
      })),
      currencies: currencies.map(c => ({
        id: c.id,
        code: c.code,
        name: c.name,
        symbol: c.symbol,
      })),
      banks: banks.map(b => ({
        id: b.id,
        name: b.name,
      })),
      accounts: [],
      creditCards: [],
      eWallets: [],
      beneficiaries: [],
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Simple reference data hatası',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata',
      },
      { status: 500 }
    )
  } finally {
    await prismaClient.$disconnect()
  }
}
