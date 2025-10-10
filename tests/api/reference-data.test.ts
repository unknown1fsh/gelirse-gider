import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestUser, createAuthCookie } from '../helpers/test-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu test dosyası Reference Data API endpoint'ini test eder.
describe('Reference Data API Endpoint', () => {
  let userId: number
  let authToken: string

  beforeAll(async () => {
    const testUser = await createTestUser('refdata')
    userId = testUser.user.id
    authToken = testUser.token
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
    await prisma.$disconnect()
  })

  describe('GET /api/reference-data', () => {
    it('tüm referans verilerini getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/reference-data', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('txTypes')
      expect(data).toHaveProperty('categories')
      expect(data).toHaveProperty('paymentMethods')
      expect(data).toHaveProperty('accounts')
      expect(data).toHaveProperty('creditCards')
      expect(data).toHaveProperty('currencies')

      expect(Array.isArray(data.txTypes)).toBe(true)
      expect(Array.isArray(data.categories)).toBe(true)
      expect(Array.isArray(data.paymentMethods)).toBe(true)
      expect(Array.isArray(data.currencies)).toBe(true)

      // İşlem tipleri kontrol
      expect(data.txTypes.length).toBeGreaterThan(0)

      const gelirType = data.txTypes.find((t: any) => t.code === 'GELIR')
      const giderType = data.txTypes.find((t: any) => t.code === 'GIDER')

      expect(gelirType).toBeDefined()
      expect(giderType).toBeDefined()
      expect(gelirType.name).toBe('Gelir')
      expect(giderType.name).toBe('Gider')

      // Kategoriler kontrol
      expect(data.categories.length).toBeGreaterThan(0)

      // Her kategorinin bir txTypeId'si olmalı
      data.categories.forEach((cat: any) => {
        expect(cat.txTypeId).toBeDefined()
        expect(typeof cat.txTypeId).toBe('number')
      })
    })

    it('token olmadan 401 dönmeli', async () => {
      const response = await fetch('http://localhost:3000/api/reference-data')
      expect(response.status).toBe(401)
    })
  })
})
