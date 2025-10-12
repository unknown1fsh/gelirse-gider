import { PrismaClient } from '@prisma/client'

// Prisma client'ı lazy initialize et
let prisma: PrismaClient

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL,
        },
      },
    })
  }
  return prisma
}

export const handler = async (event: any) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    console.log('🔍 Database verilerini kontrol ediyor...')

    // Prisma client'ı al
    const prismaClient = getPrisma()

    // Referans verilerini kontrol et
    const currencies = await prismaClient.refCurrency.findMany()
    const accountTypes = await prismaClient.refAccountType.findMany()
    const transactionTypes = await prismaClient.refTransactionType.findMany()
    const categories = await prismaClient.refTransactionCategory.findMany()
    const paymentMethods = await prismaClient.refPaymentMethod.findMany()
    const goldTypes = await prismaClient.refGoldType.findMany()
    const goldPurities = await prismaClient.refGoldPurity.findMany()
    const banks = await prismaClient.refBank.findMany()
    const systemParams = await prismaClient.systemParameter.findMany()
    const users = await prismaClient.user.findMany()

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Database verileri kontrol edildi',
        results
      }),
    }

  } catch (error) {
    console.error('❌ Database kontrol hatası:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Database kontrol hatası',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }),
    }
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}
