// Bu script tüm ref tabloları SystemParameter'a migrate eder
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateAllParameters() {
  console.log('🔄 Tüm Parametreler SystemParameter Tablosuna Migrate Ediliyor...\n')

  try {
    // 1. TX_CATEGORY parametreleri
    console.log('1️⃣  TX_CATEGORY parametreleri ekleniyor...')
    const categories = await prisma.refTxCategory.findMany({
      include: { txType: true },
      where: { active: true },
    })

    for (const category of categories) {
      await prisma.systemParameter.upsert({
        where: {
          paramGroup_paramCode: {
            paramGroup: 'TX_CATEGORY',
            paramCode: `${category.code}_${category.txTypeId}`,
          },
        },
        update: {},
        create: {
          paramGroup: 'TX_CATEGORY',
          paramCode: `${category.code}_${category.txTypeId}`,
          paramValue: category.name,
          displayName: category.name,
          description: category.description || `${category.name} - ${category.txType.name}`,
          displayOrder: categories.indexOf(category) + 1,
          metadata: {
            txTypeId: category.txTypeId,
            txTypeName: category.txType.name,
            txTypeCode: category.txType.code,
            icon: category.icon,
            color: category.color,
            isDefault: category.isDefault,
            code: category.code,
          },
          isActive: category.active,
        },
      })
    }
    console.log(`   ✅ ${categories.length} kategori eklendi`)

    // 2. PAYMENT_METHOD parametreleri
    console.log('\n2️⃣  PAYMENT_METHOD parametreleri ekleniyor...')
    const paymentMethods = await prisma.refPaymentMethod.findMany({
      where: { active: true },
    })

    for (const method of paymentMethods) {
      await prisma.systemParameter.upsert({
        where: {
          paramGroup_paramCode: {
            paramGroup: 'PAYMENT_METHOD',
            paramCode: method.code,
          },
        },
        update: {},
        create: {
          paramGroup: 'PAYMENT_METHOD',
          paramCode: method.code,
          paramValue: method.name,
          displayName: method.name,
          description: method.description || method.name,
          displayOrder: paymentMethods.indexOf(method) + 1,
          metadata: {
            code: method.code,
          },
          isActive: method.active,
        },
      })
    }
    console.log(`   ✅ ${paymentMethods.length} ödeme yöntemi eklendi`)

    // 3. CURRENCY parametreleri
    console.log('\n3️⃣  CURRENCY parametreleri ekleniyor...')
    const currencies = await prisma.refCurrency.findMany({
      where: { active: true },
    })

    for (const currency of currencies) {
      await prisma.systemParameter.upsert({
        where: {
          paramGroup_paramCode: {
            paramGroup: 'CURRENCY',
            paramCode: currency.code,
          },
        },
        update: {},
        create: {
          paramGroup: 'CURRENCY',
          paramCode: currency.code,
          paramValue: currency.name,
          displayName: `${currency.name} (${currency.symbol})`,
          description: `${currency.name} - ${currency.code}`,
          displayOrder: currencies.indexOf(currency) + 1,
          metadata: {
            symbol: currency.symbol,
            code: currency.code,
            name: currency.name,
          },
          isActive: currency.active,
        },
      })
    }
    console.log(`   ✅ ${currencies.length} para birimi eklendi`)

    // 4. Özet
    console.log('\n📊 Migration Özeti:')
    const totalParams = await prisma.systemParameter.count()
    console.log(`   Toplam Parametre: ${totalParams}`)

    const groups = await prisma.systemParameter.groupBy({
      by: ['paramGroup'],
      _count: true,
    })

    console.log('\n📋 Parametre Grupları:')
    groups.forEach(group => {
      console.log(`   ✅ ${group.paramGroup}: ${group._count} parametre`)
    })

    console.log('\n🎉 Migration Tamamlandı!\n')
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateAllParameters()
