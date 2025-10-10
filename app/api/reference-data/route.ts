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

  return NextResponse.json({
    // İşlem parametreleri (PARAMETRE TABLOSUNDAN - Sadece TX_TYPE ve TX_CATEGORY)
    txTypes: txTypeParams.map(t => ({
      id: t.id,
      code: t.paramCode,
      name: t.displayName,
      icon: t.metadata?.icon || null,
      color: t.metadata?.color || null,
    })),
    categories: txCategoryParams.map(c => {
      // txTypeCode ile SystemParameter TX_TYPE ID'sine map et
      const txTypeCode = c.metadata?.txTypeCode || ''
      const mappedTxTypeId = txTypeMapping[txTypeCode] || 0

      return {
        id: c.id,
        name: c.displayName,
        code: c.metadata?.code || c.paramCode,
        txTypeId: mappedTxTypeId, // SystemParameter TX_TYPE ID'si
        txTypeName: c.metadata?.txTypeName || '',
        icon: c.metadata?.icon || null,
        color: c.metadata?.color || null,
        isDefault: c.metadata?.isDefault || false,
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
      symbol: c.metadata?.symbol || c.paramCode,
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
  })
})
