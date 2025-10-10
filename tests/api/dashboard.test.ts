import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestUser, createTestAccount, createAuthCookie } from '../helpers/test-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu test dosyası Dashboard API endpoint'ini test eder.
describe('Dashboard API Endpoint', () => {
  let userId: number
  let authToken: string

  beforeAll(async () => {
    const testUser = await createTestUser('dashboard')
    userId = testUser.user.id
    authToken = testUser.token

    // Test verisi oluştur
    const account = await createTestAccount(userId)
    const txTypeGelir = await prisma.refTxType.findFirst({ where: { code: 'GELIR' } })
    const categoryMaas = await prisma.refTxCategory.findFirst({
      where: { code: 'MAAS', txTypeId: txTypeGelir?.id },
    })
    const paymentMethod = await prisma.refPaymentMethod.findFirst()
    const currency = await prisma.refCurrency.findFirst({ where: { code: 'TRY' } })

    // Test işlemi oluştur
    await prisma.transaction.create({
      data: {
        userId,
        txTypeId: txTypeGelir?.id as number,
        categoryId: categoryMaas?.id as number,
        paymentMethodId: paymentMethod?.id as number,
        accountId: account.id,
        amount: 10000,
        currencyId: currency?.id as number,
        transactionDate: new Date(),
      },
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } })
    await prisma.$disconnect()
  })

  describe('GET /api/dashboard', () => {
    it('dashboard KPI verilerini getirmeli', async () => {
      const response = await fetch('http://localhost:3000/api/dashboard', {
        headers: { Cookie: createAuthCookie(authToken) },
      })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('kpi')
      expect(data.kpi).toHaveProperty('total_income')
      expect(data.kpi).toHaveProperty('total_expense')
      expect(data.kpi).toHaveProperty('net_amount')
      expect(data).toHaveProperty('upcomingPayments')
      expect(data).toHaveProperty('categoryBreakdown')
    })

    it('token olmadan 401 dönmeli', async () => {
      const response = await fetch('http://localhost:3000/api/dashboard')
      expect(response.status).toBe(401)
    })
  })
})
