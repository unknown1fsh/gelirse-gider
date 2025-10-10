// Tüm hesap bakiyelerini transaction'lara göre yeniden hesapla
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function recalculate() {
  console.log('🔧 Hesap Bakiyeleri Yeniden Hesaplanıyor...\n')

  try {
    // Tüm hesapları al
    const accounts = await prisma.account.findMany({
      include: { user: true, bank: true, currency: true },
    })

    console.log(`Toplam ${accounts.length} hesap bulundu\n`)

    for (const account of accounts) {
      console.log(`━━━ ${account.user.email} - ${account.name} ━━━`)
      console.log(`Mevcut Bakiye: ${account.balance} ${account.currency.code}`)

      // Başlangıç bakiyesini kaydet (hesap oluşturulurken girilmiş)
      const openingBalance = new Prisma.Decimal(account.balance)
      console.log(`Başlangıç Bakiyesi (kaydedilmiş): ${openingBalance}`)

      // Bu hesaba ait transaction'ları al
      const txs = await prisma.transaction.findMany({
        where: { accountId: account.id },
        include: { txType: true },
        orderBy: { transactionDate: 'asc' },
      })

      if (txs.length > 0) {
        let totalIncome = new Prisma.Decimal(0)
        let totalExpense = new Prisma.Decimal(0)

        txs.forEach(tx => {
          if (tx.txType.code === 'GELIR') {
            totalIncome = totalIncome.add(tx.amount)
          } else {
            totalExpense = totalExpense.add(tx.amount)
          }
        })

        console.log(`\nTransaction Özeti:`)
        console.log(`  Gelir: +${totalIncome}`)
        console.log(`  Gider: -${totalExpense}`)
        console.log(`  Net: ${totalIncome.sub(totalExpense)}`)

        // Yeni bakiye = Başlangıç + Gelirler - Giderler
        const newBalance = openingBalance.add(totalIncome).sub(totalExpense)
        console.log(`\nYeni Bakiye: ${newBalance} ${account.currency.code}`)

        // Güncelle
        await prisma.account.update({
          where: { id: account.id },
          data: { balance: newBalance },
        })

        console.log(`✅ Bakiye güncellendi\n`)
      } else {
        console.log(`Transaction yok, bakiye değişmedi\n`)
      }
    }

    // Kredi kartları için aynı işlem
    console.log('\n💳 Kredi Kartları:\n')
    const cards = await prisma.creditCard.findMany({
      include: { user: true, bank: true },
    })

    for (const card of cards) {
      console.log(`━━━ ${card.user.email} - ${card.name} ━━━`)
      console.log(`Limit: ${card.limitAmount}`)
      console.log(`Mevcut Müsait: ${card.availableLimit}`)

      // Başlangıç limiti = limitAmount
      const openingLimit = card.limitAmount

      // Bu karta ait transaction'ları al
      const txs = await prisma.transaction.findMany({
        where: { creditCardId: card.id },
        include: { txType: true },
      })

      if (txs.length > 0) {
        let totalIncome = new Prisma.Decimal(0)
        let totalExpense = new Prisma.Decimal(0)

        txs.forEach(tx => {
          if (tx.txType.code === 'GELIR') {
            totalIncome = totalIncome.add(tx.amount) // Ödeme
          } else {
            totalExpense = totalExpense.add(tx.amount) // Harcama
          }
        })

        console.log(`\nTransaction Özeti:`)
        console.log(`  Gelir (Ödeme): +${totalIncome}`)
        console.log(`  Gider (Harcama): -${totalExpense}`)

        // Yeni müsait limit = Başlangıç + Ödemeler - Harcamalar
        const newAvailableLimit = openingLimit.add(totalIncome).sub(totalExpense)
        console.log(`\nYeni Müsait Limit: ${newAvailableLimit}`)

        // Güncelle
        await prisma.creditCard.update({
          where: { id: card.id },
          data: { availableLimit: newAvailableLimit },
        })

        console.log(`✅ Limit güncellendi\n`)
      } else {
        console.log(`Transaction yok\n`)
      }
    }

    console.log('✅ Tüm bakiyeler yeniden hesaplandı!')
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

recalculate()
