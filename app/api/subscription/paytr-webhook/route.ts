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
      webhookData[key] = String(value)
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
      // ... diğer PayTR webhook parametreleri
    } = webhookData

    // Ödeme başarılı mı kontrol et
    if (status !== 'success') {
      // Payment failed
      return NextResponse.json({ success: false, message: 'Payment failed' }, { status: 200 })
    }

    // merchant_oid'den user ID, product type ve plan ID'yi parse et
    // Yeni format: pay_{userId}_{productType}_{timestamp} veya pay_{userId}_{productType}_{timestamp}_{productId}
    // Eski format (geriye uyumluluk): sub_{userId}_{timestamp}
    let userId: number
    let planId: string
    let productType: string
    const amount = parseFloat(total_amount) / 100 // Kuruş'u TL'ye çevir

    // Yeni format kontrolü
    const newFormatMatch = merchant_oid.match(/^pay_(\d+)_([^_]+)_(\d+)(?:_(.+))?$/)
    if (newFormatMatch) {
      userId = parseInt(newFormatMatch[1], 10)
      productType = newFormatMatch[2]
      const productId = newFormatMatch[4] // Opsiyonel

      // Product type'dan plan ID'yi belirle
      if (
        productType === 'premium' ||
        productType === 'enterprise' ||
        productType === 'subscription'
      ) {
        planId = productId || productType
      } else {
        planId = productType
      }
    } else {
      // Eski format kontrolü (geriye uyumluluk)
      const oldFormatMatch = merchant_oid.match(/^sub_(\d+)_(\d+)$/)
      if (!oldFormatMatch) {
        console.error('Invalid merchant_oid format:', merchant_oid)
        return NextResponse.json({ success: false, message: 'Invalid order ID' }, { status: 400 })
      }

      userId = parseInt(oldFormatMatch[1], 10)

      // Plan ID'yi amount'tan belirle (eski format için)
      if (amount >= 450) {
        planId = 'enterprise'
        productType = 'enterprise'
      } else if (amount >= 250) {
        planId = 'premium'
        productType = 'premium'
      } else {
        planId = 'free'
        productType = 'free'
      }
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

    await prisma.userSubscription.create({
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

    // PaymentRequest kaydını güncelle (approved olarak işaretle)
    await prisma.paymentRequest.updateMany({
      where: {
        userId: user.id,
        status: 'pending',
        description: {
          contains: merchant_oid,
        },
      },
      data: {
        status: 'approved',
        approvedAt: new Date(),
      },
    })

    // Kullanıcının plan bilgisini güncelle (eğer User modelinde plan field'ı varsa)
    // Not: User modelinde plan field'ı yoksa bu satırı kaldırın
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { plan: planId },
    // })

    // PayTR payment successful

    // PayTR'ye başarılı response döndür
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('PayTR webhook error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
})
