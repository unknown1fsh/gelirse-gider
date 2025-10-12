import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed başlatılıyor...')

  // Para birimleri
  const currencies = await Promise.all([
    prisma.refCurrency.upsert({
      where: { code: 'TRY' },
      update: {},
      create: { code: 'TRY', name: 'Türk Lirası', symbol: '₺' },
    }),
    prisma.refCurrency.upsert({
      where: { code: 'USD' },
      update: {},
      create: { code: 'USD', name: 'Amerikan Doları', symbol: '$' },
    }),
    prisma.refCurrency.upsert({
      where: { code: 'EUR' },
      update: {},
      create: { code: 'EUR', name: 'Euro', symbol: '€' },
    }),
    prisma.refCurrency.upsert({
      where: { code: 'GBP' },
      update: {},
      create: { code: 'GBP', name: 'İngiliz Sterlini', symbol: '£' },
    }),
    prisma.refCurrency.upsert({
      where: { code: 'CHF' },
      update: {},
      create: { code: 'CHF', name: 'İsviçre Frangı', symbol: 'CHF' },
    }),
    prisma.refCurrency.upsert({
      where: { code: 'JPY' },
      update: {},
      create: { code: 'JPY', name: 'Japon Yeni', symbol: '¥' },
    }),
    prisma.refCurrency.upsert({
      where: { code: 'XAU' },
      update: {},
      create: { code: 'XAU', name: 'Altın', symbol: 'Au' },
    }),
  ])

  console.log('✅ Para birimleri eklendi')

  // Hesap türleri
  const accountTypes = await Promise.all([
    prisma.refAccountType.upsert({
      where: { code: 'VADESIZ' },
      update: {},
      create: { code: 'VADESIZ', name: 'Vadesiz', description: 'Vadesiz mevduat hesabı' },
    }),
    prisma.refAccountType.upsert({
      where: { code: 'VADELI' },
      update: {},
      create: { code: 'VADELI', name: 'Vadeli', description: 'Vadeli mevduat hesabı' },
    }),
    prisma.refAccountType.upsert({
      where: { code: 'ALTIN' },
      update: {},
      create: { code: 'ALTIN', name: 'Altın', description: 'Altın hesabı' },
    }),
    prisma.refAccountType.upsert({
      where: { code: 'DOVIZ' },
      update: {},
      create: { code: 'DOVIZ', name: 'Döviz', description: 'Döviz hesabı' },
    }),
  ])

  console.log('✅ Hesap türleri eklendi')

  // İşlem türleri
  const txTypes = await Promise.all([
    prisma.refTxType.upsert({
      where: { code: 'GELIR' },
      update: { icon: 'TrendingUp', color: '#10b981' },
      create: { code: 'GELIR', name: 'Gelir', icon: 'TrendingUp', color: '#10b981' },
    }),
    prisma.refTxType.upsert({
      where: { code: 'GIDER' },
      update: { icon: 'TrendingDown', color: '#ef4444' },
      create: { code: 'GIDER', name: 'Gider', icon: 'TrendingDown', color: '#ef4444' },
    }),
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
        description: 'Aylık maaş geliri',
      },
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[0].id, code: 'YEMEK_KARTI' } },
      update: {},
      create: {
        txTypeId: txTypes[0].id,
        code: 'YEMEK_KARTI',
        name: 'Yemek Kartı',
        description: 'Yemek kartı geliri',
      },
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[0].id, code: 'EK_GELIR' } },
      update: {},
      create: {
        txTypeId: txTypes[0].id,
        code: 'EK_GELIR',
        name: 'Ek Gelir',
        description: 'Ek gelir kaynakları',
      },
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[0].id, code: 'FAIZ_GELIRI' } },
      update: {},
      create: {
        txTypeId: txTypes[0].id,
        code: 'FAIZ_GELIRI',
        name: 'Faiz Geliri',
        description: 'Faiz gelirleri',
      },
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[0].id, code: 'DIGER_GELIR' } },
      update: {},
      create: {
        txTypeId: txTypes[0].id,
        code: 'DIGER_GELIR',
        name: 'Diğer Gelir',
        description: 'Diğer gelir türleri',
      },
    }),
  ])

  const giderCategories = await Promise.all([
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'MARKET' } },
      update: {},
      create: {
        txTypeId: txTypes[1].id,
        code: 'MARKET',
        name: 'Market',
        description: 'Market alışverişi',
      },
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'KIRA' } },
      update: {},
      create: {
        txTypeId: txTypes[1].id,
        code: 'KIRA',
        name: 'Kira',
        description: 'Kira ödemeleri',
      },
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'FATURA' } },
      update: {},
      create: {
        txTypeId: txTypes[1].id,
        code: 'FATURA',
        name: 'Fatura',
        description: 'Elektrik, su, doğalgaz faturaları',
      },
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'ULASIM' } },
      update: {},
      create: {
        txTypeId: txTypes[1].id,
        code: 'ULASIM',
        name: 'Ulaşım',
        description: 'Ulaşım giderleri',
      },
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'SAGLIK' } },
      update: {},
      create: {
        txTypeId: txTypes[1].id,
        code: 'SAGLIK',
        name: 'Sağlık',
        description: 'Sağlık giderleri',
      },
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'VERGI' } },
      update: {},
      create: {
        txTypeId: txTypes[1].id,
        code: 'VERGI',
        name: 'Vergi',
        description: 'Vergi ödemeleri',
      },
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'ABONELIK' } },
      update: {},
      create: {
        txTypeId: txTypes[1].id,
        code: 'ABONELIK',
        name: 'Abonelik',
        description: 'Abonelik ödemeleri',
      },
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'EGLENCE' } },
      update: {},
      create: {
        txTypeId: txTypes[1].id,
        code: 'EGLENCE',
        name: 'Eğlence',
        description: 'Eğlence giderleri',
      },
    }),
    prisma.refTxCategory.upsert({
      where: { txTypeId_code: { txTypeId: txTypes[1].id, code: 'DIGER_GIDER' } },
      update: {},
      create: {
        txTypeId: txTypes[1].id,
        code: 'DIGER_GIDER',
        name: 'Diğer Gider',
        description: 'Diğer gider türleri',
      },
    }),
  ])

  console.log('✅ İşlem kategorileri eklendi')

  // Ödeme yöntemleri
  const paymentMethods = await Promise.all([
    prisma.refPaymentMethod.upsert({
      where: { code: 'NAKIT' },
      update: {},
      create: { code: 'NAKIT', name: 'Nakit', description: 'Nakit ödeme' },
    }),
    prisma.refPaymentMethod.upsert({
      where: { code: 'HAVALE_EFT' },
      update: {},
      create: { code: 'HAVALE_EFT', name: 'Havale/EFT', description: 'Banka havalesi veya EFT' },
    }),
    prisma.refPaymentMethod.upsert({
      where: { code: 'KREDI_KARTI' },
      update: {},
      create: { code: 'KREDI_KARTI', name: 'Kredi Kartı', description: 'Kredi kartı ile ödeme' },
    }),
    prisma.refPaymentMethod.upsert({
      where: { code: 'DEBIT_KARTI' },
      update: {},
      create: { code: 'DEBIT_KARTI', name: 'Debit Kartı', description: 'Debit kartı ile ödeme' },
    }),
    prisma.refPaymentMethod.upsert({
      where: { code: 'E_CUZDAN' },
      update: {},
      create: { code: 'E_CUZDAN', name: 'E-Cüzdan', description: 'Elektronik cüzdan ile ödeme' },
    }),
  ])

  console.log('✅ Ödeme yöntemleri eklendi')

  // Altın türleri - Türkiye'de yaygın altın ve ziynet eşyaları
  const goldTypes = await Promise.all([
    // Takılar
    prisma.refGoldType.upsert({
      where: { code: 'BILEZIK' },
      update: {},
      create: { code: 'BILEZIK', name: 'Bilezik', description: 'Altın bilezik' },
    }),
    prisma.refGoldType.upsert({
      where: { code: 'KOLYE' },
      update: {},
      create: { code: 'KOLYE', name: 'Kolye', description: 'Altın kolye' },
    }),
    prisma.refGoldType.upsert({
      where: { code: 'KUPE' },
      update: {},
      create: { code: 'KUPE', name: 'Küpe', description: 'Altın küpe' },
    }),
    prisma.refGoldType.upsert({
      where: { code: 'YUZUK' },
      update: {},
      create: { code: 'YUZUK', name: 'Yüzük', description: 'Altın yüzük' },
    }),
    prisma.refGoldType.upsert({
      where: { code: 'IMAM_NIKAHLI' },
      update: {},
      create: { code: 'IMAM_NIKAHLI', name: 'İmam Nikahlı', description: 'İmam nikahlı bilezik' },
    }),
    prisma.refGoldType.upsert({
      where: { code: 'SET_TAKIM' },
      update: {},
      create: { code: 'SET_TAKIM', name: 'Set/Takım', description: 'Altın set veya takım' },
    }),

    // Altın paralar
    prisma.refGoldType.upsert({
      where: { code: 'CUMHURIYET_ALTINI' },
      update: {},
      create: {
        code: 'CUMHURIYET_ALTINI',
        name: 'Cumhuriyet Altını',
        description: 'Tam Cumhuriyet altını (7.2 gr)',
      },
    }),
    prisma.refGoldType.upsert({
      where: { code: 'YARIM_ALTIN' },
      update: {},
      create: {
        code: 'YARIM_ALTIN',
        name: 'Yarım Altın',
        description: 'Yarım Cumhuriyet altını (3.6 gr)',
      },
    }),
    prisma.refGoldType.upsert({
      where: { code: 'CEYREK_ALTIN' },
      update: {},
      create: {
        code: 'CEYREK_ALTIN',
        name: 'Çeyrek Altın',
        description: 'Çeyrek Cumhuriyet altını (1.8 gr)',
      },
    }),
    prisma.refGoldType.upsert({
      where: { code: 'RESAT_ALTINI' },
      update: {},
      create: { code: 'RESAT_ALTINI', name: 'Reşat Altını', description: 'Reşat altını' },
    }),
    prisma.refGoldType.upsert({
      where: { code: 'HAMIT_ALTINI' },
      update: {},
      create: { code: 'HAMIT_ALTINI', name: 'Hamit Altını', description: 'Hamit altını' },
    }),

    // Külçe ve bar
    prisma.refGoldType.upsert({
      where: { code: 'ALTIN_BAR' },
      update: {},
      create: { code: 'ALTIN_BAR', name: 'Altın Bar/Külçe', description: 'Altın külçe veya bar' },
    }),

    // Diğer
    prisma.refGoldType.upsert({
      where: { code: 'DIGER_ZIYNET' },
      update: {},
      create: {
        code: 'DIGER_ZIYNET',
        name: 'Diğer Ziynet',
        description: 'Diğer ziynet eşyaları',
      },
    }),
  ])

  console.log('✅ Altın türleri eklendi (13 tür)')

  // Altın ayarları - Türkiye'de kullanılan ayarlar
  const goldPurities = await Promise.all([
    prisma.refGoldPurity.upsert({
      where: { code: '24K' },
      update: {},
      create: {
        code: '24K',
        name: '24 Ayar Altın',
        purity: 24.0,
      },
    }),
    prisma.refGoldPurity.upsert({
      where: { code: '22K' },
      update: {},
      create: {
        code: '22K',
        name: '22 Ayar Altın',
        purity: 22.0,
      },
    }),
    prisma.refGoldPurity.upsert({
      where: { code: '18K' },
      update: {},
      create: {
        code: '18K',
        name: '18 Ayar Altın',
        purity: 18.0,
      },
    }),
    prisma.refGoldPurity.upsert({
      where: { code: '14K' },
      update: {},
      create: {
        code: '14K',
        name: '14 Ayar Altın',
        purity: 14.0,
      },
    }),
    prisma.refGoldPurity.upsert({
      where: { code: '8K' },
      update: {},
      create: {
        code: '8K',
        name: '8 Ayar Altın',
        purity: 8.0,
      },
    }),
  ])

  console.log('✅ Altın ayarları eklendi (5 ayar)')

  // Bankalar - Türkiye'de Aktif Çalışan Bankalar (2025)
  const banks = await Promise.all([
    // Kamu Bankaları
    prisma.refBank.upsert({
      where: { asciiName: 'Ziraat Bankasi' },
      update: {},
      create: {
        name: 'Ziraat Bankası',
        asciiName: 'Ziraat Bankasi',
        swiftBic: 'TCZBTR2A',
        bankCode: '0010',
        website: 'https://www.ziraatbank.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Halkbank' },
      update: {},
      create: {
        name: 'Halkbank',
        asciiName: 'Halkbank',
        swiftBic: 'TRHBTR2A',
        bankCode: '0012',
        website: 'https://www.halkbank.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'VakifBank' },
      update: {},
      create: {
        name: 'VakıfBank',
        asciiName: 'VakifBank',
        swiftBic: 'TVBATR2A',
        bankCode: '0015',
        website: 'https://www.vakifbank.com.tr',
      },
    }),

    // Özel Bankalar
    prisma.refBank.upsert({
      where: { asciiName: 'Akbank' },
      update: {},
      create: {
        name: 'Akbank',
        asciiName: 'Akbank',
        swiftBic: 'AKBKTRIS',
        bankCode: '0046',
        website: 'https://www.akbank.com',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Garanti BBVA' },
      update: {},
      create: {
        name: 'Garanti BBVA',
        asciiName: 'Garanti BBVA',
        swiftBic: 'TGBATRIS',
        bankCode: '0062',
        website: 'https://www.garantibbva.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Is Bankasi' },
      update: {},
      create: {
        name: 'İş Bankası',
        asciiName: 'Is Bankasi',
        swiftBic: 'ISBKTRIS',
        bankCode: '0064',
        website: 'https://www.isbank.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Yapi Kredi' },
      update: {},
      create: {
        name: 'Yapı Kredi',
        asciiName: 'Yapi Kredi',
        swiftBic: 'YAPITRIS',
        bankCode: '0067',
        website: 'https://www.yapikredi.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Denizbank' },
      update: {},
      create: {
        name: 'Denizbank',
        asciiName: 'Denizbank',
        swiftBic: 'DENIZTR3',
        bankCode: '0134',
        website: 'https://www.denizbank.com',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'QNB Finansbank' },
      update: {},
      create: {
        name: 'QNB Finansbank',
        asciiName: 'QNB Finansbank',
        swiftBic: 'FNNBTRIS',
        bankCode: '0111',
        website: 'https://www.qnbfinansbank.com',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'TEB' },
      update: {},
      create: {
        name: 'TEB (Türk Ekonomi Bankası)',
        asciiName: 'TEB',
        swiftBic: 'TEBUTRIS',
        bankCode: '0032',
        website: 'https://www.teb.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Sekerbank' },
      update: {},
      create: {
        name: 'Şekerbank',
        asciiName: 'Sekerbank',
        swiftBic: 'TEBUTRIS',
        bankCode: '0059',
        website: 'https://www.sekerbank.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Alternatifbank' },
      update: {},
      create: {
        name: 'Alternatifbank',
        asciiName: 'Alternatifbank',
        swiftBic: 'ALTRTR00',
        bankCode: '0124',
        website: 'https://www.alternatifbank.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Odeabank' },
      update: {},
      create: {
        name: 'Odeabank',
        asciiName: 'Odeabank',
        swiftBic: 'ODNBTR2A',
        bankCode: '0146',
        website: 'https://www.odeabank.com.tr',
      },
    }),

    // Yabancı Bankalar
    prisma.refBank.upsert({
      where: { asciiName: 'ING' },
      update: {},
      create: {
        name: 'ING Bank',
        asciiName: 'ING',
        swiftBic: 'INGBTRIS',
        bankCode: '0099',
        website: 'https://www.ing.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'HSBC' },
      update: {},
      create: {
        name: 'HSBC Bank',
        asciiName: 'HSBC',
        swiftBic: 'HSBCTRIS',
        bankCode: '0123',
        website: 'https://www.hsbc.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Citibank' },
      update: {},
      create: {
        name: 'Citibank',
        asciiName: 'Citibank',
        swiftBic: 'CTFHTRIS',
        bankCode: '0092',
        website: 'https://www.citibank.com.tr',
      },
    }),

    // Katılım Bankaları
    prisma.refBank.upsert({
      where: { asciiName: 'Kuveyt Turk' },
      update: {},
      create: {
        name: 'Kuveyt Türk Katılım Bankası',
        asciiName: 'Kuveyt Turk',
        swiftBic: 'KTEFTRIS',
        bankCode: '0205',
        website: 'https://www.kuveytturk.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Albaraka Turk' },
      update: {},
      create: {
        name: 'Albaraka Türk Katılım Bankası',
        asciiName: 'Albaraka Turk',
        swiftBic: 'BTKATRIS',
        bankCode: '0203',
        website: 'https://www.albaraka.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Turkiye Finans' },
      update: {},
      create: {
        name: 'Türkiye Finans Katılım Bankası',
        asciiName: 'Turkiye Finans',
        swiftBic: 'FBITTR2X',
        bankCode: '0206',
        website: 'https://www.turkiyefinans.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Ziraat Katilim' },
      update: {},
      create: {
        name: 'Ziraat Katılım Bankası',
        asciiName: 'Ziraat Katilim',
        swiftBic: 'TVZITRIS',
        bankCode: '0209',
        website: 'https://www.ziraatkatilim.com.tr',
      },
    }),
    prisma.refBank.upsert({
      where: { asciiName: 'Vakif Katilim' },
      update: {},
      create: {
        name: 'Vakıf Katılım Bankası',
        asciiName: 'Vakif Katilim',
        swiftBic: 'TVKBTRIS',
        bankCode: '0210',
        website: 'https://www.vakifkatilim.com.tr',
      },
    }),
  ])

  console.log('✅ Bankalar eklendi (21 banka)')

  // Sistem Parametreleri - Referans tabloları SystemParameter'a migrate et
  console.log('\n🔄 Sistem parametreleri oluşturuluyor...')

  // BANK parametreleri
  for (const bank of banks) {
    await prisma.systemParameter.upsert({
      where: {
        paramGroup_paramCode: {
          paramGroup: 'BANK',
          paramCode: bank.asciiName.toUpperCase().replace(/\s+/g, '_'),
        },
      },
      update: {},
      create: {
        paramGroup: 'BANK',
        paramCode: bank.asciiName.toUpperCase().replace(/\s+/g, '_'),
        paramValue: bank.name,
        displayName: bank.name,
        description: `${bank.name} - SWIFT: ${bank.swiftBic || 'N/A'}`,
        displayOrder: banks.indexOf(bank) + 1,
        metadata: {
          swiftBic: bank.swiftBic,
          bankCode: bank.bankCode,
          website: bank.website,
          asciiName: bank.asciiName,
        },
        isActive: bank.active,
      },
    })
  }
  console.log(`✅ BANK parametreleri eklendi (${banks.length} banka)`)

  // ACCOUNT_TYPE parametreleri
  for (const accType of accountTypes) {
    await prisma.systemParameter.upsert({
      where: {
        paramGroup_paramCode: {
          paramGroup: 'ACCOUNT_TYPE',
          paramCode: accType.code,
        },
      },
      update: {},
      create: {
        paramGroup: 'ACCOUNT_TYPE',
        paramCode: accType.code,
        paramValue: accType.name,
        displayName: accType.name,
        description: accType.description,
        displayOrder: accountTypes.indexOf(accType) + 1,
        metadata: {},
        isActive: accType.active,
      },
    })
  }
  console.log(`✅ ACCOUNT_TYPE parametreleri eklendi (${accountTypes.length} tür)`)

  // GOLD_TYPE parametreleri
  for (const goldType of goldTypes) {
    await prisma.systemParameter.upsert({
      where: {
        paramGroup_paramCode: {
          paramGroup: 'GOLD_TYPE',
          paramCode: goldType.code,
        },
      },
      update: {},
      create: {
        paramGroup: 'GOLD_TYPE',
        paramCode: goldType.code,
        paramValue: goldType.name,
        displayName: goldType.name,
        description: goldType.description,
        displayOrder: goldTypes.indexOf(goldType) + 1,
        metadata: {},
        isActive: goldType.active,
      },
    })
  }
  console.log(`✅ GOLD_TYPE parametreleri eklendi (${goldTypes.length} tür)`)

  // GOLD_PURITY parametreleri
  for (const purity of goldPurities) {
    await prisma.systemParameter.upsert({
      where: {
        paramGroup_paramCode: {
          paramGroup: 'GOLD_PURITY',
          paramCode: purity.code,
        },
      },
      update: {},
      create: {
        paramGroup: 'GOLD_PURITY',
        paramCode: purity.code,
        paramValue: purity.name,
        displayName: purity.name,
        description: `${purity.name} - ${purity.purity} ayar`,
        displayOrder: goldPurities.indexOf(purity) + 1,
        metadata: {
          purity: purity.purity.toString(),
          code: purity.code,
        },
        isActive: purity.active,
      },
    })
  }
  console.log(`✅ GOLD_PURITY parametreleri eklendi (${goldPurities.length} ayar)`)

  // TX_TYPE parametreleri
  for (const txType of txTypes) {
    await prisma.systemParameter.upsert({
      where: {
        paramGroup_paramCode: {
          paramGroup: 'TX_TYPE',
          paramCode: txType.code,
        },
      },
      update: {},
      create: {
        paramGroup: 'TX_TYPE',
        paramCode: txType.code,
        paramValue: txType.name,
        displayName: txType.name,
        description: `${txType.name} işlemleri`,
        displayOrder: txTypes.indexOf(txType) + 1,
        metadata: {
          icon: txType.icon,
          color: txType.color,
        },
        isActive: txType.active,
      },
    })
  }
  console.log(`✅ TX_TYPE parametreleri eklendi (${txTypes.length} tür)`)

  // TX_CATEGORY parametreleri
  const categories = await prisma.transactionCategory.findMany()
  for (const category of categories) {
    await prisma.systemParameter.upsert({
      where: {
        paramGroup_paramCode: {
          paramGroup: 'TX_CATEGORY',
          paramCode: `${category.code}_${category.txTypeId}`,
        },
      },
      update: {},
      create: {
        paramGroup: 'TX_CATEGORY',
        paramCode: `${category.code}_${category.txTypeId}`,
        paramValue: category.name,
        displayName: category.name,
        description: category.description,
        displayOrder: categories.indexOf(category) + 1,
        metadata: {
          txTypeId: category.txTypeId,
          icon: category.icon,
          color: category.color,
          isDefault: category.isDefault,
        },
        isActive: category.active,
      },
    })
  }
  console.log(`✅ TX_CATEGORY parametreleri eklendi (${categories.length} kategori)`)

  // PAYMENT_METHOD parametreleri
  for (const method of paymentMethods) {
    await prisma.systemParameter.upsert({
      where: {
        paramGroup_paramCode: {
          paramGroup: 'PAYMENT_METHOD',
          paramCode: method.code,
        },
      },
      update: {},
      create: {
        paramGroup: 'PAYMENT_METHOD',
        paramCode: method.code,
        paramValue: method.name,
        displayName: method.name,
        description: method.description,
        displayOrder: paymentMethods.indexOf(method) + 1,
        metadata: {},
        isActive: method.active,
      },
    })
  }
  console.log(`✅ PAYMENT_METHOD parametreleri eklendi (${paymentMethods.length} yöntem)`)

  // CURRENCY parametreleri
  for (const currency of currencies) {
    await prisma.systemParameter.upsert({
      where: {
        paramGroup_paramCode: {
          paramGroup: 'CURRENCY',
          paramCode: currency.code,
        },
      },
      update: {},
      create: {
        paramGroup: 'CURRENCY',
        paramCode: currency.code,
        paramValue: currency.name,
        displayName: `${currency.name} (${currency.symbol})`,
        description: `${currency.name} - ${currency.code}`,
        displayOrder: currencies.indexOf(currency) + 1,
        metadata: {
          symbol: currency.symbol,
          code: currency.code,
        },
        isActive: currency.active,
      },
    })
  }
  console.log(`✅ CURRENCY parametreleri eklendi (${currencies.length} para birimi)`)

  console.log('\n🎉 Tüm sistem parametreleri eklendi!\n')

  // Demo veriler
  const tryCurrency = currencies.find(c => c.code === 'TRY')!
  const usdCurrency = currencies.find(c => c.code === 'USD')!
  const vadesizType = accountTypes.find(t => t.code === 'VADESIZ')!
  const dovizType = accountTypes.find(t => t.code === 'DOVIZ')!
  const ziraatBank = banks.find(b => b.name === 'Ziraat Bankası')!
  const garantiBank = banks.find(b => b.name === 'Garanti BBVA')!

  // Demo hesaplar (sadece reference data için, user-specific değil)
  console.log('✅ Demo hesaplar atlandı (user-specific olacak)')

  console.log('✅ Demo hesaplar eklendi')

  // Demo kredi kartı (sadece reference data için, user-specific değil)
  console.log('✅ Demo kredi kartları atlandı (user-specific olacak)')

  // Demo altın eşyası (sadece reference data için, user-specific değil)
  console.log('✅ Demo altın eşyaları atlandı (user-specific olacak)')

  // Demo işlemler
  const maasCategory = gelirCategories.find(c => c.code === 'MAAS')!
  const marketCategory = giderCategories.find(c => c.code === 'MARKET')!
  const havaleMethod = paymentMethods.find(m => m.code === 'HAVALE_EFT')!
  const krediKartiMethod = paymentMethods.find(m => m.code === 'KREDI_KARTI')!

  // Demo işlemler (sadece reference data için, user-specific değil)
  console.log('✅ Demo işlemler atlandı (user-specific olacak)')

  // Demo döviz kurları
  await Promise.all([
    prisma.fxRate.create({
      data: {
        fromCurrencyId: usdCurrency.id,
        toCurrencyId: tryCurrency.id,
        rate: 30.25,
        rateDate: new Date('2024-01-01'),
        source: 'TCMB',
      },
    }),
    prisma.fxRate.create({
      data: {
        fromCurrencyId: currencies.find(c => c.code === 'EUR')!.id,
        toCurrencyId: tryCurrency.id,
        rate: 33.15,
        rateDate: new Date('2024-01-01'),
        source: 'TCMB',
      },
    }),
    prisma.fxRate.create({
      data: {
        fromCurrencyId: currencies.find(c => c.code === 'XAU')!.id,
        toCurrencyId: tryCurrency.id,
        rate: 2040.5,
        rateDate: new Date('2024-01-01'),
        source: 'TCMB',
      },
    }),
  ])

  console.log('✅ Demo döviz kurları eklendi')

  console.log('🎉 Seed tamamlandı!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
