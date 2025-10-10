import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script kategori-tip uyumsuzluğu olan işlemleri düzeltir.
async function main() {
  console.log('🔍 Yanlış tip-kategori kombinasyonları aranıyor...\n')

  // Tüm işlemleri çek
  const allTransactions = await prisma.transaction.findMany({
    include: {
      txType: true,
      category: {
        include: {
          txType: true,
        },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  console.log(`📦 Toplam ${allTransactions.length} işlem bulundu\n`)

  const wrongTransactions = []

  for (const tx of allTransactions) {
    // Kategori tipine göre işlem tipi kontrol et
    if (tx.category.txTypeId !== tx.txTypeId) {
      wrongTransactions.push({
        id: tx.id,
        userId: tx.userId,
        userEmail: tx.user.email,
        date: tx.transactionDate,
        currentType: tx.txType.name,
        currentTypeId: tx.txTypeId,
        category: tx.category.name,
        correctType: tx.category.txType.name,
        correctTypeId: tx.category.txTypeId,
        amount: Number(tx.amount),
      })
    }
  }

  if (wrongTransactions.length === 0) {
    console.log('✅ Tüm işlemler doğru! Yanlış kayıt bulunamadı.\n')
    return
  }

  console.log(`⚠️  ${wrongTransactions.length} YANLIŞLIK TESPİT EDİLDİ!\n`)

  wrongTransactions.forEach((wt, index) => {
    console.log(`${index + 1}. İşlem ID: ${wt.id}`)
    console.log(`   Kullanıcı: ${wt.userEmail}`)
    console.log(`   Tarih: ${wt.date.toISOString().split('T')[0]}`)
    console.log(`   ❌ Şu anki tip: ${wt.currentType} (ID: ${wt.currentTypeId})`)
    console.log(`   ✅ Olması gereken: ${wt.correctType} (ID: ${wt.correctTypeId})`)
    console.log(`   📁 Kategori: ${wt.category}`)
    console.log(`   💰 Tutar: ${wt.amount.toFixed(2)} TRY`)
    console.log()
  })

  console.log('🔧 DÜZELTİLİYOR...\n')

  let fixedCount = 0
  for (const wt of wrongTransactions) {
    await prisma.transaction.update({
      where: { id: wt.id },
      data: {
        txTypeId: wt.correctTypeId,
      },
    })

    console.log(
      `✅ İşlem ${wt.id} düzeltildi: ${wt.currentType} → ${wt.correctType} (${wt.amount.toFixed(2)} TRY)`
    )
    fixedCount++
  }

  console.log(`\n✅ Toplam ${fixedCount} işlem düzeltildi!\n`)

  // Son kontrol
  console.log('🔍 Son kontrol yapılıyor...\n')

  for (const user of users) {
    const userTransactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: {
        txType: true,
      },
    })

    if (userTransactions.length > 0) {
      const totalGelir = userTransactions
        .filter(t => t.txType.code === 'GELIR')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      const totalGider = userTransactions
        .filter(t => t.txType.code === 'GIDER')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      console.log(`${user.email}:`)
      console.log(`  🟢 GELIR: ${totalGelir.toFixed(2)} TRY`)
      console.log(`  🔴 GIDER: ${totalGider.toFixed(2)} TRY`)
      console.log(`  💰 NET: ${(totalGelir - totalGider).toFixed(2)} TRY`)
      console.log()
    }
  }

  console.log('✅ DÜZELTİLMİŞ DURUM RAPORU TAMAMLANDI!\n')
}

main()
  .catch(e => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
