import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script eski işlem tiplerini ve kategorilerini güvenli şekilde siler.
async function main() {
  console.log('🗑️  ESKİ TİP VE KATEGORİLERİ TEMİZLEME\n')

  // 1. Eski kategorileri sil (INCOME ve EXPENSE tipine ait)
  console.log('1️⃣  Eski kategorileri silme...')

  const incomeCategories = await prisma.refTxCategory.findMany({
    where: { txTypeId: { in: [1, 2] } }, // INCOME ve EXPENSE
    select: { id: true, code: true, name: true, txTypeId: true },
  })

  console.log(`   📦 ${incomeCategories.length} eski kategori bulundu`)

  if (incomeCategories.length > 0) {
    // Bu kategorileri kullanan işlem var mı kontrol et
    for (const cat of incomeCategories) {
      const usageCount = await prisma.transaction.count({
        where: { categoryId: cat.id },
      })

      if (usageCount > 0) {
        console.log(
          `   ⚠️  Kategori ID:${cat.id} (${cat.name}) hala ${usageCount} işlem tarafından kullanılıyor!`
        )
        console.log(`       Bu işlemin kategorisi önce güncellenmeli.`)
      }
    }

    // Kullanılmayan kategorileri sil
    const { count } = await prisma.refTxCategory.deleteMany({
      where: {
        txTypeId: { in: [1, 2] },
        transactions: { none: {} }, // Hiç işlem tarafından kullanılmayan
      },
    })

    console.log(`   ✅ ${count} kullanılmayan kategori silindi`)
  }

  console.log()

  // 2. Kalan kategorileri göster
  const remainingOldCategories = await prisma.refTxCategory.count({
    where: { txTypeId: { in: [1, 2] } },
  })

  if (remainingOldCategories > 0) {
    console.log(`   ⚠️  ${remainingOldCategories} kategori hala eski tip ID kullanıyor`)
    console.log(`   Önce bu kategorileri kullanan işlemleri yeni kategorilere taşıyın.`)
    console.log()
  } else {
    console.log(`   ✅ Tüm eski kategoriler temizlendi`)
    console.log()

    // 3. Eski tipleri sil
    console.log('2️⃣  Eski işlem tiplerini silme...')

    const deletedTypes = await prisma.refTxType.deleteMany({
      where: {
        code: { in: ['INCOME', 'EXPENSE'] },
      },
    })

    console.log(`   ✅ ${deletedTypes.count} eski tip silindi (INCOME, EXPENSE)`)
    console.log()
  }

  // 4. Final durum
  console.log('3️⃣  Final durum:\n')

  const finalTypes = await prisma.refTxType.findMany({
    orderBy: { id: 'asc' },
  })

  console.log('   İŞLEM TİPLERİ:')
  for (const tt of finalTypes) {
    const icon = tt.code === 'GELIR' ? '🟢' : '🔴'
    const categoryCount = await prisma.refTxCategory.count({
      where: { txTypeId: tt.id },
    })
    const transactionCount = await prisma.transaction.count({
      where: { txTypeId: tt.id },
    })

    console.log(
      `   ${icon} ID:${tt.id} | ${tt.code} | ${categoryCount} kategori | ${transactionCount} işlem`
    )
  }

  console.log()

  // 5. Free kullanıcının son durumu
  const freeUserTransactions = await prisma.transaction.findMany({
    where: { userId: freeUser.id },
    include: {
      txType: true,
      category: true,
    },
  })

  if (freeUserTransactions.length > 0) {
    console.log(`📊 FREE KULLANICI SON DURUM:`)
    console.log()

    freeUserTransactions.forEach(tx => {
      const icon = tx.txType.code === 'GELIR' ? '🟢' : '🔴'
      console.log(
        `   ${icon} ${tx.transactionDate.toISOString().split('T')[0]} | ` +
          `${tx.txType.name} | ${tx.category.name} | ${Number(tx.amount).toFixed(2)} TRY`
      )
    })

    const totalGelir = freeUserTransactions
      .filter(t => t.txType.code === 'GELIR')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalGider = freeUserTransactions
      .filter(t => t.txType.code === 'GIDER')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    console.log()
    console.log(`   🟢 Toplam GELIR: ${totalGelir.toFixed(2)} TRY`)
    console.log(`   🔴 Toplam GIDER: ${totalGider.toFixed(2)} TRY`)
    console.log(`   💰 NET DURUM: ${(totalGelir - totalGider).toFixed(2)} TRY`)
    console.log()

    if (totalGelir - totalGider > 0) {
      console.log(`   ✅ DOĞRU! Dashboard +${(totalGelir - totalGider).toFixed(2)} TRY gösterecek`)
    }
  }

  console.log()
  console.log('✅ TEMİZLİK TAMAMLANDI!\n')
}

main()
  .catch(e => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
