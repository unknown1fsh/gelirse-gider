import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script veritabanındaki yanlış kayıtları düzeltir ve temizler.
async function main() {
  console.log('🔍 Veritabanı kayıtları kontrol ediliyor...\n')

  // 1. Tüm kullanıcıları listele
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  console.log(`👥 Toplam ${users.length} kullanıcı bulundu:`)
  users.forEach(u => console.log(`  - ${u.id}: ${u.email} (${u.name})`))
  console.log()

  // 2. Her kullanıcı için işlem istatistiklerini göster
  for (const user of users) {
    console.log(`📊 Kullanıcı: ${user.email}`)

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: {
        txType: true,
        category: true,
      },
      orderBy: { transactionDate: 'desc' },
    })

    console.log(`  Toplam işlem: ${transactions.length}`)

    if (transactions.length > 0) {
      const gelirCount = transactions.filter(t => t.txType.code === 'GELIR').length
      const giderCount = transactions.filter(t => t.txType.code === 'GIDER').length

      const totalGelir = transactions
        .filter(t => t.txType.code === 'GELIR')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      const totalGider = transactions
        .filter(t => t.txType.code === 'GIDER')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      console.log(`  🟢 GELIR: ${gelirCount} işlem, Toplam: ${totalGelir.toFixed(2)} TRY`)
      console.log(`  🔴 GIDER: ${giderCount} işlem, Toplam: ${totalGider.toFixed(2)} TRY`)
      console.log(`  💰 NET: ${(totalGelir - totalGider).toFixed(2)} TRY`)

      // İlk 5 işlemi göster
      console.log(`\n  Son 5 işlem:`)
      transactions.slice(0, 5).forEach(t => {
        const icon = t.txType.code === 'GELIR' ? '🟢' : '🔴'
        console.log(
          `    ${icon} ${t.transactionDate.toISOString().split('T')[0]} | ` +
            `${t.txType.name} | ${t.category.name} | ${Number(t.amount).toFixed(2)} TRY`
        )
      })

      // ⚠️ YANLIŞLIK KONTROLÜ
      const wrongTransactions = []
      for (const tx of transactions) {
        const category = await prisma.refTxCategory.findUnique({
          where: { id: tx.categoryId },
          include: { txType: true },
        })

        if (category && category.txTypeId !== tx.txTypeId) {
          wrongTransactions.push({
            id: tx.id,
            date: tx.transactionDate,
            txType: tx.txType.name,
            category: category.name,
            categoryType: category.txType.name,
            amount: Number(tx.amount),
          })
        }
      }

      if (wrongTransactions.length > 0) {
        console.log(`\n  ⚠️  YANLIŞLIK TESPİT EDİLDİ: ${wrongTransactions.length} işlem`)
        wrongTransactions.forEach(wt => {
          console.log(
            `    ❌ ID:${wt.id} | ${wt.date.toISOString().split('T')[0]} | ` +
              `Tip:${wt.txType} ama Kategori:${wt.category} (${wt.categoryType} kategorisi!) | ${wt.amount} TRY`
          )
        })

        // Yanlış kayıtları düzelt
        console.log(`\n  🔧 Düzeltme yapılıyor...`)
        for (const wt of wrongTransactions) {
          // Kategorisine göre doğru tip ID'sini al
          const correctType = await prisma.refTxType.findUnique({
            where: { code: wt.categoryType === 'Gelir' ? 'GELIR' : 'GIDER' },
          })

          if (correctType) {
            await prisma.transaction.update({
              where: { id: wt.id },
              data: { txTypeId: correctType.id },
            })
            console.log(`    ✅ ID:${wt.id} düzeltildi: ${wt.txType} → ${correctType.name}`)
          }
        }
      } else {
        console.log(`\n  ✅ Tüm işlemler doğru!`)
      }
    }

    console.log('\n' + '='.repeat(80) + '\n')
  }

  // 3. Demo/test kullanıcısı için temizlik önerisi
  const demoUsers = users.filter(u => u.email.includes('demo') || u.email.includes('test'))

  if (demoUsers.length > 0) {
    console.log('🧹 Demo/test kullanıcıları tespit edildi:')
    demoUsers.forEach(u => console.log(`  - ${u.email}`))
    console.log('\n  ℹ️  Bu kullanıcıları silmek için:')
    console.log(`     await prisma.user.deleteMany({ where: { email: { contains: 'demo' } } })`)
    console.log()
  }

  console.log('✅ Kontrol tamamlandı!\n')
}

main()
  .catch(e => {
    console.error('Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
