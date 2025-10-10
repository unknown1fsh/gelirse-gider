import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu dosya test yardımcı fonksiyonlarını içerir.

// Bu metot test kullanıcısı oluşturur.
// Girdi: Email suffix (opsiyonel)
// Çıktı: { user, token }
// Hata: -
export async function createTestUser(emailSuffix = 'user') {
  const email = `test-${emailSuffix}-${Date.now()}@test.com`
  const password = 'Test123456'

  // Kullanıcı oluştur
  const bcrypt = await import('bcryptjs')
  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      name: `Test ${emailSuffix}`,
      passwordHash,
      emailVerified: false,
      phoneVerified: false,
      timezone: 'Europe/Istanbul',
      language: 'tr',
      currency: 'TRY',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: '1.234,56',
      theme: 'light',
      notifications: {},
      settings: {},
      isActive: true,
    },
  })

  // Free subscription oluştur
  await prisma.userSubscription.create({
    data: {
      userId: user.id,
      planId: 'free',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      amount: 0,
      currency: 'TRY',
    },
  })

  // Token oluştur
  const jwt = await import('jsonwebtoken')
  const token = jwt.sign(
    { userId: user.id, email: user.email, plan: 'free' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1d' }
  )

  // Session oluştur
  await prisma.userSession.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isActive: true,
    },
  })

  return { user, token, email, password }
}

// Bu metot test hesabı oluşturur.
// Girdi: userId
// Çıktı: account
// Hata: -
export async function createTestAccount(userId: number) {
  // Referans verileri al
  const accountType = await prisma.refAccountType.findFirst()
  const bank = await prisma.refBank.findFirst()
  const currency = await prisma.refCurrency.findFirst({ where: { code: 'TRY' } })

  if (!accountType || !bank || !currency) {
    throw new Error('Referans verileri eksik')
  }

  return prisma.account.create({
    data: {
      userId,
      name: 'Test Hesap',
      accountTypeId: accountType.id,
      bankId: bank.id,
      currencyId: currency.id,
      balance: 10000,
      active: true,
    },
  })
}

// Bu metot test kredi kartı oluşturur.
// Girdi: userId
// Çıktı: creditCard
// Hata: -
export async function createTestCreditCard(userId: number) {
  const bank = await prisma.refBank.findFirst()
  const currency = await prisma.refCurrency.findFirst({ where: { code: 'TRY' } })

  if (!bank || !currency) {
    throw new Error('Referans verileri eksik')
  }

  return prisma.creditCard.create({
    data: {
      userId,
      name: 'Test Kart',
      bankId: bank.id,
      currencyId: currency.id,
      limitAmount: 10000,
      availableLimit: 10000,
      statementDay: 15,
      dueDay: 5,
      minPaymentPercent: 3.0,
      active: true,
    },
  })
}

// Bu metot test kullanıcısını siler.
// Girdi: userId
// Çıktı: void
// Hata: -
export async function deleteTestUser(userId: number) {
  await prisma.user.delete({
    where: { id: userId },
  })
}

// Bu metot auth cookie string oluşturur.
// Girdi: token
// Çıktı: cookie string
// Hata: -
export function createAuthCookie(token: string): string {
  return `auth-token=${token}`
}
