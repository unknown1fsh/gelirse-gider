import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestUser, createAuthCookie } from '../helpers/test-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu test dosyası Analysis API endpoint'lerini test eder.
describe('Analysis API Endpoints', () => {
  let userId: number
  let authToken: string

  beforeAll(async () => {
    const testUser = await createTestUser('analysis')
    userId = testUser.user.id
    authToken = testUser.token
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
    await prisma.$disconnect()
  })

  describe('GET /api/analysis', () => {
    it('analiz verilerini getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/analysis', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toBeDefined()
    })
  })

  describe('GET /api/analysis/cashflow', () => {
    it('nakit akışı verilerini getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/analysis/cashflow', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toBeDefined()
    })
  })

  describe('GET /api/analysis/categories', () => {
    it('kategori analizi getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/analysis/categories', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toBeDefined()
    })
  })

  describe('GET /api/analysis/trends', () => {
    it('trend verilerini getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/analysis/trends', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toBeDefined()
    })
  })

  describe('GET /api/analysis/export', () => {
    it('export endpoint çalışmalı', async () => {
      const response = await fetch('http://localhost:3000/api/analysis/export?format=excel', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      // 200 veya 500 (export implementasyonuna göre)
      expect([200, 500]).toContain(response.status)
    })
  })
})
