import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-refactored'
import { PrismaClient } from '@prisma/client'
import { createPaymentLink } from '@/lib/paytr'
import { ExceptionMapper } from '@/server/errors'
import { BadRequestError } from '@/server/errors'

const prisma = new PrismaClient()

// Bu metot subscription upgrade işlemini başlatır.
// Premium/Enterprise planlar için PayTR ödeme linki oluşturur
// Free plan için direkt aktif eder
export const POST = ExceptionMapper.asyncHandler(async (request: NextRequest) => {
  const user = await getCurrentUser(request)

  if (!user) {
    throw new BadRequestError('Oturum bulunamadı')
  }

  const { planId } = await request.json()

  // Validation
  if (!planId) {
    throw new BadRequestError('Plan ID gerekli')
  }

  // Plan kontrolü
  const validPlans = ['free', 'premium', 'enterprise']
  if (!validPlans.includes(planId)) {
    throw new BadRequestError('Geçersiz plan')
  }

  // Plan fiyatları
  const planPrices: { [key: string]: number } = {
    free: 0,
    premium: 250,
    enterprise: 450,
  }

  const amount = planPrices[planId]

  // Free plan için direkt aktif et
  if (planId === 'free') {
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
    const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 yıl

    const subscription = await prisma.userSubscription.create({
      data: {
        userId: user.id,
        planId,
        status: 'active',
        startDate,
        endDate,
        amount,
        currency: 'TRY',
        paymentMethod: 'free',
        transactionId: `txn_${Date.now()}_${user.id}`,
        autoRenew: false,
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

    return NextResponse.json({
      success: true,
      message: 'Free plan aktif edildi',
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
  }

  // Premium/Enterprise planlar için PayTR ödeme linki oluştur
  // Email doğrulama kontrolü
  if (!user.emailVerified) {
    throw new BadRequestError('Ödeme yapmak için e-posta adresinizi doğrulamanız gerekiyor')
  }

  const paymentResult = await createPaymentLink({
    email: user.email,
    name: user.name,
    amount,
    planId,
    userId: user.id,
    description: `${planId} plan abonelik ücreti`,
  })

  if (!paymentResult.success || !paymentResult.paymentUrl) {
    console.error('PayTR payment link creation failed:', paymentResult.error)
    throw new BadRequestError(paymentResult.error || 'Ödeme linki oluşturulamadı')
  }

  return NextResponse.json({
    success: true,
    message: 'Ödeme linki oluşturuldu',
    paymentUrl: paymentResult.paymentUrl,
    paymentLinkId: paymentResult.paymentLinkId,
  })
})
