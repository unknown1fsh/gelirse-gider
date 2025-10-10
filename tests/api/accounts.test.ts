import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestUser, createAuthCookie } from '../helpers/test-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu test dosyası Account API endpoint'lerini test eder.
describe('Account API Endpoints', () => {
  let userId: number
  let authToken: string

  beforeAll(async () => {
    const testUser = await createTestUser('account')
    userId = testUser.user.id
    authToken = testUser.token
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
    await prisma.$disconnect()
  })

  describe('GET /api/accounts', () => {
    it('kullanıcının hesaplarını getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/accounts', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)
    })

    it('token olmadan 401 dönmeli', async () => {
      const response = await fetch('http://localhost:3000/api/accounts')
      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/accounts', () => {
    it('yeni hesap oluşturmalı', async () => {
      const accountType = await prisma.refAccountType.findFirst()
      const bank = await prisma.refBank.findFirst()
      const currency = await prisma.refCurrency.findFirst({ where: { code: 'TRY' } })

      const response = await fetch('http://localhost:3000/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: createAuthCookie(authToken),
        },
        body: JSON.stringify({
          name: 'Test Hesap',
          accountTypeId: accountType?.id,
          bankId: bank?.id,
          currencyId: currency?.id,
          balance: 5000,
        }),
      })

      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data).toHaveProperty('id')
      expect(data.name).toBe('Test Hesap')
    })
  })

  describe('GET /api/accounts/bank', () => {
    it('banka hesaplarını getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/accounts/bank', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)
    })
  })
})
