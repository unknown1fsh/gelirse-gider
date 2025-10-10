import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script gereksiz tip kayıtlarını temizler.
async function main() {
  console.log('🧹 VERİTABANI TEMİZLİĞİ\n')

  // 1. Kategorilerde duplicate kontrolü
  console.log('1️⃣  Kategori duplicate kontrolü...')

  const gelirTypeId = 3 // GELIR
  const giderTypeId = 4 // GIDER

  const gelirCategories = await prisma.refTxCategory.findMany({
    where: { txTypeId: gelirTypeId },
  })

  const oldGelirCategories = await prisma.refTxCategory.findMany({
    where: { txTypeId: 1 }, // INCOME
  })

  console.log(`   GELIR kategorileri (ID:3): ${gelirCategories.length} adet`)
  console.log(`   Eski INCOME kategorileri (ID:1): ${oldGelirCategories.length} adet`)
  console.log()

  // Eğer GELIR kategorileri yeterli sayıda varsa, eski INCOME kategorilerini sil
  if (gelirCategories.length >= oldGelirCategories.length && oldGelirCategories.length > 0) {
    console.log('🗑️  Eski INCOME kategorileri siliniyor...')
    await prisma.refTxCategory.deleteMany({
      where: { txTypeId: 1 },
    })
    console.log(`   ✅ ${oldGelirCategories.length} kategori silindi`)
    console.log()
  }

  const giderCategories = await prisma.refTxCategory.findMany({
    where: { txTypeId: giderTypeId },
  })

  const oldGiderCategories = await prisma.refTxCategory.findMany({
    where: { txTypeId: 2 }, // EXPENSE
  })

  console.log(`   GIDER kategorileri (ID:4): ${giderCategories.length} adet`)
  console.log(`   Eski EXPENSE kategorileri (ID:2): ${oldGiderCategories.length} adet`)
  console.log()

  if (giderCategories.length >= oldGiderCategories.length && oldGiderCategories.length > 0) {
    console.log('🗑️  Eski EXPENSE kategorileri siliniyor...')
    await prisma.refTxCategory.deleteMany({
      where: { txTypeId: 2 },
    })
    console.log(`   ✅ ${oldGiderCategories.length} kategori silindi`)
    console.log()
  }

  // 2. Eski INCOME ve EXPENSE tiplerini sil
  console.log('2️⃣  Eski işlem tiplerini silme...')

  const incomeType = await prisma.refTxType.findFirst({
    where: { code: 'INCOME' },
  })

  if (incomeType) {
    // Bu tipi kullanan işlem var mı kontrol et
    const usingTransactions = await prisma.transaction.count({
      where: { txTypeId: incomeType.id },
    })

    if (usingTransactions === 0) {
      await prisma.refTxType.delete({
        where: { id: incomeType.id },
      })
      console.log(`   ✅ INCOME tipi (ID:${incomeType.id}) silindi`)
    } else {
      console.log(`   ⚠️  INCOME tipini ${usingTransactions} işlem hala kullanıyor!`)
    }
  }

  const expenseType = await prisma.refTxType.findFirst({
    where: { code: 'EXPENSE' },
  })

  if (expenseType) {
    const usingTransactions = await prisma.transaction.count({
      where: { txTypeId: expenseType.id },
    })

    if (usingTransactions === 0) {
      await prisma.refTxType.delete({
        where: { id: expenseType.id },
      })
      console.log(`   ✅ EXPENSE tipi (ID:${expenseType.id}) silindi`)
    } else {
      console.log(`   ⚠️  EXPENSE tipini ${usingTransactions} işlem hala kullanıyor!`)
    }
  }

  console.log()

  // 3. Final durum
  console.log('3️⃣  Final durum:\n')

  const finalTypes = await prisma.refTxType.findMany({
    orderBy: { id: 'asc' },
  })

  console.log('   İşlem Tipleri:')
  finalTypes.forEach(tt => {
    const icon = tt.code === 'GELIR' ? '🟢' : '🔴'
    console.log(
      `   ${icon} ID:${tt.id} | Code: ${tt.code} | Name: ${tt.name} | Icon: ${tt.icon} | Color: ${tt.color}`
    )
  })
  console.log()

  // 4. Free kullanıcının durumu
  const freeUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: { contains: 'free' } }, { email: { contains: 'Free' } }],
    },
  })

  if (freeUser) {
    const transactions = await prisma.transaction.findMany({
      where: { userId: freeUser.id },
      include: {
        txType: true,
        category: true,
      },
    })

    if (transactions.length > 0) {
      console.log(`📊 FREE KULLANICI DURUMU (${freeUser.email}):`)
      console.log()

      transactions.forEach(tx => {
        const icon = tx.txType.code === 'GELIR' ? '🟢' : '🔴'
        console.log(
          `   ${icon} ${tx.transactionDate.toISOString().split('T')[0]} | ` +
            `${tx.txType.name} | ${tx.category.name} | ${Number(tx.amount).toFixed(2)} TRY`
        )
      })

      const totalGelir = transactions
        .filter(t => t.txType.code === 'GELIR')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      const totalGider = transactions
        .filter(t => t.txType.code === 'GIDER')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      console.log()
      console.log(`   🟢 Toplam GELIR: ${totalGelir.toFixed(2)} TRY`)
      console.log(`   🔴 Toplam GIDER: ${totalGider.toFixed(2)} TRY`)
      console.log(`   💰 NET DURUM: ${(totalGelir - totalGider).toFixed(2)} TRY`)
      console.log()
    }
  }

  console.log('✅ TEMİZLİK TAMAMLANDI!\n')
  console.log("🔄 Dashboard'ı yenileyin: http://localhost:3000/dashboard\n")
}

main()
  .catch(e => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
