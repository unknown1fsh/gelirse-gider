import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Demo kullanıcı planlarını düzelt

    // Demo kullanıcıları ve planları
    const demoUsers = [
      {
        email: 'demo@giderse.com',
        planId: 'PREMIUM',
        planName: 'Premium Demo',
        amount: 99.99,
      },
      {
        email: 'free@giderse.com',
        planId: 'FREE',
        planName: 'Ücretsiz Demo',
        amount: 0.0,
      },
      {
        email: 'enterprise@giderse.com',
        planId: 'ENTERPRISE',
        planName: 'Kurumsal Demo',
        amount: 299.99,
      },
      {
        email: 'enterprise-premium@giderse.com',
        planId: 'ENTERPRISE_PREMIUM',
        planName: 'Ultra Premium Demo',
        amount: 499.99,
      },
    ]

    const results = []

    for (const userData of demoUsers) {
      // Kullanıcıyı bul
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      })

      if (!user) {
        // Kullanıcı bulunamadı
        continue
      }

      // Mevcut subscription'ları sil
      await prisma.userSubscription.deleteMany({
        where: { userId: user.id },
      })

      // Yeni subscription oluştur
      const startDate = new Date()
      const endDate = new Date()
      endDate.setFullYear(endDate.getFullYear() + 1) // 1 yıl geçerli

      const subscription = await prisma.userSubscription.create({
        data: {
          userId: user.id,
          planId: userData.planId,
          status: 'active',
          startDate: startDate,
          endDate: endDate,
          amount: userData.amount,
          currency: 'TRY',
          autoRenew: false,
        },
      })

      results.push({
        email: userData.email,
        planId: userData.planId,
        planName: userData.planName,
        subscriptionId: subscription.id,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Demo kullanıcı planları düzeltildi',
      users: results,
    })
  } catch (error) {
    console.error('❌ Plan düzeltme hatası:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Plan düzeltme hatası',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
