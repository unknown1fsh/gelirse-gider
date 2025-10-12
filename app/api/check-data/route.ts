import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('🔍 Database verilerini kontrol ediyor...')

    // Referans verilerini kontrol et
    const currencies = await prisma.refCurrency.findMany()
    const accountTypes = await prisma.refAccountType.findMany()
    const transactionTypes = await prisma.refTransactionType.findMany()
    const categories = await prisma.refTransactionCategory.findMany()
    const paymentMethods = await prisma.refPaymentMethod.findMany()
    const goldTypes = await prisma.refGoldType.findMany()
    const goldPurities = await prisma.refGoldPurity.findMany()
    const banks = await prisma.refBank.findMany()
    const systemParams = await prisma.systemParameter.findMany()
    const users = await prisma.user.findMany()

    const results = {
      currencies: { count: currencies.length, data: currencies },
      accountTypes: { count: accountTypes.length, data: accountTypes },
      transactionTypes: { count: transactionTypes.length, data: transactionTypes },
      categories: { count: categories.length, data: categories },
      paymentMethods: { count: paymentMethods.length, data: paymentMethods },
      goldTypes: { count: goldTypes.length, data: goldTypes },
      goldPurities: { count: goldPurities.length, data: goldPurities },
      banks: { count: banks.length, data: banks },
      systemParams: { count: systemParams.length, data: systemParams },
      users: { count: users.length, data: users.map(u => ({ id: u.id, email: u.email, name: u.name })) },
    }

    console.log('✅ Database kontrol tamamlandı:', {
      currencies: results.currencies.count,
      accountTypes: results.accountTypes.count,
      transactionTypes: results.transactionTypes.count,
      categories: results.categories.count,
      paymentMethods: results.paymentMethods.count,
      goldTypes: results.goldTypes.count,
      goldPurities: results.goldPurities.count,
      banks: results.banks.count,
      systemParams: results.systemParams.count,
      users: results.users.count,
    })

    return NextResponse.json({
      success: true,
      message: 'Database verileri kontrol edildi',
      results
    })

  } catch (error) {
    console.error('❌ Database kontrol hatası:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Database kontrol hatası',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
