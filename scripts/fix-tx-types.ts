import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script işlem tiplerini düzeltir (INCOME/EXPENSE → GELIR/GIDER).
async function main() {
  console.log('🔍 İşlem tipleri kontrol ediliyor...\n')

  const txTypes = await prisma.refTxType.findMany({
    orderBy: { id: 'asc' },
  })

  console.log(`📦 Mevcut işlem tipleri:`)
  txTypes.forEach(tt => {
    console.log(`   ID:${tt.id} | Code: ${tt.code} | Name: ${tt.name}`)
  })
  console.log()

  // İngilizce kod varsa düzelt
  const needsFix = txTypes.some(tt => tt.code === 'INCOME' || tt.code === 'EXPENSE')

  if (needsFix) {
    console.log("⚠️  İngilizce kodlar tespit edildi! Türkçe'ye çevriliyor...\n")

    // INCOME → GELIR
    const incomeType = await prisma.refTxType.findFirst({
      where: { code: 'INCOME' },
    })
    if (incomeType) {
      await prisma.refTxType.update({
        where: { id: incomeType.id },
        data: {
          code: 'GELIR',
          name: 'Gelir',
          icon: 'TrendingUp',
          color: '#10b981',
        },
      })
      console.log(`✅ ID:${incomeType.id} düzeltildi: INCOME → GELIR`)
    }

    // EXPENSE → GIDER
    const expenseType = await prisma.refTxType.findFirst({
      where: { code: 'EXPENSE' },
    })
    if (expenseType) {
      await prisma.refTxType.update({
        where: { id: expenseType.id },
        data: {
          code: 'GIDER',
          name: 'Gider',
          icon: 'TrendingDown',
          color: '#ef4444',
        },
      })
      console.log(`✅ ID:${expenseType.id} düzeltildi: EXPENSE → GIDER`)
    }

    console.log()

    // Güncellenmiş halleri göster
    const updatedTypes = await prisma.refTxType.findMany({
      orderBy: { id: 'asc' },
    })

    console.log('✅ Güncellenmiş işlem tipleri:')
    updatedTypes.forEach(tt => {
      const icon = tt.code === 'GELIR' ? '🟢' : '🔴'
      console.log(
        `   ${icon} ID:${tt.id} | Code: ${tt.code} | Name: ${tt.name} | Icon: ${tt.icon} | Color: ${tt.color}`
      )
    })
    console.log()

    // Free kullanıcının durumunu tekrar hesapla
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
        },
      })

      const totalGelir = transactions
        .filter(t => t.txType.code === 'GELIR')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      const totalGider = transactions
        .filter(t => t.txType.code === 'GIDER')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      console.log('📊 FREE KULLANICI YENİ DURUMU:')
      console.log(`   🟢 GELIR: ${totalGelir.toFixed(2)} TRY`)
      console.log(`   🔴 GIDER: ${totalGider.toFixed(2)} TRY`)
      console.log(`   💰 NET: ${(totalGelir - totalGider).toFixed(2)} TRY`)
      console.log()
    }

    console.log('✅ SORUN ÇÖZÜLDÜ! Dashboard artık doğru gösterecek.\n')
  } else {
    console.log('✅ İşlem tipleri zaten doğru! (GELIR/GIDER)\n')

    // Yine de free kullanıcının durumunu göster
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

      console.log(`📦 Free kullanıcı işlemleri: ${transactions.length} adet`)

      if (transactions.length > 0) {
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
        console.log('📊 ÖZET:')
        console.log(`   🟢 GELIR: ${totalGelir.toFixed(2)} TRY`)
        console.log(`   🔴 GIDER: ${totalGider.toFixed(2)} TRY`)
        console.log(`   💰 NET: ${(totalGelir - totalGider).toFixed(2)} TRY`)
        console.log()
      }
    }
  }

  console.log('✅ Script tamamlandı!\n')
}

main()
  .catch(e => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
