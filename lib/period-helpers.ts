import { prisma } from './prisma'

export type PeriodType = 'YEARLY' | 'FISCAL_YEAR' | 'MONTHLY' | 'CUSTOM'

export interface Period {
  id: number
  userId: number
  name: string
  periodType: PeriodType
  startDate: Date
  endDate: Date
  isClosed: boolean
  isActive: boolean
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Dönem tipinin Türkçe etiketini döndürür
 */
export function getPeriodTypeLabel(type: PeriodType): string {
  const labels: Record<PeriodType, string> = {
    YEARLY: 'Yıllık',
    FISCAL_YEAR: 'Mali Yıl',
    MONTHLY: 'Aylık',
    CUSTOM: 'Özel Dönem',
  }
  return labels[type] || type
}

/**
 * Dönem tipine göre varsayılan tarih aralığını hesaplar
 */
export function calculatePeriodDates(
  type: PeriodType,
  startDate?: Date
): { start: Date; end: Date } {
  const now = startDate || new Date()

  switch (type) {
    case 'YEARLY': {
      const year = now.getFullYear()
      return {
        start: new Date(year, 0, 1), // 1 Ocak
        end: new Date(year, 11, 31), // 31 Aralık
      }
    }

    case 'FISCAL_YEAR': {
      // Mali yıl genellikle 1 Ocak - 31 Aralık
      // Kullanıcı isterse özelleştirebilir
      const year = now.getFullYear()
      return {
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31),
      }
    }

    case 'MONTHLY': {
      const year = now.getFullYear()
      const month = now.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0) // Bir sonraki ayın 0. günü = bu ayın son günü
      return {
        start: firstDay,
        end: lastDay,
      }
    }

    case 'CUSTOM':
    default: {
      // Özel dönem için bugünden itibaren 1 yıl
      const start = new Date(now)
      const end = new Date(now)
      end.setFullYear(end.getFullYear() + 1)
      return { start, end }
    }
  }
}

/**
 * Dönemin aktif olup olmadığını kontrol eder
 */
export function isPeriodActive(period: Period): boolean {
  if (!period.isActive) {
    return false
  }
  if (period.isClosed) {
    return false
  }

  const now = new Date()
  const start = new Date(period.startDate)
  const end = new Date(period.endDate)

  // Tarihleri sadece gün olarak karşılaştır
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  return now >= start && now <= end
}

/**
 * Dönemin kapatılıp kapatılamayacağını kontrol eder
 */
export function canClosePeriod(period: Period): boolean {
  if (period.isClosed) {
    return false
  }

  // Dönem geçmişte olmalı
  const now = new Date()
  const endDate = new Date(period.endDate)
  endDate.setHours(23, 59, 59, 999)

  return now > endDate
}

/**
 * Dönem adını formatlar
 */
export function formatPeriodName(period: Period): string {
  const start = new Date(period.startDate)
  const end = new Date(period.endDate)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (period.name) {
    return period.name
  }

  switch (period.periodType) {
    case 'YEARLY':
      return `${start.getFullYear()} Yılı`
    case 'FISCAL_YEAR':
      return `${start.getFullYear()}-${end.getFullYear()} Mali Yılı`
    case 'MONTHLY':
      return start.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
    case 'CUSTOM':
    default:
      return `${formatDate(start)} - ${formatDate(end)}`
  }
}

/**
 * Bir sonraki dönemi önerir
 */
export function getNextPeriodSuggestion(currentPeriod: Period): {
  name: string
  startDate: Date
  endDate: Date
  periodType: PeriodType
} {
  const currentEnd = new Date(currentPeriod.endDate)
  const nextStart = new Date(currentEnd)
  nextStart.setDate(nextStart.getDate() + 1) // Bir sonraki gün

  const dates = calculatePeriodDates(currentPeriod.periodType, nextStart)

  let name = ''
  switch (currentPeriod.periodType) {
    case 'YEARLY':
      name = `${dates.start.getFullYear()} Yılı`
      break
    case 'FISCAL_YEAR':
      name = `${dates.start.getFullYear()}-${dates.end.getFullYear()} Mali Yılı`
      break
    case 'MONTHLY':
      name = dates.start.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
      break
    case 'CUSTOM':
      name = `${dates.start.toLocaleDateString('tr-TR')} - ${dates.end.toLocaleDateString('tr-TR')}`
      break
  }

  return {
    name,
    startDate: dates.start,
    endDate: dates.end,
    periodType: currentPeriod.periodType,
  }
}

/**
 * Dönem çakışması kontrolü yapar
 */
export async function validatePeriodOverlap(
  userId: number,
  startDate: Date,
  endDate: Date,
  excludePeriodId?: number
): Promise<boolean> {
  const overlappingPeriods = await prisma.period.findMany({
    where: {
      userId,
      id: excludePeriodId ? { not: excludePeriodId } : undefined,
      OR: [
        {
          // Yeni dönem, mevcut bir dönemin içinde başlıyor
          AND: [{ startDate: { lte: startDate } }, { endDate: { gte: startDate } }],
        },
        {
          // Yeni dönem, mevcut bir dönemin içinde bitiyor
          AND: [{ startDate: { lte: endDate } }, { endDate: { gte: endDate } }],
        },
        {
          // Yeni dönem, mevcut bir dönemi tamamen kapsıyor
          AND: [{ startDate: { gte: startDate } }, { endDate: { lte: endDate } }],
        },
      ],
    },
  })

  return overlappingPeriods.length === 0
}

/**
 * Kullanıcının aktif dönemini getirir
 */
export async function getActivePeriod(userId: number): Promise<Period | null> {
  const period = await prisma.period.findFirst({
    where: {
      userId,
      isActive: true,
      isClosed: false,
    },
    orderBy: {
      startDate: 'desc',
    },
  })

  return period as Period | null
}

/**
 * Dönem içindeki işlem sayısını döndürür
 */
export async function getPeriodTransactionCount(periodId: number): Promise<number> {
  return await prisma.transaction.count({
    where: { periodId },
  })
}

/**
 * Dönem içindeki hesap sayısını döndürür
 */
export async function getPeriodAccountCount(periodId: number): Promise<number> {
  const [accounts, creditCards, eWallets] = await Promise.all([
    prisma.account.count({ where: { periodId } }),
    prisma.creditCard.count({ where: { periodId } }),
    prisma.eWallet.count({ where: { periodId } }),
  ])

  return accounts + creditCards + eWallets
}

/**
 * Dönem için özet bilgiler döndürür
 */
export async function getPeriodSummary(periodId: number) {
  const [transactions, accounts, investments, goldItems] = await Promise.all([
    getPeriodTransactionCount(periodId),
    getPeriodAccountCount(periodId),
    prisma.investment.count({ where: { periodId } }),
    prisma.goldItem.count({ where: { periodId } }),
  ])

  return {
    transactions,
    accounts,
    investments,
    goldItems,
  }
}
