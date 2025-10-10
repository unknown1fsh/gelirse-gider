import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestUser, createAuthCookie } from '../helpers/test-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu test dosyası Credit Card API endpoint'lerini test eder.
describe('Credit Card API Endpoints', () => {
  let userId: number
  let authToken: string

  beforeAll(async () => {
    const testUser = await createTestUser('cards')
    userId = testUser.user.id
    authToken = testUser.token
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
    await prisma.$disconnect()
  })

  describe('GET /api/cards', () => {
    it('kullanıcının kartlarını getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/cards', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)
    })

    it('token olmadan 401 dönmeli', async () => {
      const response = await fetch('http://localhost:3000/api/cards')
      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/cards', () => {
    it('yeni kredi kartı oluşturmalı', async () => {
      const bank = await prisma.refBank.findFirst()
      const currency = await prisma.refCurrency.findFirst({ where: { code: 'TRY' } })

      const response = await fetch('http://localhost:3000/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: createAuthCookie(authToken),
        },
        body: JSON.stringify({
          name: 'Test Bonus Kart',
          bankId: bank?.id,
          currencyId: currency?.id,
          limitAmount: 10000,
          availableLimit: 10000,
          statementDay: 15,
          dueDay: 5,
          minPaymentPercent: 3.0,
        }),
      })

      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data).toHaveProperty('id')
      expect(data.name).toBe('Test Bonus Kart')
    })
  })
})
