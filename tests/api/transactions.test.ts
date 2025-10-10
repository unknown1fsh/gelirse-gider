import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestUser, createTestAccount, createAuthCookie } from '../helpers/test-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu test dosyası Transaction API endpoint'lerini test eder.
describe('Transaction API Endpoints', () => {
  let userId: number
  let authToken: string
  let accountId: number
  let txTypeGelir: any
  let txTypeGider: any
  let categoryMaas: any
  let categoryMarket: any
  let paymentMethod: any
  let currency: any

  beforeAll(async () => {
    // Test kullanıcısı oluştur
    const testUser = await createTestUser('transaction')
    userId = testUser.user.id
    authToken = testUser.token

    // Test hesabı oluştur
    const account = await createTestAccount(userId)
    accountId = account.id

    // Referans verileri al
    txTypeGelir = await prisma.refTxType.findFirst({ where: { code: 'GELIR' } })
    txTypeGider = await prisma.refTxType.findFirst({ where: { code: 'GIDER' } })
    categoryMaas = await prisma.refTxCategory.findFirst({
      where: { code: 'MAAS', txTypeId: txTypeGelir.id },
    })
    categoryMarket = await prisma.refTxCategory.findFirst({
      where: { code: 'MARKET', txTypeId: txTypeGider.id },
    })
    paymentMethod = await prisma.refPaymentMethod.findFirst()
    currency = await prisma.refCurrency.findFirst({ where: { code: 'TRY' } })
  })

  afterAll(async () => {
    // Temizlik
    await prisma.user.deleteMany({
      where: { id: userId },
    })
    await prisma.$disconnect()
  })

  describe('GET /api/transactions', () => {
    it('kullanıcının işlemlerini getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/transactions', {
        headers: {
          Cookie: createAuthCookie(authToken),
        },
      })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)
    })

    it('token olmadan 401 dönmeli', async () => {
      const response = await fetch('http://localhost:3000/api/transactions')

      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/transactions', () => {
    it('gelir işlemi başarılı oluşturmalı', async () => {
      const response = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: createAuthCookie(authToken),
        },
        body: JSON.stringify({
          txTypeId: txTypeGelir.id,
          categoryId: categoryMaas.id,
          paymentMethodId: paymentMethod.id,
          accountId: accountId,
          amount: 15000,
          currencyId: currency.id,
          transactionDate: new Date().toISOString().split('T')[0],
          description: 'Test maaş geliri',
          tags: ['test', 'maaş'],
        }),
      })

      expect(response.status).toBe(201)

      const data = await response.json()
      expect(data).toHaveProperty('id')
      expect(data.txType.code).toBe('GELIR')
      expect(data.amount).toBeDefined()
    })

    it('gider işlemi başarılı oluşturmalı', async () => {
      const response = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: createAuthCookie(authToken),
        },
        body: JSON.stringify({
          txTypeId: txTypeGider.id,
          categoryId: categoryMarket.id,
          paymentMethodId: paymentMethod.id,
          accountId: accountId,
          amount: 500,
          currencyId: currency.id,
          transactionDate: new Date().toISOString().split('T')[0],
          description: 'Test market gideri',
        }),
      })

      expect(response.status).toBe(201)

      const data = await response.json()
      expect(data.txType.code).toBe('GIDER')
    })

    it('yanlış kategori-tip kombinasyonu hata vermeli', async () => {
      const response = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: createAuthCookie(authToken),
        },
        body: JSON.stringify({
          txTypeId: txTypeGelir.id, // GELIR
          categoryId: categoryMarket.id, // GIDER kategorisi!
          paymentMethodId: paymentMethod.id,
          accountId: accountId,
          amount: 1000,
          currencyId: currency.id,
          transactionDate: new Date().toISOString().split('T')[0],
        }),
      })

      expect(response.status).toBe(422)

      const data = await response.json()
      expect(data.error).toContain('uyuşmuyor')
    })

    it('negatif tutar hata vermeli', async () => {
      const response = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: createAuthCookie(authToken),
        },
        body: JSON.stringify({
          txTypeId: txTypeGelir.id,
          categoryId: categoryMaas.id,
          paymentMethodId: paymentMethod.id,
          accountId: accountId,
          amount: -1000,
          currencyId: currency.id,
          transactionDate: new Date().toISOString().split('T')[0],
        }),
      })

      expect(response.status).toBeGreaterThanOrEqual(400)
    })

    it('token olmadan 401 dönmeli', async () => {
      const response = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          txTypeId: txTypeGelir.id,
          categoryId: categoryMaas.id,
          amount: 1000,
        }),
      })

      expect(response.status).toBe(401)
    })
  })
})
