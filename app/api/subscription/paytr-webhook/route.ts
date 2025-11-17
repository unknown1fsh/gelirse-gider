import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPaytrWebhook } from '@/lib/paytr'
import { ExceptionMapper } from '@/server/errors'

// Bu metot PayTR webhook callback'ini işler (POST).
// PayTR ödeme tamamlandığında bu endpoint'e istek gönderir
// Girdi: NextRequest (PayTR webhook data)
// Çıktı: NextResponse (success/error)
// Hata: 400, 500
export const POST = ExceptionMapper.asyncHandler(async (request: NextRequest) => {
  try {
    // PayTR webhook data'sını al
    const formData = await request.formData()
    const webhookData: Record<string, string> = {}

    // FormData'yı object'e çevir
    for (const [key, value] of formData.entries()) {
      webhookData[key] = value.toString()
    }

    // Webhook signature doğrulama
    const isValid = verifyPaytrWebhook(webhookData)

    if (!isValid) {
      console.error('PayTR webhook signature verification failed')
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 })
    }

    const {
      merchant_oid, // Ödeme linki ID'si (merchantOrderId)
      status, // success veya failed
      total_amount, // Ödeme tutarı (kuruş cinsinden)
      payment_type, // Ödeme tipi
      hash,
      // ... diğer PayTR webhook parametreleri
    } = webhookData

    // Ödeme başarılı mı kontrol et
    if (status !== 'success') {
      console.log('Payment failed:', merchant_oid, status)
      return NextResponse.json({ success: false, message: 'Payment failed' }, { status: 200 })
    }

    // merchant_oid'den user ID ve plan ID'yi parse et
    // Format: sub_{userId}_{timestamp}
    const match = merchant_oid.match(/^sub_(\d+)_(\d+)$/)
    if (!match) {
      console.error('Invalid merchant_oid format:', merchant_oid)
      return NextResponse.json({ success: false, message: 'Invalid order ID' }, { status: 400 })
    }

    const userId = parseInt(match[1], 10)
    const amount = parseFloat(total_amount) / 100 // Kuruş'u TL'ye çevir

    // Plan ID'yi amount'tan belirle (veya merchant_oid'den parse edilebilir)
    let planId = 'premium'
    if (amount >= 450) {
      planId = 'enterprise'
    } else if (amount >= 250) {
      planId = 'premium'
    } else {
      planId = 'free'
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      console.error('User not found:', userId)
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

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
        paymentMethod: payment_type || 'paytr',
        transactionId: merchant_oid,
        autoRenew: planId !== 'free',
      },
    })

    // Eski aboneliği iptal et (eğer varsa ve farklı plan ise)
    if (existingSubscription && existingSubscription.planId !== planId) {
      await prisma.userSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
        },
      })
    }

    // Kullanıcının plan bilgisini güncelle (eğer User modelinde plan field'ı varsa)
    // Not: User modelinde plan field'ı yoksa bu satırı kaldırın
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { plan: planId },
    // })

    console.log('PayTR payment successful:', {
      userId,
      planId,
      amount,
      merchant_oid,
      subscriptionId: subscription.id,
    })

    // PayTR'ye başarılı response döndür
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('PayTR webhook error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
})

