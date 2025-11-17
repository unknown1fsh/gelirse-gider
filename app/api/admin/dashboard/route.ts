import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { ExceptionMapper } from '@/server/errors'

export const GET = ExceptionMapper.asyncHandler(async (request: NextRequest) => {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.error
  }

  // Toplam kullanıcı sayısı
  const totalUsers = await prisma.user.count()

  // Aktif kullanıcı sayısı
  const activeUsers = await prisma.user.count({
    where: { isActive: true },
  })

  // Bugün kayıt olan kullanıcılar
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const newUsersToday = await prisma.user.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  })

  // Son 7 günde kayıt olan kullanıcılar
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)
  const newUsersLast7Days = await prisma.user.count({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
  })

  // Son 30 günde kayıt olan kullanıcılar
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  thirtyDaysAgo.setHours(0, 0, 0, 0)
  const newUsersLast30Days = await prisma.user.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  })

  // Toplam işlem sayısı
  const totalTransactions = await prisma.transaction.count()

  // Son 7 gündeki işlem sayısı
  const transactionsLast7Days = await prisma.transaction.count({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
  })

  // Son 30 gündeki işlem sayısı
  const transactionsLast30Days = await prisma.transaction.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  })

  // Toplam hesap sayısı
  const totalAccounts = await prisma.account.count()

  // Toplam yatırım sayısı
  const totalInvestments = await prisma.investment.count()

  // Plan dağılımı
  const planDistribution = await prisma.userSubscription.groupBy({
    by: ['planId'],
    where: {
      status: 'active',
    },
    _count: {
      planId: true,
    },
  })

  // Rol dağılımı
  const roleDistribution = await prisma.user.groupBy({
    by: ['role'],
    _count: {
      role: true,
    },
  })

  // Son giriş yapan kullanıcılar (son 24 saat)
  const last24Hours = new Date()
  last24Hours.setHours(last24Hours.getHours() - 24)
  const activeUsersLast24Hours = await prisma.user.count({
    where: {
      lastLoginAt: {
        gte: last24Hours,
      },
    },
  })

  return NextResponse.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday,
        newLast7Days: newUsersLast7Days,
        newLast30Days: newUsersLast30Days,
        activeLast24Hours: activeUsersLast24Hours,
      },
      transactions: {
        total: totalTransactions,
        last7Days: transactionsLast7Days,
        last30Days: transactionsLast30Days,
      },
      accounts: {
        total: totalAccounts,
      },
      investments: {
        total: totalInvestments,
      },
      planDistribution: planDistribution.map(p => ({
        plan: p.planId,
        count: p._count.planId,
      })),
      roleDistribution: roleDistribution.map(r => ({
        role: r.role,
        count: r._count.role,
      })),
    },
  })
})

