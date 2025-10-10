import { PrismaClient } from '@prisma/client'
import { PlanId, SubscriptionStatus } from '../../enums'
import { NotFoundError, BusinessRuleError } from '../../errors'

// Bu sınıf abonelik iş mantığını yönetir.
export class SubscriptionService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  // Bu metot kullanıcının aktif planını getirir.
  // Girdi: userId
  // Çıktı: Plan ID
  // Hata: NotFoundError
  async getUserPlan(userId: number): Promise<string> {
    const subscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      orderBy: { createdAt: 'desc' },
    })

    return subscription?.planId || PlanId.FREE
  }

  // Bu metot kullanıcının aboneliğini yükseltir.
  // Girdi: userId, yeni plan, amount, currency
  // Çıktı: Oluşturulan subscription
  // Hata: BusinessRuleError
  async upgradePlan(
    userId: number,
    newPlan: string,
    amount: number,
    currency: string
  ): Promise<unknown> {
    const currentSubscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      orderBy: { createdAt: 'desc' },
    })

    if (currentSubscription && currentSubscription.planId === newPlan) {
      throw new BusinessRuleError('Zaten bu plandaşınız')
    }

    if (currentSubscription) {
      await this.prisma.userSubscription.update({
        where: { id: currentSubscription.id },
        data: {
          status: SubscriptionStatus.CANCELLED,
          cancelledAt: new Date(),
        },
      })
    }

    return this.prisma.userSubscription.create({
      data: {
        userId,
        planId: newPlan,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        amount,
        currency,
        autoRenew: true,
      },
    })
  }

  // Bu metot aboneliği iptal eder.
  // Girdi: userId
  // Çıktı: void
  // Hata: NotFoundError
  async cancelSubscription(userId: number): Promise<void> {
    const subscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!subscription) {
      throw new NotFoundError('Aktif abonelik bulunamadı')
    }

    await this.prisma.userSubscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
        autoRenew: false,
      },
    })
  }

  // Bu metot kullanıcının özellik limitini kontrol eder.
  // Girdi: userId, feature adı
  // Çıktı: { allowed: boolean, current: number, limit: number }
  // Hata: -
  async checkFeatureLimit(
    userId: number,
    feature: string
  ): Promise<{ allowed: boolean; current: number; limit: number }> {
    const plan = await this.getUserPlan(userId)

    const limits: Record<string, Record<string, number>> = {
      [PlanId.FREE]: {
        transactions: 50,
        accounts: 3,
        creditCards: 2,
        analysis: 10,
      },
      [PlanId.PREMIUM]: {
        transactions: -1,
        accounts: -1,
        creditCards: -1,
        analysis: -1,
      },
      [PlanId.ENTERPRISE]: {
        transactions: -1,
        accounts: -1,
        creditCards: -1,
        analysis: -1,
      },
      [PlanId.ENTERPRISE_PREMIUM]: {
        transactions: -1,
        accounts: -1,
        creditCards: -1,
        analysis: -1,
      },
    }

    const limit = limits[plan]?.[feature] ?? -1

    if (limit === -1) {
      return { allowed: true, current: 0, limit: -1 }
    }

    let current = 0

    if (feature === 'transactions') {
      const currentMonth = new Date()
      currentMonth.setDate(1)
      currentMonth.setHours(0, 0, 0, 0)

      current = await this.prisma.transaction.count({
        where: {
          userId,
          createdAt: { gte: currentMonth },
        },
      })
    }

    return {
      allowed: current < limit,
      current,
      limit,
    }
  }
}
