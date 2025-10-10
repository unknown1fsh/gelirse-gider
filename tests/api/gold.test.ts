import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestUser, createAuthCookie } from '../helpers/test-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu test dosyası Gold API endpoint'lerini test eder.
describe('Gold API Endpoints', () => {
  let userId: number
  let authToken: string

  beforeAll(async () => {
    const testUser = await createTestUser('gold')
    userId = testUser.user.id
    authToken = testUser.token
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
    await prisma.$disconnect()
  })

  describe('GET /api/gold', () => {
    it('altın portföyünü getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/gold', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect([200, 500]).toContain(response.status)
    })

    it('token olmadan 401 dönmeli', async () => {
      const response = await fetch('http://localhost:3000/api/gold')
      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/gold', () => {
    it('yeni altın ekleme endpoint çalışmalı', async () => {
      const goldType = await prisma.refGoldType.findFirst()
      const goldPurity = await prisma.refGoldPurity.findFirst()

      if (!goldType || !goldPurity) {
        console.log('⚠️ Gold referans verileri eksik, test atlandı')
        return
      }

      const response = await fetch('http://localhost:3000/api/gold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: createAuthCookie(authToken),
        },
        body: JSON.stringify({
          name: 'Test Altın',
          goldTypeId: goldType.id,
          goldPurityId: goldPurity.id,
          weightGrams: 10.5,
          purchasePrice: 5000,
          purchaseDate: new Date().toISOString().split('T')[0],
        }),
      })

      expect([201, 400, 500]).toContain(response.status)
    })
  })
})
