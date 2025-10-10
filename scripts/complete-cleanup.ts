import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script veritabanını tamamen temizler ve yeniden düzenler.
async function main() {
  console.log('🧹 KAPSAMLI VERİTABANI TEMİZLİĞİ\n')

  // 1. Mevcut durumu göster
  console.log('1️⃣  Mevcut durum:')
  const currentTypes = await prisma.refTxType.findMany({
    orderBy: { id: 'asc' },
  })

  currentTypes.forEach(tt => {
    console.log(`   ID:${tt.id} | Code: ${tt.code} | Name: ${tt.name}`)
  })
  console.log()

  // 2. Kategorileri kontrol et
  for (const tt of currentTypes) {
    const categoryCount = await prisma.refTxCategory.count({
      where: { txTypeId: tt.id },
    })
    console.log(`   Tip ID:${tt.id} (${tt.code}) → ${categoryCount} kategori`)
  }
  console.log()

  // 3. İşlemleri kontrol et
  for (const tt of currentTypes) {
    const transactionCount = await prisma.transaction.count({
      where: { txTypeId: tt.id },
    })
    console.log(`   Tip ID:${tt.id} (${tt.code}) → ${transactionCount} işlem`)
  }
  console.log()

  // 4. Eski İngilizce kategorileri SİL
  console.log('2️⃣  Eski kategorileri silme...')

  const deletedIncomeCategories = await prisma.refTxCategory.deleteMany({
    where: { txTypeId: 1 }, // INCOME
  })
  console.log(`   ✅ ${deletedIncomeCategories.count} INCOME kategorisi silindi`)

  const deletedExpenseCategories = await prisma.refTxCategory.deleteMany({
    where: { txTypeId: 2 }, // EXPENSE
  })
  console.log(`   ✅ ${deletedExpenseCategories.count} EXPENSE kategorisi silindi`)
  console.log()

  // 5. Eski İngilizce tipleri SİL
  console.log('3️⃣  Eski işlem tiplerini silme...')

  await prisma.refTxType.deleteMany({
    where: {
      code: {
        in: ['INCOME', 'EXPENSE'],
      },
    },
  })
  console.log(`   ✅ INCOME ve EXPENSE tipleri silindi`)
  console.log()

  // 6. Final durum
  console.log('4️⃣  Final durum:\n')

  const finalTypes = await prisma.refTxType.findMany({
    orderBy: { id: 'asc' },
  })

  console.log('   ✅ KALAN İŞLEM TİPLERİ:')
  finalTypes.forEach(tt => {
    const icon = tt.code === 'GELIR' ? '🟢' : '🔴'
    console.log(
      `   ${icon} ID:${tt.id} | Code: ${tt.code} | Name: ${tt.name} | Icon: ${tt.icon || '-'} | Color: ${tt.color || '-'}`
    )
  })
  console.log()

  for (const tt of finalTypes) {
    const categoryCount = await prisma.refTxCategory.count({
      where: { txTypeId: tt.id },
    })
    const transactionCount = await prisma.transaction.count({
      where: { txTypeId: tt.id },
    })
    console.log(`   ${tt.code}: ${categoryCount} kategori, ${transactionCount} işlem`)
  }
  console.log()

  // 7. Free kullanıcının son durumu
  const freeUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: { contains: 'free' } }, { email: { contains: 'Free' } }],
    },
  })

  if (freeUser) {
    console.log('5️⃣  Free kullanıcı durumu:\n')

    const transactions = await prisma.transaction.findMany({
      where: { userId: freeUser.id },
      include: {
        txType: true,
        category: true,
      },
    })

    if (transactions.length > 0) {
      console.log(`   İşlemler:`)
      transactions.forEach(tx => {
        const icon = tx.txType.code === 'GELIR' ? '🟢' : '🔴'
        console.log(
          `   ${icon} ${tx.transactionDate.toISOString().split('T')[0]} | ` +
            `Tip:${tx.txType.name} | Kategori:${tx.category.name} | ${Number(tx.amount).toFixed(2)} TRY`
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

      if (totalGelir - totalGider === 140000) {
        console.log('   ✅ DOĞRU! Dashboard +140,000 TRY gösterecek')
      } else if (totalGelir - totalGider === -140000) {
        console.log('   ❌ HATA! Dashboard -140,000 TRY gösteriyor')
      }
    } else {
      console.log('   ℹ️  Hiç işlem yok')
    }
  }

  console.log()
  console.log('🎉 TEMİZLİK TAMAMLANDI!\n')
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
