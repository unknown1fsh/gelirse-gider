import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu test dosyası Auth API endpoint'lerini test eder.
describe('Auth API Endpoints', () => {
  let testEmail: string
  let testPassword: string
  let authToken: string

  beforeAll(async () => {
    testEmail = `test-auth-${Date.now()}@test.com`
    testPassword = 'Test123456'
  })

  afterAll(async () => {
    // Temizlik
    await prisma.user.deleteMany({
      where: { email: testEmail },
    })
    await prisma.$disconnect()
  })

  describe('POST /api/auth/register', () => {
    it('yeni kullanıcı kaydı başarılı olmalı', async () => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: testEmail,
          password: testPassword,
          phone: '+905551234567',
        }),
      })

      expect(response.status).toBe(201)

      const data = await response.json()
      expect(data).toHaveProperty('id')
      expect(data.email).toBe(testEmail)
      expect(data.name).toBe('Test User')
    })

    it('duplicate email ile kayıt hata vermeli', async () => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User 2',
          email: testEmail,
          password: 'Test123456',
        }),
      })

      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toContain('e-posta')
    })
  })

  describe('POST /api/auth/login', () => {
    it('doğru credentials ile giriş başarılı olmalı', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('user')
      expect(data).toHaveProperty('session')
      expect(data.session).toHaveProperty('token')

      authToken = data.session.token
    })

    it('yanlış şifre ile giriş hata vermeli', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'WrongPassword',
        }),
      })

      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data.error).toBeDefined()
    })

    it('olmayan kullanıcı ile giriş hata vermeli', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@test.com',
          password: 'Test123456',
        }),
      })

      expect(response.status).toBe(401)
    })
  })

  describe('GET /api/auth/me', () => {
    it('token ile kullanıcı bilgisi alınmalı', async () => {
      const response = await fetch('http://localhost:3000/api/auth/me', {
        headers: {
          Cookie: `auth-token=${authToken}`,
        },
      })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.email).toBe(testEmail)
      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('plan')
    })

    it('token olmadan 401 dönmeli', async () => {
      const response = await fetch('http://localhost:3000/api/auth/me')

      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/auth/logout', () => {
    it('logout başarılı olmalı', async () => {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          Cookie: `auth-token=${authToken}`,
        },
      })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.success).toBe(true)
    })
  })
})
