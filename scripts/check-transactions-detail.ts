import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script free kullanıcısının işlemlerini detaylı gösterir.
async function main() {
  console.log('🔍 FREE KULLANICI İŞLEMLERİ DETAYLI RAPOR\n')

  // Free kullanıcısını bul
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

  console.log(`👤 Kullanıcı: ${freeUser.email} (${freeUser.name})`)
  console.log(`📋 Plan: ${freeUser.subscriptions[0]?.planId || 'free'}`)
  console.log()

  // İşlem tiplerini al
  const txTypes = await prisma.refTxType.findMany({
    orderBy: { id: 'asc' },
  })

  console.log('📌 İşlem Tipleri:')
  txTypes.forEach(tt => {
    console.log(`   ${tt.id}: ${tt.code} (${tt.name})`)
  })
  console.log()

  // Tüm işlemleri çek
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

  console.log(`📦 Toplam ${transactions.length} işlem bulundu\n`)

  if (transactions.length === 0) {
    console.log('ℹ️  Hiç işlem yok.\n')
    return
  }

  console.log('━'.repeat(120))
  console.log(
    'ID'.padEnd(6) +
      '| ' +
      'Tarih'.padEnd(12) +
      '| ' +
      'Tip ID'.padEnd(8) +
      '| ' +
      'Tip'.padEnd(10) +
      '| ' +
      'Kategori'.padEnd(20) +
      '| ' +
      'Kat.Tip'.padEnd(10) +
      '| ' +
      'Tutar'.padEnd(15) +
      '| Uyumlu?'
  )
  console.log('━'.repeat(120))

  let totalGelir = 0
  let totalGider = 0

  transactions.forEach(tx => {
    const isMatch = tx.category.txTypeId === tx.txTypeId
    const matchIcon = isMatch ? '✅' : '❌'
    const typeIcon = tx.txType.code === 'GELIR' ? '🟢' : '🔴'

    console.log(
      String(tx.id).padEnd(6) +
        '| ' +
        tx.transactionDate.toISOString().split('T')[0].padEnd(12) +
        '| ' +
        String(tx.txTypeId).padEnd(8) +
        '| ' +
        `${typeIcon} ${tx.txType.name}`.padEnd(10) +
        '| ' +
        tx.category.name.padEnd(20) +
        '| ' +
        tx.category.txType.name.padEnd(10) +
        '| ' +
        `${Number(tx.amount).toFixed(2)} TRY`.padEnd(15) +
        '| ' +
        matchIcon
    )

    if (tx.txType.code === 'GELIR') {
      totalGelir += Number(tx.amount)
    } else {
      totalGider += Number(tx.amount)
    }
  })

  console.log('━'.repeat(120))
  console.log()

  console.log('📊 ÖZET:')
  console.log(`   🟢 Toplam GELIR: ${totalGelir.toFixed(2)} TRY`)
  console.log(`   🔴 Toplam GIDER: ${totalGider.toFixed(2)} TRY`)
  console.log(`   💰 NET DURUM: ${(totalGelir - totalGider).toFixed(2)} TRY`)
  console.log()

  // Yanlış olanları tespit et
  const wrongOnes = transactions.filter(tx => tx.category.txTypeId !== tx.txTypeId)

  if (wrongOnes.length > 0) {
    console.log(`⚠️  ${wrongOnes.length} YANLIŞLIK TESPİT EDİLDİ!\n`)

    for (const tx of wrongOnes) {
      console.log(`❌ İşlem ID: ${tx.id}`)
      console.log(`   Tarih: ${tx.transactionDate.toISOString().split('T')[0]}`)
      console.log(`   Şu anki tip: ${tx.txType.name} (ID: ${tx.txTypeId})`)
      console.log(`   Kategori: ${tx.category.name}`)
      console.log(`   Kategorinin tipi: ${tx.category.txType.name} (ID: ${tx.category.txTypeId})`)
      console.log(`   Tutar: ${Number(tx.amount).toFixed(2)} TRY`)
      console.log()
      console.log(`   🔧 DÜZELTİLECEK: txTypeId ${tx.txTypeId} → ${tx.category.txTypeId}`)
      console.log()

      // Düzelt
      await prisma.transaction.update({
        where: { id: tx.id },
        data: {
          txTypeId: tx.category.txTypeId,
        },
      })

      console.log(`   ✅ Düzeltildi!\n`)
    }

    // Düzeltme sonrası tekrar hesapla
    console.log('='.repeat(120))
    console.log('\n📊 DÜZELTİLMİŞ DURUM:\n')

    const updatedTransactions = await prisma.transaction.findMany({
      where: { userId: freeUser.id },
      include: {
        txType: true,
      },
    })

    const newTotalGelir = updatedTransactions
      .filter(t => t.txType.code === 'GELIR')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const newTotalGider = updatedTransactions
      .filter(t => t.txType.code === 'GIDER')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    console.log(`   🟢 Toplam GELIR: ${newTotalGelir.toFixed(2)} TRY`)
    console.log(`   🔴 Toplam GIDER: ${newTotalGider.toFixed(2)} TRY`)
    console.log(`   💰 NET DURUM: ${(newTotalGelir - newTotalGider).toFixed(2)} TRY`)
    console.log()
    console.log('✅ SORUN ÇÖZÜLDÜ!\n')
  } else {
    console.log('✅ Yanlış kayıt yok, tüm işlemler doğru!\n')
  }
}

main()
  .catch(e => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
