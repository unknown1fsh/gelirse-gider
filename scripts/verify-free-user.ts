import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script free kullanıcının final durumunu gösterir.
async function main() {
  console.log('✅ FREE KULLANICI DURUM RAPORU\n')

  const freeUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: { contains: 'free' } }, { email: { contains: 'Free' } }],
    },
    include: {
      subscriptions: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!freeUser) {
    console.log('❌ Free kullanıcı bulunamadı!')
    return
  }

  console.log(`👤 KULLANICI BİLGİLERİ:`)
  console.log(`   Email: ${freeUser.email}`)
  console.log(`   Ad: ${freeUser.name}`)
  console.log(`   Plan: ${freeUser.subscriptions[0]?.planId || 'free'}`)
  console.log(`   Durum: ${freeUser.isActive ? '✅ Aktif' : '❌ Pasif'}`)
  console.log()

  // İşlem tipleri
  const txTypes = await prisma.refTxType.findMany({
    orderBy: { id: 'asc' },
  })

  console.log(`📌 İŞLEM TİPLERİ (${txTypes.length} adet):`)
  txTypes.forEach(tt => {
    const icon = tt.code === 'GELIR' ? '🟢' : '🔴'
    console.log(
      `   ${icon} ID:${tt.id} | ${tt.code} | ${tt.name} | ${tt.icon || '-'} | ${tt.color || '-'}`
    )
  })
  console.log()

  // İşlemler
  const transactions = await prisma.transaction.findMany({
    where: { userId: freeUser.id },
    include: {
      txType: true,
      category: {
        include: {
          txType: true,
        },
      },
    },
    orderBy: { transactionDate: 'desc' },
  })

  console.log(`📦 İŞLEMLER (${transactions.length} adet):`)

  if (transactions.length === 0) {
    console.log(`   ℹ️  Hiç işlem yok`)
    console.log()
  } else {
    console.log()
    transactions.forEach(tx => {
      const icon = tx.txType.code === 'GELIR' ? '🟢' : '🔴'
      const match = tx.category.txTypeId === tx.txTypeId ? '✅' : '❌'
      console.log(`   ${icon} İşlem ID: ${tx.id}`)
      console.log(`      Tarih: ${tx.transactionDate.toISOString().split('T')[0]}`)
      console.log(`      Tip: ${tx.txType.name} (ID:${tx.txTypeId}, Code:${tx.txType.code})`)
      console.log(`      Kategori: ${tx.category.name} (ID:${tx.categoryId})`)
      console.log(`      Kategori Tipi: ${tx.category.txType.name} (ID:${tx.category.txTypeId})`)
      console.log(`      Tutar: ${Number(tx.amount).toFixed(2)} TRY`)
      console.log(`      Uyumlu: ${match}`)
      console.log()
    })

    // Hesaplamalar
    const totalGelir = transactions
      .filter(t => t.txType.code === 'GELIR')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalGider = transactions
      .filter(t => t.txType.code === 'GIDER')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const netAmount = totalGelir - totalGider

    console.log(`📊 HESAPLAMALAR:`)
    console.log(`   🟢 Toplam GELIR: ${totalGelir.toFixed(2)} TRY`)
    console.log(`   🔴 Toplam GIDER: ${totalGider.toFixed(2)} TRY`)
    console.log(`   💰 NET DURUM: ${netAmount >= 0 ? '+' : ''}${netAmount.toFixed(2)} TRY`)
    console.log()

    if (netAmount === 140000) {
      console.log(`   ✅ DOĞRU! Dashboard +140,000 TRY gösterecek`)
    } else if (netAmount === -140000) {
      console.log(`   ❌ YANLIŞ! Dashboard -140,000 TRY gösteriyor`)
      console.log(`   Sorun: İşlem yanlış tipte kayıtlı`)
    } else {
      console.log(`   ℹ️  Dashboard ${netAmount.toFixed(2)} TRY gösterecek`)
    }
  }

  console.log()

  // 2. Dashboard API'nin kullandığı sorguyu simüle et
  console.log('🔍 DASHBOARD API SORGUSU SİMÜLASYONU:\n')

  const kpiData: any = await prisma.$queryRaw`
    SELECT 
      COALESCE(SUM(CASE WHEN tt.code = 'GELIR' THEN t.amount ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN tt.code = 'GIDER' THEN t.amount ELSE 0 END), 0) as total_expense,
      COALESCE(SUM(CASE WHEN tt.code = 'GELIR' THEN t.amount ELSE -t.amount END), 0) as net_amount,
      COUNT(CASE WHEN tt.code = 'GELIR' THEN 1 END) as income_count,
      COUNT(CASE WHEN tt.code = 'GIDER' THEN 1 END) as expense_count
    FROM transaction t
    JOIN ref_tx_type tt ON t.tx_type_id = tt.id
    WHERE t.user_id = ${freeUser.id}
      AND t.transaction_date >= CURRENT_DATE - INTERVAL '30 days'
  `

  const kpi = kpiData[0]

  console.log(`   🟢 GELIR: ${Number(kpi.total_income).toFixed(2)} TRY (${kpi.income_count} işlem)`)
  console.log(
    `   🔴 GIDER: ${Number(kpi.total_expense).toFixed(2)} TRY (${kpi.expense_count} işlem)`
  )
  console.log(`   💰 NET: ${Number(kpi.net_amount).toFixed(2)} TRY`)
  console.log()

  if (Number(kpi.net_amount) === 140000) {
    console.log(`   ✅ BAŞARILI! Dashboard artık +140,000 TRY gösterecek!`)
  } else if (Number(kpi.net_amount) === -140000) {
    console.log(`   ❌ SORUN DEVAM EDİYOR! Dashboard -140,000 TRY gösteriyor`)
  } else {
    console.log(`   ℹ️  Dashboard ${Number(kpi.net_amount).toFixed(2)} TRY gösterecek`)
  }

  console.log()
  console.log('🎉 VERİFİKASYON TAMAMLANDI!\n')
  console.log("🌐 Dashboard'ı kontrol edin: http://localhost:3000/dashboard\n")
}

main()
  .catch(e => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
