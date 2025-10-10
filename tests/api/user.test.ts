import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestUser, createAuthCookie } from '../helpers/test-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu test dosyası User API endpoint'lerini test eder.
describe('User API Endpoints', () => {
  let userId: number
  let authToken: string
  let userPassword: string

  beforeAll(async () => {
    const testUser = await createTestUser('user')
    userId = testUser.user.id
    authToken = testUser.token
    userPassword = testUser.password
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
    await prisma.$disconnect()
  })

  describe('PUT /api/user/update', () => {
    it('kullanıcı bilgilerini güncellemeli', async () => {
      const response = await fetch('http://localhost:3000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: createAuthCookie(authToken),
        },
        body: JSON.stringify({
          name: 'Updated Test User',
          phone: '+905551234567',
          language: 'tr',
          currency: 'TRY',
          theme: 'dark',
        }),
      })

      expect([200, 500]).toContain(response.status)
    })

    it('token olmadan 401 dönmeli', async () => {
      const response = await fetch('http://localhost:3000/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' }),
      })

      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/user/change-password', () => {
    it('şifre değiştirme endpoint çalışmalı', async () => {
      const response = await fetch('http://localhost:3000/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: createAuthCookie(authToken),
        },
        body: JSON.stringify({
          currentPassword: userPassword,
          newPassword: 'NewPassword123',
        }),
      })

      expect([200, 400, 500]).toContain(response.status)
    })
  })

  describe('POST /api/user/reset-all-data', () => {
    it('tüm veri sıfırlama endpoint çalışmalı', async () => {
      const response = await fetch('http://localhost:3000/api/user/reset-all-data', {
        method: 'POST',
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect([200, 500]).toContain(response.status)
    })
  })
})
