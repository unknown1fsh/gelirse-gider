import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script işlem tiplerini temizler ve düzeltir.
async function main() {
  console.log('🔧 İŞLEM TİPLERİ TEMİZLİĞİ VE DÜZELTMESİ\n')

  // 1. Mevcut durumu göster
  const currentTypes = await prisma.refTxType.findMany({
    orderBy: { id: 'asc' },
  })

  console.log('📦 Mevcut işlem tipleri:')
  currentTypes.forEach(tt => {
    console.log(`   ID:${tt.id} | Code: ${tt.code} | Name: ${tt.name}`)
  })
  console.log()

  // 2. Türkçe tipleri bul
  const gelirType = currentTypes.find(t => t.code === 'GELIR')
  const giderType = currentTypes.find(t => t.code === 'GIDER')

  if (!gelirType || !giderType) {
    console.log('❌ GELIR veya GIDER tipi bulunamadı!')
    console.log("   Seed script'ini çalıştırın: npx tsx prisma/seed.ts\n")
    return
  }

  console.log(`✅ Türkçe tipler bulundu:`)
  console.log(`   GELIR → ID:${gelirType.id}`)
  console.log(`   GIDER → ID:${giderType.id}`)
  console.log()

  // 3. İngilizce tipleri bul
  const incomeType = currentTypes.find(t => t.code === 'INCOME')
  const expenseType = currentTypes.find(t => t.code === 'EXPENSE')

  if (!incomeType && !expenseType) {
    console.log('✅ İngilizce kodlar yok, veritabanı temiz!\n')
    return
  }

  console.log('⚠️  İngilizce tipler tespit edildi:')
  if (incomeType) console.log(`   INCOME → ID:${incomeType.id}`)
  if (expenseType) console.log(`   EXPENSE → ID:${expenseType.id}`)
  console.log()

  // 4. İngilizce ID kullanan işlemleri Türkçe ID'ye güncelle
  if (incomeType) {
    const incomeTransactions = await prisma.transaction.findMany({
      where: { txTypeId: incomeType.id },
    })

    if (incomeTransactions.length > 0) {
      console.log(
        `🔄 ${incomeTransactions.length} işlem INCOME (ID:${incomeType.id}) → GELIR (ID:${gelirType.id}) olarak güncelleniyor...`
      )

      await prisma.transaction.updateMany({
        where: { txTypeId: incomeType.id },
        data: { txTypeId: gelirType.id },
      })

      console.log(`   ✅ ${incomeTransactions.length} işlem güncellendi`)
    }
  }

  if (expenseType) {
    const expenseTransactions = await prisma.transaction.findMany({
      where: { txTypeId: expenseType.id },
    })

    if (expenseTransactions.length > 0) {
      console.log(
        `🔄 ${expenseTransactions.length} işlem EXPENSE (ID:${expenseType.id}) → GIDER (ID:${giderType.id}) olarak güncelleniyor...`
      )

      await prisma.transaction.updateMany({
        where: { txTypeId: expenseType.id },
        data: { txTypeId: giderType.id },
      })

      console.log(`   ✅ ${expenseTransactions.length} işlem güncellendi`)
    }
  }

  console.log()

  // 5. Kategorileri de güncelle
  if (incomeType) {
    const incomeCategories = await prisma.refTxCategory.findMany({
      where: { txTypeId: incomeType.id },
    })

    if (incomeCategories.length > 0) {
      console.log(`🔄 ${incomeCategories.length} kategori INCOME → GELIR olarak güncelleniyor...`)

      await prisma.refTxCategory.updateMany({
        where: { txTypeId: incomeType.id },
        data: { txTypeId: gelirType.id },
      })

      console.log(`   ✅ ${incomeCategories.length} kategori güncellendi`)
    }
  }

  if (expenseType) {
    const expenseCategories = await prisma.refTxCategory.findMany({
      where: { txTypeId: expenseType.id },
    })

    if (expenseCategories.length > 0) {
      console.log(`🔄 ${expenseCategories.length} kategori EXPENSE → GIDER olarak güncelleniyor...`)

      await prisma.refTxCategory.updateMany({
        where: { txTypeId: expenseType.id },
        data: { txTypeId: giderType.id },
      })

      console.log(`   ✅ ${expenseCategories.length} kategori güncellendi`)
    }
  }

  console.log()

  // 6. Eski İngilizce tipleri sil
  if (incomeType) {
    await prisma.refTxType.delete({
      where: { id: incomeType.id },
    })
    console.log(`🗑️  INCOME tipi (ID:${incomeType.id}) silindi`)
  }

  if (expenseType) {
    await prisma.refTxType.delete({
      where: { id: expenseType.id },
    })
    console.log(`🗑️  EXPENSE tipi (ID:${expenseType.id}) silindi`)
  }

  console.log()

  // 7. Final durum
  const finalTypes = await prisma.refTxType.findMany({
    orderBy: { id: 'asc' },
  })

  console.log('✅ TEMİZLENMİŞ İŞLEM TİPLERİ:')
  finalTypes.forEach(tt => {
    const icon = tt.code === 'GELIR' ? '🟢' : '🔴'
    console.log(
      `   ${icon} ID:${tt.id} | Code: ${tt.code} | Name: ${tt.name} | Icon: ${tt.icon} | Color: ${tt.color}`
    )
  })
  console.log()

  // 8. Free kullanıcının son durumunu göster
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

    console.log(`📊 FREE KULLANICI DURUMU:`)
    console.log(`   Email: ${freeUser.email}`)
    console.log(`   İşlem sayısı: ${transactions.length}`)

    if (transactions.length > 0) {
      const totalGelir = transactions
        .filter(t => t.txType.code === 'GELIR')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      const totalGider = transactions
        .filter(t => t.txType.code === 'GIDER')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      console.log()
      console.log('   İşlemler:')
      transactions.forEach(tx => {
        const icon = tx.txType.code === 'GELIR' ? '🟢' : '🔴'
        console.log(
          `   ${icon} ${tx.transactionDate.toISOString().split('T')[0]} | ` +
            `${tx.txType.name} | ${tx.category.name} | ${Number(tx.amount).toFixed(2)} TRY`
        )
      })

      console.log()
      console.log(`   🟢 GELIR: ${totalGelir.toFixed(2)} TRY`)
      console.log(`   🔴 GIDER: ${totalGider.toFixed(2)} TRY`)
      console.log(`   💰 NET: ${(totalGelir - totalGider).toFixed(2)} TRY`)
      console.log()
    }
  }

  console.log("🎉 SORUN ÇÖZÜLDÜ! Dashboard'ı yenileyin.\n")
}

main()
  .catch(e => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
