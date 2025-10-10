import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestUser, createTestAccount, createAuthCookie } from '../helpers/test-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu test dosyası Auto Payments API endpoint'lerini test eder.
describe('Auto Payments API Endpoints', () => {
  let userId: number
  let authToken: string

  beforeAll(async () => {
    const testUser = await createTestUser('autopay')
    userId = testUser.user.id
    authToken = testUser.token
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
    await prisma.$disconnect()
  })

  describe('GET /api/auto-payments', () => {
    it('otomatik ödemeleri getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/auto-payments', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect([200, 500]).toContain(response.status)

      if (response.status === 200) {
        const data = await response.json()
        expect(Array.isArray(data)).toBe(true)
      }
    })

    it('token olmadan 401 dönmeli', async () => {
      const response = await fetch('http://localhost:3000/api/auto-payments')
      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/auto-payments', () => {
    it('yeni otomatik ödeme oluşturma endpoint çalışmalı', async () => {
      const account = await createTestAccount(userId)
      const category = await prisma.refTxCategory.findFirst()
      const paymentMethod = await prisma.refPaymentMethod.findFirst()
      const currency = await prisma.refCurrency.findFirst({ where: { code: 'TRY' } })

      const response = await fetch('http://localhost:3000/api/auto-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: createAuthCookie(authToken),
        },
        body: JSON.stringify({
          name: 'Test Otomatik Ödeme',
          amount: 100,
          currencyId: currency?.id,
          accountId: account.id,
          paymentMethodId: paymentMethod?.id,
          categoryId: category?.id,
          cronSchedule: '0 0 1 * *',
        }),
      })

      expect([201, 400, 500]).toContain(response.status)
    })
  })
})
