import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed başlatılıyor...')

  // Para birimleri
  const currencies = await Promise.all([
    prisma.refCurrency.upsert({
      where: { code: 'TRY' },
      update: {},
      create: { code: 'TRY', name: 'Türk Lirası', symbol: '₺' }
    }),
    prisma.refCurrency.upsert({
      where: { code: 'USD' },
      update: {},
      create: { code: 'USD', name: 'Amerikan Doları', symbol: '$' }
    }),
    prisma.refCurrency.upsert({
      where: { code: 'EUR' },
      update: {},
      create: { code: 'EUR', name: 'Euro', symbol: '€' }
    }),
    prisma.refCurrency.upsert({
      where: { code: 'GBP' },
      update: {},
      create: { code: 'GBP', name: 'İngiliz Sterlini', symbol: '£' }
    }),
    prisma.refCurrency.upsert({
      where: { code: 'CHF' },
      update: {},
      create: { code: 'CHF', name: 'İsviçre Frangı', symbol: 'CHF' }
    }),
    prisma.refCurrency.upsert({
      where: { code: 'JPY' },
      update: {},
      create: { code: 'JPY', name: 'Japon Yeni', symbol: '¥' }
    }),
    prisma.refCurrency.upsert({
      where: { code: 'XAU' },
      update: {},
      create: { code: 'XAU', name: 'Altın', symbol: 'Au' }
    })
  ])

  console.log('✅ Para birimleri eklendi')

  // Hesap türleri
  const accountTypes = await Promise.all([
    prisma.refAccountType.upsert({
      where: { code: 'VADESIZ' },
      update: {},
      create: { code: 'VADESIZ', name: 'Vadesiz', description: 'Vadesiz mevduat hesabı' }
    }),
    prisma.refAccountType.upsert({
      where: { code: 'VADELI' },
      update: {},
      create: { code: 'VADELI', name: 'Vadeli', description: 'Vadeli mevduat hesabı' }
    }),
    prisma.refAccountType.upsert({
      where: { code: 'ALTIN' },
      update: {},
      create: { code: 'ALTIN', name: 'Altın', description: 'Altın hesabı' }
    }),
    prisma.refAccountType.upsert({
      where: { code: 'DOVIZ' },
      update: {},
      create: { code: 'DOVIZ', name: 'Döviz', description: 'Döviz hesabı' }
    })
  ])

  console.log('✅ Hesap türleri eklendi')

  // İşlem türleri
  const txTypes = await Promise.all([
    prisma.refTxType.upsert({
      where: { code: 'GELIR' },
      update: {},
      create: { code: 'GELIR', name: 'Gelir' }
    }),
    prisma.refTxType.upsert({
      where: { code: 'GIDER' },
      update: {},
      create: { code: 'GIDER', name: 'Gider' }
    })
  ])

  console.log('✅ İşlem türleri eklendi')

  // İşlem kategorileri
  const gelirCategories = await Promise.all([
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[0].id, code: 'MAAS' } },
      update: {},
      create: { 
        txTypeId: txTypes[0].id, 
        code: 'MAAS', 
        name: 'Maaş', 
        description: 'Aylık maaş geliri' 
      }
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[0].id, code: 'YEMEK_KARTI' } },
      update: {},
      create: { 
        txTypeId: txTypes[0].id, 
        code: 'YEMEK_KARTI', 
        name: 'Yemek Kartı', 
        description: 'Yemek kartı geliri' 
      }
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[0].id, code: 'EK_GELIR' } },
      update: {},
      create: { 
        txTypeId: txTypes[0].id, 
        code: 'EK_GELIR', 
        name: 'Ek Gelir', 
        description: 'Ek gelir kaynakları' 
      }
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[0].id, code: 'FAIZ_GELIRI' } },
      update: {},
      create: { 
        txTypeId: txTypes[0].id, 
        code: 'FAIZ_GELIRI', 
        name: 'Faiz Geliri', 
        description: 'Faiz gelirleri' 
      }
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[0].id, code: 'DIGER_GELIR' } },
      update: {},
      create: { 
        txTypeId: txTypes[0].id, 
        code: 'DIGER_GELIR', 
        name: 'Diğer Gelir', 
        description: 'Diğer gelir türleri' 
      }
    })
  ])

  const giderCategories = await Promise.all([
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'MARKET' } },
      update: {},
      create: { 
        txTypeId: txTypes[1].id, 
        code: 'MARKET', 
        name: 'Market', 
        description: 'Market alışverişi' 
      }
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'KIRA' } },
      update: {},
      create: { 
        txTypeId: txTypes[1].id, 
        code: 'KIRA', 
        name: 'Kira', 
        description: 'Kira ödemeleri' 
      }
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'FATURA' } },
      update: {},
      create: { 
        txTypeId: txTypes[1].id, 
        code: 'FATURA', 
        name: 'Fatura', 
        description: 'Elektrik, su, doğalgaz faturaları' 
      }
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'ULASIM' } },
      update: {},
      create: { 
        txTypeId: txTypes[1].id, 
        code: 'ULASIM', 
        name: 'Ulaşım', 
        description: 'Ulaşım giderleri' 
      }
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'SAGLIK' } },
      update: {},
      create: { 
        txTypeId: txTypes[1].id, 
        code: 'SAGLIK', 
        name: 'Sağlık', 
        description: 'Sağlık giderleri' 
      }
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'VERGI' } },
      update: {},
      create: { 
        txTypeId: txTypes[1].id, 
        code: 'VERGI', 
        name: 'Vergi', 
        description: 'Vergi ödemeleri' 
      }
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'ABONELIK' } },
      update: {},
      create: { 
        txTypeId: txTypes[1].id, 
        code: 'ABONELIK', 
        name: 'Abonelik', 
        description: 'Abonelik ödemeleri' 
      }
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'EGLENCE' } },
      update: {},
      create: { 
        txTypeId: txTypes[1].id, 
        code: 'EGLENCE', 
        name: 'Eğlence', 
        description: 'Eğlence giderleri' 
      }
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'DIGER_GIDER' } },
      update: {},
      create: { 
        txTypeId: txTypes[1].id, 
        code: 'DIGER_GIDER', 
        name: 'Diğer Gider', 
        description: 'Diğer gider türleri' 
      }
    })
  ])

  console.log('✅ İşlem kategorileri eklendi')

  // Ödeme yöntemleri
  const paymentMethods = await Promise.all([
    prisma.refPaymentMethod.upsert({
      where: { code: 'NAKIT' },
      update: {},
      create: { code: 'NAKIT', name: 'Nakit', description: 'Nakit ödeme' }
    }),
    prisma.refPaymentMethod.upsert({
      where: { code: 'HAVALE_EFT' },
      update: {},
      create: { code: 'HAVALE_EFT', name: 'Havale/EFT', description: 'Banka havalesi veya EFT' }
    }),
    prisma.refPaymentMethod.upsert({
      where: { code: 'KREDI_KARTI' },
      update: {},
      create: { code: 'KREDI_KARTI', name: 'Kredi Kartı', description: 'Kredi kartı ile ödeme' }
    }),
    prisma.refPaymentMethod.upsert({
      where: { code: 'DEBIT_KARTI' },
      update: {},
      create: { code: 'DEBIT_KARTI', name: 'Debit Kartı', description: 'Debit kartı ile ödeme' }
    }),
    prisma.refPaymentMethod.upsert({
      where: { code: 'E_CUZDAN' },
      update: {},
      create: { code: 'E_CUZDAN', name: 'E-Cüzdan', description: 'Elektronik cüzdan ile ödeme' }
    })
  ])

  console.log('✅ Ödeme yöntemleri eklendi')

  // Altın türleri
  const goldTypes = await Promise.all([
    prisma.refGoldType.upsert({
      where: { code: 'BILEZIK' },
      update: {},
      create: { code: 'BILEZIK', name: 'Bilezik', description: 'Altın bilezik' }
    }),
    prisma.refGoldType.upsert({
      where: { code: 'CUMHURIYET_ALTINI' },
      update: {},
      create: { code: 'CUMHURIYET_ALTINI', name: 'Cumhuriyet Altını', description: 'Cumhuriyet altını' }
    }),
    prisma.refGoldType.upsert({
      where: { code: 'ALTIN_BAR' },
      update: {},
      create: { code: 'ALTIN_BAR', name: 'Altın Bar', description: 'Altın külçe/bar' }
    }),
    prisma.refGoldType.upsert({
      where: { code: 'DIGER_ZIYNET' },
      update: {},
      create: { code: 'DIGER_ZIYNET', name: 'Diğer Ziynet', description: 'Diğer ziynet eşyaları' }
    })
  ])

  console.log('✅ Altın türleri eklendi')

  // Altın ayarları
  const goldPurities = await Promise.all([
    prisma.refGoldPurity.upsert({
      where: { code: '24K' },
      update: {},
      create: { code: '24K', name: '24K', purity: 24.0 }
    }),
    prisma.refGoldPurity.upsert({
      where: { code: '22K' },
      update: {},
      create: { code: '22K', name: '22K', purity: 22.0 }
    }),
    prisma.refGoldPurity.upsert({
      where: { code: '18K' },
      update: {},
      create: { code: '18K', name: '18K', purity: 18.0 }
    }),
    prisma.refGoldPurity.upsert({
      where: { code: '14K' },
      update: {},
      create: { code: '14K', name: '14K', purity: 14.0 }
    })
  ])

  console.log('✅ Altın ayarları eklendi')

  // Bankalar
  const banks = await Promise.all([
    prisma.refBank.upsert({
      where: { asciiName: 'Ziraat Bankasi' },
      update: {},
      create: { 
        name: 'Ziraat Bankası', 
        asciiName: 'Ziraat Bankasi', 
        swiftBic: 'TCZBTR2A', 
        bankCode: '0010',
        website: 'https://www.ziraatbank.com.tr'
      }
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'VakifBank' },
      update: {},
      create: { 
        name: 'VakıfBank', 
        asciiName: 'VakifBank', 
        swiftBic: 'TVBATR2A', 
        bankCode: '0015',
        website: 'https://www.vakifbank.com.tr'
      }
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Halkbank' },
      update: {},
      create: { 
        name: 'Halkbank', 
        asciiName: 'Halkbank', 
        swiftBic: 'TRHBTR2A', 
        bankCode: '0012',
        website: 'https://www.halkbank.com.tr'
      }
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Garanti BBVA' },
      update: {},
      create: { 
        name: 'Garanti BBVA', 
        asciiName: 'Garanti BBVA', 
        swiftBic: 'TGBATRIS', 
        bankCode: '0062',
        website: 'https://www.garantibbva.com.tr'
      }
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Akbank' },
      update: {},
      create: { 
        name: 'Akbank', 
        asciiName: 'Akbank', 
        swiftBic: 'AKBKTRIS', 
        bankCode: '0046',
        website: 'https://www.akbank.com'
      }
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Yapi Kredi' },
      update: {},
      create: { 
        name: 'Yapı Kredi', 
        asciiName: 'Yapi Kredi', 
        swiftBic: 'YAPITRIS', 
        bankCode: '0067',
        website: 'https://www.yapikredi.com.tr'
      }
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Is Bankasi' },
      update: {},
      create: { 
        name: 'İş Bankası', 
        asciiName: 'Is Bankasi', 
        swiftBic: 'ISBKTRIS', 
        bankCode: '0064',
        website: 'https://www.isbank.com.tr'
      }
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'QNB Finansbank' },
      update: {},
      create: { 
        name: 'QNB Finansbank', 
        asciiName: 'QNB Finansbank', 
        swiftBic: 'FNNBTRIS', 
        bankCode: '0011',
        website: 'https://www.qnbfinansbank.com'
      }
    })
  ])

  console.log('✅ Bankalar eklendi')

  // Demo veriler
  const tryCurrency = currencies.find(c => c.code === 'TRY')!
  const usdCurrency = currencies.find(c => c.code === 'USD')!
  const vadesizType = accountTypes.find(t => t.code === 'VADESIZ')!
  const dovizType = accountTypes.find(t => t.code === 'DOVIZ')!
  const ziraatBank = banks.find(b => b.name === 'Ziraat Bankası')!
  const garantiBank = banks.find(b => b.name === 'Garanti BBVA')!

  // Demo hesaplar
  const demoAccount1 = await prisma.account.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Ana Hesap',
      accountTypeId: vadesizType.id,
      bankId: ziraatBank.id,
      currencyId: tryCurrency.id,
      balance: 15000.00,
      accountNumber: '1234567890',
      iban: 'TR1234567890123456789012345'
    }
  })

  const demoAccount2 = await prisma.account.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'USD Hesabı',
      accountTypeId: dovizType.id,
      bankId: garantiBank.id,
      currencyId: usdCurrency.id,
      balance: 500.00,
      accountNumber: '9876543210',
      iban: 'TR9876543210987654321098765'
    }
  })

  console.log('✅ Demo hesaplar eklendi')

  // Demo kredi kartı
  const demoCreditCard = await prisma.creditCard.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Garanti BBVA World Card',
      bankId: garantiBank.id,
      currencyId: tryCurrency.id,
      limitAmount: 25000.00,
      availableLimit: 18000.00,
      statementDay: 15,
      dueDay: 5,
      minPaymentPercent: 3.0
    }
  })

  console.log('✅ Demo kredi kartı eklendi')

  // Demo altın eşyası
  const bilezikType = goldTypes.find(t => t.code === 'BILEZIK')!
  const purity22k = goldPurities.find(p => p.code === '22K')!

  const demoGoldItem = await prisma.goldItem.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '22K Altın Bilezik',
      goldTypeId: bilezikType.id,
      goldPurityId: purity22k.id,
      weightGrams: 25.5,
      purchasePrice: 45000.00,
      purchaseDate: new Date('2023-06-15'),
      currentValueTry: 52000.00,
      description: 'Geleneksel altın bilezik'
    }
  })

  console.log('✅ Demo altın eşyası eklendi')

  // Demo işlemler
  const maasCategory = gelirCategories.find(c => c.code === 'MAAS')!
  const marketCategory = giderCategories.find(c => c.code === 'MARKET')!
  const havaleMethod = paymentMethods.find(m => m.code === 'HAVALE_EFT')!
  const krediKartiMethod = paymentMethods.find(m => m.code === 'KREDI_KARTI')!

  await Promise.all([
    prisma.transaction.create({
      data: {
        txTypeId: txTypes[0].id, // Gelir
        categoryId: maasCategory.id,
        paymentMethodId: havaleMethod.id,
        accountId: demoAccount1.id,
        amount: 25000.00,
        currencyId: tryCurrency.id,
        transactionDate: new Date('2024-01-01'),
        description: 'Ocak ayı maaşı',
        tags: ['maaş', 'ocak']
      }
    }),
    prisma.transaction.create({
      data: {
        txTypeId: txTypes[1].id, // Gider
        categoryId: marketCategory.id,
        paymentMethodId: krediKartiMethod.id,
        creditCardId: demoCreditCard.id,
        amount: 450.00,
        currencyId: tryCurrency.id,
        transactionDate: new Date('2024-01-15'),
        description: 'Market alışverişi',
        tags: ['market', 'gıda']
      }
    }),
    prisma.transaction.create({
      data: {
        txTypeId: txTypes[0].id, // Gelir
        categoryId: gelirCategories.find(c => c.code === 'EK_GELIR')!.id,
        paymentMethodId: havaleMethod.id,
        accountId: demoAccount1.id,
        amount: 1500.00,
        currencyId: tryCurrency.id,
        transactionDate: new Date('2024-01-20'),
        description: 'Freelance proje geliri',
        tags: ['freelance', 'ek-gelir']
      }
    })
  ])

  console.log('✅ Demo işlemler eklendi')

  // Demo döviz kurları
  await Promise.all([
    prisma.fxRate.create({
      data: {
        fromCurrencyId: usdCurrency.id,
        toCurrencyId: tryCurrency.id,
        rate: 30.25,
        rateDate: new Date('2024-01-01'),
        source: 'TCMB'
      }
    }),
    prisma.fxRate.create({
      data: {
        fromCurrencyId: currencies.find(c => c.code === 'EUR')!.id,
        toCurrencyId: tryCurrency.id,
        rate: 33.15,
        rateDate: new Date('2024-01-01'),
        source: 'TCMB'
      }
    }),
    prisma.fxRate.create({
      data: {
        fromCurrencyId: currencies.find(c => c.code === 'XAU')!.id,
        toCurrencyId: tryCurrency.id,
        rate: 2040.50,
        rateDate: new Date('2024-01-01'),
        source: 'TCMB'
      }
    })
  ])

  console.log('✅ Demo döviz kurları eklendi')

  console.log('🎉 Seed tamamlandı!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

