import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-refactored'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ success: false, message: 'Oturum bulunamadı' }, { status: 401 })
    }

    const { planId, paymentMethod } = await request.json()

    // Validation
    if (!planId) {
      return NextResponse.json({ success: false, message: 'Plan ID gerekli' }, { status: 400 })
    }

    // Plan kontrolü
    const validPlans = ['free', 'premium', 'enterprise']
    if (!validPlans.includes(planId)) {
      return NextResponse.json({ success: false, message: 'Geçersiz plan' }, { status: 400 })
    }

    // Plan fiyatları
    const planPrices: { [key: string]: number } = {
      free: 0,
      premium: 250,
      enterprise: 450,
    }

    const amount = planPrices[planId]

    // Mevcut aktif aboneliği kontrol et
    const existingSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId: user.id,
        status: 'active',
      },
      orderBy: { createdAt: 'desc' },
    })

    // Yeni abonelik oluştur
    const startDate = new Date()
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 gün

    const subscription = await prisma.userSubscription.create({
      data: {
        userId: user.id,
        planId,
        status: 'active',
        startDate,
        endDate,
        amount,
        currency: 'TRY',
        paymentMethod: paymentMethod || 'credit_card',
        transactionId: `txn_${Date.now()}_${user.id}`,
        autoRenew: planId !== 'free',
      },
    })

    // Eski aboneliği iptal et (eğer varsa)
    if (existingSubscription && existingSubscription.planId !== planId) {
      await prisma.userSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
        },
      })
    }

    // Kullanıcının plan bilgisini güncelle
    await prisma.user.update({
      where: { id: user.id },
      data: { plan: planId },
    })

    return NextResponse.json({
      success: true,
      message: 'Plan başarıyla yükseltildi',
      subscription: {
        id: subscription.id,
        planId: subscription.planId,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        amount: subscription.amount,
        currency: subscription.currency,
      },
    })
  } catch (error) {
    console.error('Upgrade subscription error:', error)
    return NextResponse.json({ success: false, message: 'Sunucu hatası' }, { status: 500 })
  }
}
