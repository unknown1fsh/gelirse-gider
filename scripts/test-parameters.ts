// Bu script sistem parametrelerini test eder
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testParameters() {
  console.log('🧪 Sistem Parametreleri Test Ediliyor...\n')

  try {
    // 1. Tüm parametreleri say
    const totalCount = await prisma.systemParameter.count()
    console.log(`📊 Toplam Parametre: ${totalCount}`)

    // 2. Grupları listele
    const groups = await prisma.systemParameter.groupBy({
      by: ['paramGroup'],
      _count: true,
    })

    console.log('\n📋 Parametre Grupları:')
    groups.forEach(group => {
      console.log(`   ✅ ${group.paramGroup}: ${group._count} parametre`)
    })

    // 3. Bankaları listele
    console.log('\n🏦 Bankalar:')
    const banks = await prisma.refBank.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      take: 10,
    })
    banks.forEach((bank, index) => {
      console.log(`   ${index + 1}. ${bank.name} (${bank.bankCode})`)
    })
    console.log(`   ... Toplam ${await prisma.refBank.count()} banka`)

    // 4. Altın türlerini listele
    console.log('\n💎 Altın Türleri:')
    const goldTypes = await prisma.refGoldType.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    })
    goldTypes.forEach((type, index) => {
      console.log(`   ${index + 1}. ${type.name}`)
    })

    // 5. Altın ayarlarını listele
    console.log('\n⚖️ Altın Ayarları:')
    const goldPurities = await prisma.refGoldPurity.findMany({
      where: { active: true },
      orderBy: { purity: 'desc' },
    })
    goldPurities.forEach((purity, index) => {
      console.log(`   ${index + 1}. ${purity.name} (${purity.purity} ayar)`)
    })

    // 6. İşlem kategorilerini listele
    console.log('\n📁 İşlem Kategorileri:')
    const categories = await prisma.refTxCategory.findMany({
      where: { active: true },
      include: { txType: true },
      orderBy: { name: 'asc' },
      take: 10,
    })
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (${cat.txType.name})`)
    })
    console.log(`   ... Toplam ${await prisma.refTxCategory.count()} kategori`)

    console.log('\n✅ Test Tamamlandı!')
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testParameters()
