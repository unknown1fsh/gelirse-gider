import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Oturum bulunamadı' },
        { status: 401 }
      )
    }

    // Mevcut abonelik bilgilerini al
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: user.id,
        status: 'active'
      },
      orderBy: { createdAt: 'desc' }
    })

    // Abonelik geçmişi
    const subscriptionHistory = await prisma.userSubscription.findMany({
      where: {
        userId: user.id
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Kullanım istatistikleri
    const usageStats = await prisma.transaction.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // Bu ay
        }
      }
    })

    // Plan limitleri
    const planLimits: { [key: string]: { transactions: number; features: string[] } } = {
      free: {
        transactions: 50,
        features: ['Temel raporlar', 'Mobil erişim', 'E-posta desteği']
      },
      premium: {
        transactions: -1, // Sınırsız
        features: ['Sınırsız işlem', 'Gelişmiş analizler', 'Öncelikli destek', 'Veri dışa aktarma']
      },
      enterprise: {
        transactions: -1,
        features: ['Tüm Premium özellikler', 'Çoklu kullanıcı', 'API erişimi', 'Özel entegrasyonlar']
      }
    }

    const currentPlan = subscription?.planId || 'free'
    const limits = planLimits[currentPlan]

    return NextResponse.json({
      success: true,
      subscription: subscription ? {
        id: subscription.id,
        planId: subscription.planId,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        amount: subscription.amount,
        currency: subscription.currency,
        autoRenew: subscription.autoRenew
      } : null,
      usage: {
        currentPlan,
        transactionsThisMonth: usageStats,
        transactionLimit: limits.transactions,
        isUnlimited: limits.transactions === -1,
        remainingTransactions: limits.transactions === -1 ? -1 : Math.max(0, limits.transactions - usageStats)
      },
      features: limits.features,
      history: subscriptionHistory.map(sub => ({
        id: sub.id,
        planId: sub.planId,
        status: sub.status,
        startDate: sub.startDate,
        endDate: sub.endDate,
        amount: sub.amount,
        currency: sub.currency,
        createdAt: sub.createdAt
      }))
    })
  } catch (error) {
    console.error('Get subscription status error:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
