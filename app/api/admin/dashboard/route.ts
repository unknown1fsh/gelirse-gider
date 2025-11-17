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

  // İşlem hacmi hesaplamaları
  const transactionAmounts = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
  })

  const transactionAmountsLast7Days = await prisma.transaction.aggregate({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    _sum: {
      amount: true,
    },
  })

  const transactionAmountsLast30Days = await prisma.transaction.aggregate({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    _sum: {
      amount: true,
    },
  })

  // Hesap bakiyeleri toplamı
  const accountBalances = await prisma.account.aggregate({
    _sum: {
      balance: true,
    },
  })

  // Yatırım değerleri toplamı
  const investmentValues = await prisma.investment.aggregate({
    _sum: {
      currentPrice: true,
    },
  })

  // Abonelik bilgileri
  const activeSubscriptions = await prisma.userSubscription.count({
    where: {
      status: 'active',
    },
  })

  const subscriptionRevenue = await prisma.userSubscription.aggregate({
    where: {
      status: 'active',
    },
    _sum: {
      amount: true,
    },
  })

  // Kullanıcı büyüme trendi (son 30 gün)
  const userGrowthData = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const count = await prisma.user.count({
      where: {
        createdAt: {
          gte: date,
          lt: nextDate,
        },
      },
    })

    userGrowthData.push({
      date: date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
      count,
    })
  }

  // İşlem hacmi trendi (son 30 gün)
  const transactionVolumeData = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const result = await prisma.transaction.aggregate({
      where: {
        createdAt: {
          gte: date,
          lt: nextDate,
        },
      },
      _sum: {
        amount: true,
      },
    })

    transactionVolumeData.push({
      date: date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
      amount: Number(result._sum.amount || 0),
    })
  }

  // Kategori bazlı işlem dağılımı
  const categoryBreakdown = await prisma.transaction.groupBy({
    by: ['categoryId'],
    _sum: {
      amount: true,
    },
    _count: {
      id: true,
    },
    take: 10,
    orderBy: {
      _sum: {
        amount: 'desc',
      },
    },
  })

  const categoryDetails = await Promise.all(
    categoryBreakdown.map(async item => {
      const category = await prisma.refTxCategory.findUnique({
        where: { id: item.categoryId },
      })
      return {
        category: category?.name || 'Bilinmeyen',
        amount: Number(item._sum.amount || 0),
        count: item._count.id,
      }
    })
  )

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
        totalAmount: Number(transactionAmounts._sum.amount || 0),
        last7DaysAmount: Number(transactionAmountsLast7Days._sum.amount || 0),
        last30DaysAmount: Number(transactionAmountsLast30Days._sum.amount || 0),
      },
      accounts: {
        total: totalAccounts,
        totalBalance: Number(accountBalances._sum.balance || 0),
      },
      investments: {
        total: totalInvestments,
        totalValue: Number(investmentValues._sum.currentPrice || 0),
      },
      subscriptions: {
        active: activeSubscriptions,
        totalRevenue: Number(subscriptionRevenue._sum.amount || 0),
        byPlan: planDistribution.map(p => ({
          plan: p.planId,
          count: p._count.planId,
        })),
      },
      planDistribution: planDistribution.map(p => ({
        plan: p.planId,
        count: p._count.planId,
      })),
      roleDistribution: roleDistribution.map(r => ({
        role: r.role,
        count: r._count.role,
      })),
      userGrowth: userGrowthData,
      transactionVolume: transactionVolumeData,
      categoryBreakdown: categoryDetails,
    },
  })
})
