// Toplam Varlık Senkronizasyon Testi
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
  console.log('🔍 TOPLAM VARLIK SENKRONİZASYON TESTİ\n')
  console.log('='.repeat(70))

  try {
    // Tüm kullanıcıları al
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            transactions: true,
            accounts: true,
            creditCards: true,
          },
        },
      },
    })

    for (const user of users) {
      if (user._count.transactions === 0 && user._count.accounts === 0) continue

      console.log(`\n\n👤 KULLANICI: ${user.email} (ID: ${user.id})`)
      console.log('-'.repeat(70))

      // 1. Transaction'ları analiz et
      const transactions = await prisma.transaction.findMany({
        where: { userId: user.id },
        include: {
          txType: true,
          category: true,
          paymentMethod: true,
          account: true,
          creditCard: true,
          currency: true,
        },
        orderBy: { transactionDate: 'asc' },
      })

      console.log(`\n📊 Transaction Özeti (${transactions.length} adet):`)

      let totalIncome = new Prisma.Decimal(0)
      let totalExpense = new Prisma.Decimal(0)
      const accountChanges: Record<number, Prisma.Decimal> = {}
      const cardChanges: Record<number, Prisma.Decimal> = {}

      transactions.forEach(tx => {
        const isIncome = tx.txType.code === 'GELIR'
        const amount = new Prisma.Decimal(tx.amount)

        console.log(
          `   ${tx.transactionDate.toISOString().split('T')[0]} | ` +
            `${isIncome ? '✅ GELIR' : '❌ GIDER'} | ` +
            `${tx.category.name.padEnd(20)} | ` +
            `${amount.toString().padStart(10)} ${tx.currency.code} | ` +
            `${tx.paymentMethod.name.padEnd(15)} | ` +
            `${tx.account ? tx.account.name : tx.creditCard ? tx.creditCard.name : 'YOK'}`
        )

        if (isIncome) {
          totalIncome = totalIncome.add(amount)
        } else {
          totalExpense = totalExpense.add(amount)
        }

        // Hesap değişikliklerini takip et
        if (tx.accountId) {
          if (!accountChanges[tx.accountId]) {
            accountChanges[tx.accountId] = new Prisma.Decimal(0)
          }
          accountChanges[tx.accountId] = isIncome
            ? accountChanges[tx.accountId].add(amount)
            : accountChanges[tx.accountId].sub(amount)
        }

        // Kart değişikliklerini takip et
        if (tx.creditCardId) {
          if (!cardChanges[tx.creditCardId]) {
            cardChanges[tx.creditCardId] = new Prisma.Decimal(0)
          }
          cardChanges[tx.creditCardId] = isIncome
            ? cardChanges[tx.creditCardId].add(amount) // Ödeme
            : cardChanges[tx.creditCardId].sub(amount) // Harcama
        }
      })

      const netAmount = totalIncome.sub(totalExpense)

      console.log(`\n📈 Transaction Toplamları:`)
      console.log(`   Toplam Gelir:  ${totalIncome.toString()} TL`)
      console.log(`   Toplam Gider:  ${totalExpense.toString()} TL`)
      console.log(`   Net:           ${netAmount.toString()} TL`)

      // 2. Hesap bakiyelerini kontrol et
      const accounts = await prisma.account.findMany({
        where: { userId: user.id },
        include: { bank: true, currency: true },
      })

      console.log(`\n💰 Hesap Bakiyeleri (${accounts.length} adet):`)

      let totalAccountBalance = new Prisma.Decimal(0)
      let hasBalanceError = false

      for (const account of accounts) {
        const currentBalance = new Prisma.Decimal(account.balance)
        totalAccountBalance = totalAccountBalance.add(currentBalance)

        // Transaction'lardan hesaplanan bakiye
        const expectedChange = accountChanges[account.id] || new Prisma.Decimal(0)

        console.log(
          `   ${account.name.padEnd(30)} | ` +
            `Bakiye: ${currentBalance.toString().padStart(12)} ${account.currency.code} | ` +
            `Banka: ${account.bank.name}`
        )

        // Eğer hesap başlangıçta 0 TL ile oluşturulduysa
        // mevcut bakiye = beklenen değişim olmalı
        const firstTx = transactions.find(
          tx => tx.accountId === account.id && tx.transactionDate <= account.createdAt
        )
        if (!firstTx && !expectedChange.equals(currentBalance)) {
          // Hesap sonradan transaction aldıysa kontrol et
          const accountTxs = transactions.filter(tx => tx.accountId === account.id)
          if (accountTxs.length > 0) {
            console.log(
              `      ⚠️  UYARI: Transaction'lardan beklenen: ${expectedChange.toString()} TL`
            )
            if (!expectedChange.equals(currentBalance)) {
              console.log(`      ❌ HATA: Bakiye uyuşmuyor!`)
              hasBalanceError = true
            }
          }
        }
      }

      console.log(`\n   💎 TOPLAM HESAP BAKİYESİ: ${totalAccountBalance.toString()} TL`)

      // 3. Kredi kartlarını kontrol et
      const creditCards = await prisma.creditCard.findMany({
        where: { userId: user.id },
        include: { bank: true, currency: true },
      })

      let totalCardDebt = new Prisma.Decimal(0)

      if (creditCards.length > 0) {
        console.log(`\n💳 Kredi Kartları (${creditCards.length} adet):`)

        for (const card of creditCards) {
          const limitAmount = new Prisma.Decimal(card.limitAmount)
          const availableLimit = new Prisma.Decimal(card.availableLimit)
          const usedLimit = limitAmount.sub(availableLimit)
          totalCardDebt = totalCardDebt.add(usedLimit)

          const expectedChange = cardChanges[card.id] || new Prisma.Decimal(0)
          const expectedAvailable = limitAmount.add(expectedChange)

          console.log(
            `   ${card.name.padEnd(30)} | ` +
              `Limit: ${limitAmount.toString().padStart(10)} | ` +
              `Müsait: ${availableLimit.toString().padStart(10)} | ` +
              `Borç: ${usedLimit.toString().padStart(10)} ${card.currency.code}`
          )

          if (card.availableLimit && !expectedAvailable.equals(availableLimit)) {
            const cardTxs = transactions.filter(tx => tx.creditCardId === card.id)
            if (cardTxs.length > 0) {
              console.log(
                `      ⚠️  UYARI: Beklenen müsait limit: ${expectedAvailable.toString()} TL`
              )
              console.log(`      ❌ HATA: Kart limiti uyuşmuyor!`)
              hasBalanceError = true
            }
          }
        }

        console.log(`\n   💳 TOPLAM KART BORCU: ${totalCardDebt.toString()} TL`)
      }

      // 4. Altın eşyaları
      const goldItems = await prisma.goldItem.findMany({
        where: { userId: user.id },
        include: { goldType: true, goldPurity: true },
      })

      let totalGoldValue = new Prisma.Decimal(0)

      if (goldItems.length > 0) {
        console.log(`\n🥇 Altın Eşyaları (${goldItems.length} adet):`)

        for (const gold of goldItems) {
          const purchasePrice = new Prisma.Decimal(gold.purchasePrice)
          const currentValue = gold.currentValueTry
            ? new Prisma.Decimal(gold.currentValueTry)
            : purchasePrice
          totalGoldValue = totalGoldValue.add(currentValue)

          console.log(
            `   ${gold.name.padEnd(30)} | ` +
              `${gold.weightGrams}g ${gold.goldPurity.name} | ` +
              `Değer: ${currentValue.toString().padStart(10)} TL`
          )
        }

        console.log(`\n   🥇 TOPLAM ALTIN DEĞERİ: ${totalGoldValue.toString()} TL`)
      }

      // 5. Toplam Varlık Hesaplama
      const totalAssets = totalAccountBalance.add(totalGoldValue)
      const netWorth = totalAssets.sub(totalCardDebt)

      console.log(`\n${'='.repeat(70)}`)
      console.log(`📊 FİNAL DURUM:`)
      console.log(`${'='.repeat(70)}`)
      console.log(`   💰 Toplam Hesap Bakiyeleri:  ${totalAccountBalance.toString()} TL`)
      console.log(`   🥇 Toplam Altın Değeri:       ${totalGoldValue.toString()} TL`)
      console.log(`   ➖ Toplam Kredi Kartı Borcu: -${totalCardDebt.toString()} TL`)
      console.log(`   ${'─'.repeat(68)}`)
      console.log(`   💎 TOPLAM VARLIK:             ${totalAssets.toString()} TL`)
      console.log(`   💵 NET DEĞERİ:                ${netWorth.toString()} TL`)
      console.log(`${'='.repeat(70)}`)

      // 6. Senkronizasyon Kontrolü
      console.log(`\n✅ Senkronizasyon Kontrolü:`)

      if (hasBalanceError) {
        console.log(`   ❌ HATA: Hesap/Kart bakiyeleri transaction'larla uyuşmuyor!`)
        console.log(`   ⚠️  Bakiyeleri yeniden hesaplamak için şunu çalıştırın:`)
        console.log(`      npx tsx scripts/recalculate-all-balances.ts`)
      } else if (transactions.length > 0) {
        console.log(`   ✅ Tüm bakiyeler transaction'larla senkronize`)
      } else {
        console.log(`   ℹ️  Transaction yok, senkronizasyon kontrolü yapılamadı`)
      }

      // 7. Portfolio API Kontrolü
      console.log(`\n📡 Portfolio API Kontrolü:`)
      console.log(`   Portföy sayfası /api/accounts endpoint'inden veri çekiyor`)
      console.log(
        `   Bu endpoint ${accounts.length} hesap, ${creditCards.length} kart, ${goldItems.length} altın döndürmeli`
      )
      console.log(`   Toplam Varlık: ${totalAssets.toString()} TL görünmeli`)
    }

    console.log(`\n\n✅ TEST TAMAMLANDI!`)
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verify()
