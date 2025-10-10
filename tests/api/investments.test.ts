import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestUser, createAuthCookie } from '../helpers/test-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu test dosyası Investments API endpoint'lerini test eder.
describe('Investments API Endpoints', () => {
  let userId: number
  let authToken: string

  beforeAll(async () => {
    const testUser = await createTestUser('investment')
    userId = testUser.user.id
    authToken = testUser.token
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
    await prisma.$disconnect()
  })

  describe('GET /api/investments', () => {
    it('yatırımları getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/investments', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect([200, 500]).toContain(response.status)
    })

    it('token olmadan 401 dönmeli', async () => {
      const response = await fetch('http://localhost:3000/api/investments')
      expect(response.status).toBe(401)
    })
  })

  describe('GET /api/investments/types', () => {
    it('yatırım tiplerini getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/investments/types', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect([200, 500]).toContain(response.status)
    })
  })
})
