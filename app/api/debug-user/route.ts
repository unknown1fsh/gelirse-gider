import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-refactored'
import { prisma } from '@/lib/prisma'

// Debug endpoint - kullanıcı bilgilerini detaylı göster
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({
        error: 'Kullanıcı bulunamadı',
        authenticated: false,
      })
    }

    // Kullanıcının tüm aboneliklerini çek
    const subscriptions = await prisma.userSubscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    // Aktif aboneliği bul
    const activeSubscription = subscriptions.find(s => s.status === 'active')

    // Session bilgisini çek
    const token = request.cookies.get('auth-token')?.value
    const session = token
      ? await prisma.userSession.findUnique({
          where: { token },
          include: {
            user: {
              include: {
                subscriptions: {
                  where: { status: 'active' },
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
        })
      : null

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        isActive: user.isActive,
      },
      subscriptions: {
        all: subscriptions.map(s => ({
          id: s.id,
          planId: s.planId,
          status: s.status,
          startDate: s.startDate,
          endDate: s.endDate,
          createdAt: s.createdAt,
        })),
        active: activeSubscription
          ? {
              id: activeSubscription.id,
              planId: activeSubscription.planId,
              status: activeSubscription.status,
              startDate: activeSubscription.startDate,
              endDate: activeSubscription.endDate,
            }
          : null,
      },
      session: session
        ? {
            id: session.id,
            userId: session.userId,
            isActive: session.isActive,
            expiresAt: session.expiresAt,
            userPlanFromSession: session.user.subscriptions[0]?.planId || 'free',
          }
        : null,
      diagnosis: {
        hasActiveSubscription: !!activeSubscription,
        userPlanMatches: user.plan === (activeSubscription?.planId || 'free'),
        issue:
          !activeSubscription && user.plan !== 'free'
            ? 'User plan is not free but no active subscription found'
            : user.plan !== (activeSubscription?.planId || 'free')
              ? `User plan (${user.plan}) doesn't match active subscription (${activeSubscription?.planId})`
              : 'OK',
      },
    })
  } catch (error) {
    console.error('Debug user error:', error)
    return NextResponse.json(
      {
        error: 'Server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
