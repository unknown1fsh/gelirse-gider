import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🔧 Eksik verileri ekliyorum...')

    // 1. Para birimlerini ekle
    const currencies = [
      { code: 'TRY', name: 'Türk Lirası', symbol: '₺' },
      { code: 'USD', name: 'Amerikan Doları', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'İngiliz Sterlini', symbol: '£' },
      { code: 'JPY', name: 'Japon Yeni', symbol: '¥' },
      { code: 'CHF', name: 'İsviçre Frangı', symbol: 'CHF' },
      { code: 'XAU', name: 'Altın', symbol: 'Au' },
    ]

    for (const currency of currencies) {
      await prisma.refCurrency.upsert({
        where: { code: currency.code },
        update: { active: true },
        create: {
          code: currency.code,
          name: currency.name,
          symbol: currency.symbol,
          active: true,
        },
      })
    }

    // 2. Ödeme yöntemlerini ekle
    const paymentMethods = [
      { code: 'NAKIT', name: 'Nakit', description: 'Nakit ödeme' },
      { code: 'KREDI_KARTI', name: 'Kredi Kartı', description: 'Kredi kartı ile ödeme' },
      { code: 'DEBIT_KARTI', name: 'Debit Kartı', description: 'Debit kartı ile ödeme' },
      { code: 'HAVALE_EFT', name: 'Havale/EFT', description: 'Banka havalesi veya EFT' },
      { code: 'E_CUZDAN', name: 'E-Cüzdan', description: 'Elektronik cüzdan ile ödeme' },
    ]

    for (const method of paymentMethods) {
      await prisma.refPaymentMethod.upsert({
        where: { code: method.code },
        update: { active: true },
        create: {
          code: method.code,
          name: method.name,
          description: method.description,
          active: true,
        },
      })
    }

    // 3. İşlem türlerini ekle
    const txTypes = [
      { code: 'GELIR', name: 'Gelir' },
      { code: 'GIDER', name: 'Gider' },
    ]

    for (const txType of txTypes) {
      await prisma.refTransactionType.upsert({
        where: { code: txType.code },
        update: { active: true },
        create: {
          code: txType.code,
          name: txType.name,
          description: `${txType.name} işlemi`,
          active: true,
        },
      })
    }

    // 4. Gelir kategorilerini ekle
    const gelirTxType = await prisma.refTransactionType.findUnique({
      where: { code: 'GELIR' }
    })

    if (gelirTxType) {
      const gelirCategories = [
        { code: 'MAAŞ', name: 'Maaş', description: 'Aylık maaş' },
        { code: 'PRIM', name: 'Prim', description: 'Performans primi' },
        { code: 'BONUS', name: 'Bonus', description: 'Yıllık bonus' },
        { code: 'FREELANCE', name: 'Freelance', description: 'Serbest meslek geliri' },
        { code: 'YATIRIM', name: 'Yatırım', description: 'Yatırım geliri' },
        { code: 'KIRA', name: 'Kira', description: 'Kira geliri' },
        { code: 'SATIS', name: 'Satış', description: 'Mal/hizmet satışı' },
        { code: 'DIGER', name: 'Diğer', description: 'Diğer gelirler' },
      ]

      for (const category of gelirCategories) {
        await prisma.refTransactionCategory.upsert({
          where: { code: category.code },
          update: { active: true },
          create: {
            code: category.code,
            name: category.name,
            description: category.description,
            txTypeId: gelirTxType.id,
            active: true,
          },
        })
      }
    }

    // 5. Gider kategorilerini ekle
    const giderTxType = await prisma.refTransactionType.findUnique({
      where: { code: 'GIDER' }
    })

    if (giderTxType) {
      const giderCategories = [
        { code: 'YEMEK', name: 'Yemek', description: 'Yemek masrafları' },
        { code: 'ULASIM', name: 'Ulaşım', description: 'Ulaşım masrafları' },
        { code: 'KONAKLAMA', name: 'Konaklama', description: 'Konaklama masrafları' },
        { code: 'GIYIM', name: 'Giyim', description: 'Giyim masrafları' },
        { code: 'SAGLIK', name: 'Sağlık', description: 'Sağlık masrafları' },
        { code: 'EGITIM', name: 'Eğitim', description: 'Eğitim masrafları' },
        { code: 'ELEKTRIK', name: 'Elektrik', description: 'Elektrik faturası' },
        { code: 'SU', name: 'Su', description: 'Su faturası' },
        { code: 'DOGAL_GAZ', name: 'Doğal Gaz', description: 'Doğal gaz faturası' },
        { code: 'INTERNET', name: 'İnternet', description: 'İnternet faturası' },
        { code: 'TELEFON', name: 'Telefon', description: 'Telefon faturası' },
        { code: 'VERGI', name: 'Vergi', description: 'Vergi ödemeleri' },
        { code: 'SIGORTA', name: 'Sigorta', description: 'Sigorta ödemeleri' },
        { code: 'DIGER', name: 'Diğer', description: 'Diğer giderler' },
      ]

      for (const category of giderCategories) {
        await prisma.refTransactionCategory.upsert({
          where: { code: category.code },
          update: { active: true },
          create: {
            code: category.code,
            name: category.name,
            description: category.description,
            txTypeId: giderTxType.id,
            active: true,
          },
        })
      }
    }

    console.log('✅ Tüm eksik veriler eklendi!')

    return NextResponse.json({
      success: true,
      message: 'Eksik veriler başarıyla eklendi',
      added: {
        currencies: currencies.length,
        paymentMethods: paymentMethods.length,
        txTypes: txTypes.length,
        gelirCategories: 8,
        giderCategories: 14,
      }
    })

  } catch (error) {
    console.error('❌ Eksik veri ekleme hatası:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Eksik veri ekleme hatası',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
