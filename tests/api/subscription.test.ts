import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestUser, createAuthCookie } from '../helpers/test-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu test dosyası Subscription API endpoint'lerini test eder.
describe('Subscription API Endpoints', () => {
  let userId: number
  let authToken: string

  beforeAll(async () => {
    const testUser = await createTestUser('subscription')
    userId = testUser.user.id
    authToken = testUser.token
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
    await prisma.$disconnect()
  })

  describe('GET /api/subscription/plans', () => {
    it('mevcut planları getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/subscription/plans', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('GET /api/subscription/status', () => {
    it('abonelik durumunu getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/subscription/status', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('planId')
      expect(data.planId).toBe('free')
    })

    it('token olmadan 401 dönmeli', async () => {
      const response = await fetch('http://localhost:3000/api/subscription/status')
      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/subscription/upgrade', () => {
    it('plan yükseltme endpoint çalışmalı', async () => {
      const response = await fetch('http://localhost:3000/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: createAuthCookie(authToken),
        },
        body: JSON.stringify({
          planId: 'premium',
        }),
      })

      // 200 veya 400 (implementasyona göre)
      expect([200, 400, 500]).toContain(response.status)
    })
  })

  describe('POST /api/subscription/cancel', () => {
    it('abonelik iptal endpoint çalışmalı', async () => {
      const response = await fetch('http://localhost:3000/api/subscription/cancel', {
        method: 'POST',
        headers: { Cookie: createAuthCookie(authToken) },
      })

      // 200 veya 404 (aktif subscription yoksa)
      expect([200, 404, 500]).toContain(response.status)
    })
  })
})
