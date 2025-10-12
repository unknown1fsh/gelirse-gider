import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Test reference data endpoint...')

    // Basit referans verilerini al
    const [currencies, paymentMethods, banks] = await Promise.all([
      prisma.refCurrency.findMany({ where: { active: true } }),
      prisma.refPaymentMethod.findMany({ where: { active: true } }),
      prisma.refBank.findMany({ where: { active: true } }),
    ])

    console.log('✅ Test reference data alındı:', {
      currencies: currencies.length,
      paymentMethods: paymentMethods.length,
      banks: banks.length,
    })

    return NextResponse.json({
      success: true,
      message: 'Test reference data alındı',
      data: {
        currencies,
        paymentMethods,
        banks,
      }
    })

  } catch (error) {
    console.error('❌ Test reference data hatası:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Test reference data hatası',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
