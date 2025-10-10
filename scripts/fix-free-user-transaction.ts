import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script free kullanıcının yanlış işlemini düzeltir.
async function main() {
  console.log('🔧 FREE KULLANICI İŞLEMİ DÜZELTİLİYOR\n')

  // Free kullanıcıyı bul
  const freeUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: { contains: 'free' } }, { email: { contains: 'Free' } }],
    },
  })

  if (!freeUser) {
    console.log('❌ Free kullanıcı bulunamadı!')
    return
  }

  console.log(`👤 Kullanıcı: ${freeUser.email}`)
  console.log()

  // İşlemleri çek
  const transaction = await prisma.transaction.findFirst({
    where: { userId: freeUser.id },
    include: {
      txType: true,
      category: {
        include: {
          txType: true,
        },
      },
    },
  })

  if (!transaction) {
    console.log('ℹ️  Hiç işlem yok')
    return
  }

  console.log('📦 Mevcut işlem:')
  console.log(`   ID: ${transaction.id}`)
  console.log(`   Tarih: ${transaction.transactionDate.toISOString().split('T')[0]}`)
  console.log(`   Tip ID: ${transaction.txTypeId} (${transaction.txType.code})`)
  console.log(`   Kategori ID: ${transaction.categoryId} (${transaction.category.name})`)
  console.log(`   Kategori Tip ID: ${transaction.category.txTypeId}`)
  console.log(`   Tutar: ${Number(transaction.amount).toFixed(2)} TRY`)
  console.log()

  // Doğru Maaş kategorisini bul (GELIR tipine ait)
  const gelirTypeId = 3
  const correctMaasCategory = await prisma.refTxCategory.findFirst({
    where: {
      txTypeId: gelirTypeId,
      code: 'MAAS',
    },
  })

  if (!correctMaasCategory) {
    console.log('❌ Doğru MAAS kategorisi bulunamadı!')
    console.log('   Seed script çalıştırılıyor...\n')

    // Maaş kategorisini oluştur
    const maasCategory = await prisma.refTxCategory.create({
      data: {
        txTypeId: gelirTypeId,
        code: 'MAAS',
        name: 'Maaş',
        description: 'Aylık maaş geliri',
        icon: 'Banknote',
        color: '#10b981',
        isDefault: true,
      },
    })

    console.log(`   ✅ Maaş kategorisi oluşturuldu: ID:${maasCategory.id}`)
    console.log()

    // İşlemi güncelle
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        categoryId: maasCategory.id,
      },
    })

    console.log(
      `   ✅ İşlem güncellendi: Kategori ID:${transaction.categoryId} → ${maasCategory.id}`
    )
  } else {
    console.log(`✅ Doğru MAAS kategorisi bulundu: ID:${correctMaasCategory.id}`)

    if (transaction.categoryId !== correctMaasCategory.id) {
      console.log(
        `   🔄 İşlem kategorisi güncelleniyor: ${transaction.categoryId} → ${correctMaasCategory.id}`
      )

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          categoryId: correctMaasCategory.id,
        },
      })

      console.log(`   ✅ Güncellendi`)
    } else {
      console.log(`   ℹ️  İşlem zaten doğru kategoriyi kullanıyor`)
    }
  }

  console.log()

  // Final durumu göster
  const updatedTransaction = await prisma.transaction.findUnique({
    where: { id: transaction.id },
    include: {
      txType: true,
      category: {
        include: {
          txType: true,
        },
      },
    },
  })

  if (updatedTransaction) {
    console.log('✅ DÜZELTİLMİŞ İŞLEM:')
    const icon = updatedTransaction.txType.code === 'GELIR' ? '🟢' : '🔴'
    console.log(
      `   ${icon} ${updatedTransaction.transactionDate.toISOString().split('T')[0]} | ` +
        `Tip: ${updatedTransaction.txType.name} (${updatedTransaction.txType.code}) | ` +
        `Kategori: ${updatedTransaction.category.name} | ` +
        `${Number(updatedTransaction.amount).toFixed(2)} TRY`
    )
    console.log()
    console.log(`   Kategori Tipi: ${updatedTransaction.category.txType.name}`)
    console.log(
      `   Uyumlu: ${updatedTransaction.category.txTypeId === updatedTransaction.txTypeId ? '✅ EVET' : '❌ HAYIR'}`
    )
    console.log()

    const totalGelir =
      updatedTransaction.txType.code === 'GELIR' ? Number(updatedTransaction.amount) : 0
    const totalGider =
      updatedTransaction.txType.code === 'GIDER' ? Number(updatedTransaction.amount) : 0

    console.log('📊 BEKLENEN DASHBOARD DURUMU:')
    console.log(`   🟢 GELIR: ${totalGelir.toFixed(2)} TRY`)
    console.log(`   🔴 GIDER: ${totalGider.toFixed(2)} TRY`)
    console.log(`   💰 NET: +${(totalGelir - totalGider).toFixed(2)} TRY`)
    console.log()
  }

  console.log('🎉 İŞLEM DÜZELTİLDİ!\n')
  console.log("🔄 Dashboard'ı yenileyin ve kontrol edin.\n")
}

main()
  .catch(e => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
