import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ExceptionMapper } from '@/server/errors'
import { getCurrentUser } from '@/lib/auth-refactored'
import { SystemParameterService } from '@/server/services/impl/SystemParameterService'

// Bu endpoint tüm referans verilerini getirir
// TX_TYPE ve TX_CATEGORY: SystemParameter'dan
// BANK, ACCOUNT_TYPE, CURRENCY, GOLD: Eski Ref tablolarından (Foreign Key uyumu için)
export const GET = ExceptionMapper.asyncHandler(async (request: NextRequest) => {
  // Kullanıcı kontrolü (opsiyonel - bazı referans veriler public olabilir)
  const user = await getCurrentUser(request)

  // eslint-disable-next-line no-console
  console.log('🔍 Reference data çekiliyor...')

  const parameterService = new SystemParameterService(prisma)

  // TRANSACTION parametreleri için SystemParameter kullan (Frontend UI)
  // ACCOUNT/GOLD parametreleri için Ref tabloları (Foreign Key uyumu)
  const [
    txTypeParams,
    txCategoryParams,
    paymentMethodParams,
    currencyParams,
    refBanks,
    refAccountTypes,
    refGoldTypes,
    refGoldPurities,
  ] = await Promise.all([
    // Transaction için: SystemParameter (Backend'de mapping yapılacak)
    parameterService.getByGroup('TX_TYPE'),
    parameterService.getByGroup('TX_CATEGORY'),
    parameterService.getByGroup('PAYMENT_METHOD'),
    parameterService.getByGroup('CURRENCY'),
    // Account/Gold için: Ref tabloları (Foreign Key direkt uyumlu)
    prisma.refBank.findMany({ where: { active: true }, orderBy: { name: 'asc' } }),
    prisma.refAccountType.findMany({ where: { active: true }, orderBy: { code: 'asc' } }),
    prisma.refGoldType.findMany({ where: { active: true }, orderBy: { name: 'asc' } }),
    prisma.refGoldPurity.findMany({ where: { active: true }, orderBy: { code: 'asc' } }),
  ])

  // eslint-disable-next-line no-console
  console.log('📊 SystemParameter veriler:', {
    txTypes: txTypeParams.length,
    categories: txCategoryParams.length,
    paymentMethods: paymentMethodParams.length,
    currencies: currencyParams.length,
  })

  // Kullanıcıya özel veriler (sadece login olmuşsa)
  const [accounts, creditCards, eWallets, beneficiaries] = await Promise.all([
    user
      ? prisma.account.findMany({
          include: { bank: true, currency: true, accountType: true },
          where: { userId: user.id, active: true },
          orderBy: { name: 'asc' },
        })
      : Promise.resolve([]),
    user
      ? prisma.creditCard.findMany({
          include: { bank: true, currency: true },
          where: { userId: user.id, active: true },
          orderBy: { name: 'asc' },
        })
      : Promise.resolve([]),
    user
      ? prisma.eWallet.findMany({
          include: { currency: true },
          where: { userId: user.id, active: true },
          orderBy: { name: 'asc' },
        })
      : Promise.resolve([]),
    user
      ? prisma.beneficiary.findMany({
          include: { bank: true },
          where: { userId: user.id, active: true },
          orderBy: { name: 'asc' },
        })
      : Promise.resolve([]),
  ])

  // TX_TYPE ID mapping oluştur (SystemParameter ID <-> Code)
  const txTypeMapping: Record<string, number> = {}
  txTypeParams.forEach(t => {
    txTypeMapping[t.paramCode] = t.id // GELIR -> 44, GIDER -> 45
  })

  const response = {
    // İşlem parametreleri (PARAMETRE TABLOSUNDAN - Sadece TX_TYPE ve TX_CATEGORY)
    txTypes: txTypeParams.map(t => ({
      id: t.id,
      code: t.paramCode,
      name: t.displayName,
      icon: (t.metadata?.icon as string | null | undefined) || null,
      color: (t.metadata?.color as string | null | undefined) || null,
    })),
    categories: txCategoryParams.map(c => {
      // txTypeCode ile SystemParameter TX_TYPE ID'sine map et
      const txTypeCode = (c.metadata?.txTypeCode as string | undefined) || ''
      const mappedTxTypeId = (txTypeMapping[txTypeCode] as number | undefined) || 0

      return {
        id: c.id,
        name: c.displayName,
        code: (c.metadata?.code as string | undefined) || c.paramCode,
        txTypeId: mappedTxTypeId, // SystemParameter TX_TYPE ID'si
        txTypeName: (c.metadata?.txTypeName as string | undefined) || '',
        icon: (c.metadata?.icon as string | null | undefined) || null,
        color: (c.metadata?.color as string | null | undefined) || null,
        isDefault: (c.metadata?.isDefault as boolean | undefined) || false,
      }
    }),
    paymentMethods: paymentMethodParams.map(p => ({
      id: p.id,
      code: p.paramCode,
      name: p.displayName,
      description: p.description,
    })),

    // ESKİ REF TABLOLARINDAN (Foreign Key uyumu için)
    // Account, CreditCard, GoldItem tabloları bunlara bağlı
    banks: refBanks.map(b => ({
      id: b.id,
      name: b.name,
      asciiName: b.asciiName,
      swiftBic: b.swiftBic,
      bankCode: b.bankCode,
      website: b.website,
    })),
    accountTypes: refAccountTypes.map(a => ({
      id: a.id,
      code: a.code,
      name: a.name,
      description: a.description,
    })),
    currencies: currencyParams.map(c => ({
      id: c.id,
      code: c.paramCode,
      name: c.displayName.split('(')[0].trim(),
      symbol: (c.metadata?.symbol as string | undefined) || c.paramCode,
    })),
    goldTypes: refGoldTypes.map(g => ({
      id: g.id,
      code: g.code,
      name: g.name,
      description: g.description,
    })),
    goldPurities: refGoldPurities.map(g => ({
      id: g.id,
      code: g.code,
      name: g.name,
      purity: g.purity,
    })),

    // Kullanıcıya özel veriler
    accounts: accounts.map(a => ({
      id: a.id,
      name: a.name,
      accountType: a.accountType ? { id: a.accountType.id, name: a.accountType.name } : null,
      bank: { id: a.bank.id, name: a.bank.name },
      currency: { id: a.currency.id, code: a.currency.code, name: a.currency.name },
    })),
    creditCards: creditCards.map(c => ({
      id: c.id,
      name: c.name,
      bank: { id: c.bank.id, name: c.bank.name },
      currency: { id: c.currency.id, code: c.currency.code, name: c.currency.name },
    })),
    eWallets: eWallets.map(e => ({
      id: e.id,
      name: e.name,
      provider: e.provider,
      balance: e.balance,
      currency: { id: e.currency.id, code: e.currency.code, name: e.currency.name },
    })),
    beneficiaries: beneficiaries.map(b => ({
      id: b.id,
      name: b.name,
      iban: b.iban,
      accountNo: b.accountNo,
      bank: b.bank ? { id: b.bank.id, name: b.bank.name } : null,
      phoneNumber: b.phoneNumber,
      email: b.email,
    })),

    // Meta bilgi
    _meta: {
      source: 'Mixed (TX/Payment/Currency: SystemParameter, Account/Gold: RefTables)',
      totalBanks: refBanks.length,
      totalGoldTypes: refGoldTypes.length,
      totalGoldPurities: refGoldPurities.length,
      totalCategories: txCategoryParams.length,
      totalPaymentMethods: paymentMethodParams.length,
      totalCurrencies: currencyParams.length,
      timestamp: new Date().toISOString(),
    },
  }

  // eslint-disable-next-line no-console
  console.log('✅ Reference data hazırlandı:', {
    txTypes: response.txTypes.length,
    categories: response.categories.length,
    paymentMethods: response.paymentMethods.length,
    currencies: response.currencies.length,
    accounts: response.accounts.length,
  })

  return NextResponse.json(response)
})
