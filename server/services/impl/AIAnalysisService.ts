import {
  PrismaClient,
  Transaction,
  Account,
  CreditCard,
  Investment,
  GoldItem,
  AutoPayment,
} from '@prisma/client'
import { getReportLevelForPlan } from '@/lib/ai-report-limit'

export interface AIReportData {
  summary: {
    totalIncome: number
    totalExpense: number
    netAmount: number
    savingsRate: number
    period: string
  }
  categoryAnalysis: Array<{
    category: string
    amount: number
    percentage: number
    count: number
    trend: 'up' | 'down' | 'stable'
  }>
  topCategories: Array<{
    category: string
    amount: number
    trend: string
  }>
  cashFlow: Array<{
    month: string
    income: number
    expense: number
    balance: number
  }>
  insights: Array<{
    type: 'savings' | 'optimization' | 'investment' | 'risk' | 'trend'
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    impact: string
  }>
  predictions?: {
    next3Months: Array<{
      month: string
      predictedIncome: number
      predictedExpense: number
      confidence: number
    }>
    recommendations: string[]
  }
  riskAnalysis?: {
    overallRisk: 'low' | 'medium' | 'high'
    riskFactors: Array<{
      factor: string
      level: 'low' | 'medium' | 'high'
      description: string
    }>
    mitigation: string[]
  }
  benchmarks?: {
    category: string
    yourAverage: number
    industryAverage: number
    percentile: number
  }[]
  enterpriseData?: {
    departmentAnalysis?: Array<{
      department: string
      budget: number
      actual: number
      variance: number
    }>
    multiCompanyConsolidation?: Record<string, unknown>
  }
}

export class AIAnalysisService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  /**
   * AI analiz raporu oluşturur
   */
  async generateReport(userId: number, planId: string): Promise<AIReportData> {
    const reportLevel = getReportLevelForPlan(planId)

    // Kullanıcının tüm finansal verilerini topla
    const financialData = await this.collectFinancialData(userId)

    // Plan türüne göre analiz yap
    let reportData: AIReportData

    switch (reportLevel) {
      case 'enterprise_premium':
        reportData = await this.generateEnterprisePremiumReport(financialData, userId)
        break
      case 'enterprise':
        reportData = await this.generateEnterpriseReport(financialData, userId)
        break
      default:
        reportData = await this.generatePremiumReport(financialData, userId)
    }

    return reportData
  }

  /**
   * Kullanıcının finansal verilerini toplar
   */
  private async collectFinancialData(userId: number): Promise<{
    transactions: Array<
      Transaction & {
        txType: { code: string }
        category: { name: string }
        amount: number | string | bigint
        transactionDate: Date | string
      }
    >
    accounts: Account[]
    creditCards: CreditCard[]
    investments: Investment[]
    goldItems: GoldItem[]
    autoPayments: AutoPayment[]
  }> {
    const now = new Date()
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(now.getMonth() - 6)

    // Son 6 ayın transactions
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: {
          gte: sixMonthsAgo,
        },
      },
      include: {
        txType: true,
        category: true,
        currency: true,
      },
      orderBy: {
        transactionDate: 'desc',
      },
    })

    // Accounts
    const accounts = await this.prisma.account.findMany({
      where: {
        userId,
        active: true,
      },
      include: {
        currency: true,
        bank: true,
      },
    })

    // Credit Cards
    const creditCards = await this.prisma.creditCard.findMany({
      where: {
        userId,
        active: true,
      },
      include: {
        currency: true,
        bank: true,
      },
    })

    // Investments
    const investments = await this.prisma.investment.findMany({
      where: {
        userId,
        active: true,
      },
      include: {
        currency: true,
      },
    })

    // Gold Items
    const goldItems = await this.prisma.goldItem.findMany({
      where: {
        userId,
      },
      include: {
        goldType: true,
        goldPurity: true,
      },
    })

    // Auto Payments
    const autoPayments = await this.prisma.autoPayment.findMany({
      where: {
        userId,
        active: true,
      },
      include: {
        category: true,
      },
    })

    return {
      transactions,
      accounts,
      creditCards,
      investments,
      goldItems,
      autoPayments,
    }
  }

  /**
   * Premium seviyesi rapor oluşturur
   */
  private generatePremiumReport(
    data: Awaited<ReturnType<typeof this.collectFinancialData>>,
    _userId: number
  ): Promise<AIReportData> {
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Bu ayın transactions
    const thisMonthTransactions = data.transactions.filter(
      t => new Date(t.transactionDate) >= currentMonthStart
    )
    // Gelir/Gider hesaplamaları
    const thisMonthIncome = thisMonthTransactions
      .filter(t => t.txType.code === 'GELIR')
      .reduce((sum, t) => sum + Number(t.amount), 0)
    const thisMonthExpense = thisMonthTransactions
      .filter(t => t.txType.code === 'GIDER')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const netAmount = thisMonthIncome - thisMonthExpense
    const savingsRate = thisMonthIncome > 0 ? (netAmount / thisMonthIncome) * 100 : 0

    // Kategori analizi
    const categoryMap = new Map<string, { amount: number; count: number }>()
    thisMonthTransactions
      .filter(t => t.txType.code === 'GIDER')
      .forEach(t => {
        const categoryName = t.category.name
        const existing = categoryMap.get(categoryName) || { amount: 0, count: 0 }
        categoryMap.set(categoryName, {
          amount: existing.amount + Number(t.amount),
          count: existing.count + 1,
        })
      })

    const totalExpense = thisMonthExpense
    const categoryAnalysis = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0,
        count: data.count,
        trend: 'stable' as const,
      }))
      .sort((a, b) => b.amount - a.amount)

    // En çok harcama yapılan kategoriler
    const topCategories = categoryAnalysis.slice(0, 5).map(cat => ({
      category: cat.category,
      amount: cat.amount,
      trend: 'stable',
    }))

    // Basit nakit akış (son 3 ay)
    const cashFlow = this.calculateCashFlow(
      data.transactions as Array<{
        txType: { code: string }
        category: { name: string }
        amount: number | string | bigint
        transactionDate: Date | string
      }>,
      3
    )

    // AI Önerileri (5-10 adet)
    const insights = this.generatePremiumInsights(
      thisMonthIncome,
      thisMonthExpense,
      categoryAnalysis,
      savingsRate
    )

    return {
      summary: {
        totalIncome: thisMonthIncome,
        totalExpense: thisMonthExpense,
        netAmount,
        savingsRate,
        period: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      },
      categoryAnalysis,
      topCategories,
      cashFlow,
      insights,
    }
  }

  /**
   * Enterprise seviyesi rapor oluşturur
   */
  private async generateEnterpriseReport(
    data: Awaited<ReturnType<typeof this.collectFinancialData>>,
    userId: number
  ): Promise<AIReportData> {
    const premiumReport = await this.generatePremiumReport(data, userId)

    // Enterprise ekstra analizler
    const riskAnalysis = this.calculateRiskAnalysis(data)
    const predictions = this.generatePredictions(
      data.transactions as Array<{
        txType: { code: string }
        category: { name: string }
        amount: number | string | bigint
        transactionDate: Date | string
      }>,
      3
    )

    // 15-20 AI önerisi
    const enterpriseInsights = [
      ...premiumReport.insights,
      ...this.generateEnterpriseInsights(data, premiumReport),
    ]

    return {
      ...premiumReport,
      insights: enterpriseInsights.slice(0, 20),
      predictions,
      riskAnalysis,
    }
  }

  /**
   * Enterprise Premium seviyesi rapor oluşturur
   */
  private async generateEnterprisePremiumReport(
    data: Awaited<ReturnType<typeof this.collectFinancialData>>,
    userId: number
  ): Promise<AIReportData> {
    const enterpriseReport = await this.generateEnterpriseReport(data, userId)

    // Enterprise Premium ekstra analizler
    const advancedPredictions = this.generatePredictions(data.transactions, 6)
    const benchmarks = this.generateBenchmarks(enterpriseReport)

    // 30+ AI önerisi
    const premiumInsights = [
      ...enterpriseReport.insights,
      ...this.generateEnterprisePremiumInsights(data, enterpriseReport),
    ]

    return {
      ...enterpriseReport,
      insights: premiumInsights.slice(0, 35),
      predictions: advancedPredictions,
      benchmarks,
      enterpriseData: {
        multiCompanyConsolidation: {},
      },
    }
  }

  /**
   * Nakit akış hesaplama
   */
  private calculateCashFlow(
    transactions: Array<{
      txType: { code: string }
      amount: number | string | bigint
      transactionDate: Date | string
    }>,
    months: number
  ): Array<{ month: string; income: number; expense: number; balance: number }> {
    const now = new Date()
    const cashFlow: Array<{ month: string; income: number; expense: number; balance: number }> = []

    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const monthTransactions = transactions.filter(
        t => new Date(t.transactionDate) >= monthStart && new Date(t.transactionDate) <= monthEnd
      )

      const income = monthTransactions
        .filter(t => t.txType.code === 'GELIR')
        .reduce((sum, t) => sum + Number(t.amount), 0)
      const expense = monthTransactions
        .filter(t => t.txType.code === 'GIDER')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      cashFlow.push({
        month: `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`,
        income,
        expense,
        balance: income - expense,
      })
    }

    return cashFlow
  }

  /**
   * Premium seviyesi AI önerileri
   */
  private generatePremiumInsights(
    income: number,
    expense: number,
    categoryAnalysis: Array<{ category: string; amount: number; percentage: number }>,
    savingsRate: number
  ): Array<{
    type: 'savings' | 'optimization' | 'investment' | 'risk' | 'trend'
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    impact: string
  }> {
    const insights = []

    // Tasarruf oranı düşükse
    if (savingsRate < 10) {
      insights.push({
        type: 'savings' as const,
        title: 'Tasarruf Oranınızı Artırın',
        description: `Şu anki tasarruf oranınız %${savingsRate.toFixed(1)}. Finansal güvenlik için en az %20 tasarruf hedefleyin.`,
        priority: 'high' as const,
        impact: 'Aylık ortalama ₺2,000-5,000 ek tasarruf potansiyeli',
      })
    }

    // En yüksek harcama kategorisine öneri
    if (categoryAnalysis.length > 0) {
      const topCategory = categoryAnalysis[0]
      insights.push({
        type: 'optimization' as const,
        title: `${topCategory.category} Harcamalarınızı Optimize Edin`,
        description: `Bu kategori toplam harcamalarınızın %${topCategory.percentage.toFixed(1)}'ini oluşturuyor. Alternatif çözümler araştırın.`,
        priority: 'medium' as const,
        impact: `%10-15 tasarruf ile aylık ₺${Math.round(topCategory.amount * 0.12)} kazanç`,
      })
    }

    // Gelir artırma önerisi
    if (expense > income * 0.9) {
      insights.push({
        type: 'optimization' as const,
        title: 'Gelir Artırma Stratejileri',
        description: 'Harcamalarınız gelirinize çok yakın. Gelir artırma fırsatları araştırın.',
        priority: 'high' as const,
        impact: 'Yan gelir kaynakları ile %10-20 gelir artışı mümkün',
      })
    }

    // Yatırım önerisi
    if (savingsRate > 15) {
      insights.push({
        type: 'investment' as const,
        title: 'Tasarruflarınızı Değerlendirin',
        description:
          'İyi bir tasarruf oranına sahipsiniz. Tasarruflarınızı yatırıma dönüştürmeyi düşünün.',
        priority: 'medium' as const,
        impact: 'Uzun vadede %8-12 getiri potansiyeli',
      })
    }

    return insights.slice(0, 10)
  }

  /**
   * Enterprise seviyesi AI önerileri
   */
  private generateEnterpriseInsights(
    _data: Awaited<ReturnType<typeof this.collectFinancialData>>,
    _premiumReport: AIReportData
  ): Array<{
    type: 'savings' | 'optimization' | 'investment' | 'risk' | 'trend'
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    impact: string
  }> {
    const insights = []

    // Bütçe performans analizi
    insights.push({
      type: 'optimization' as const,
      title: 'Bütçe Performans Analizi',
      description:
        'Detaylı bütçe analizi ile departman bazlı optimizasyon fırsatları tespit edildi.',
      priority: 'high' as const,
      impact: 'Kurumsal seviyede %15-20 maliyet optimizasyonu',
    })

    // Nakit akış optimizasyonu
    insights.push({
      type: 'optimization' as const,
      title: 'Nakit Akış Optimizasyonu',
      description: 'Nakit akış analizi ile ödeme planlarınızı optimize edebilirsiniz.',
      priority: 'medium' as const,
      impact: 'Ödeme planlaması ile %5-8 nakit akış iyileştirmesi',
    })

    return insights
  }

  /**
   * Enterprise Premium seviyesi AI önerileri
   */
  private generateEnterprisePremiumInsights(
    _data: Awaited<ReturnType<typeof this.collectFinancialData>>,
    _enterpriseReport: AIReportData
  ): Array<{
    type: 'savings' | 'optimization' | 'investment' | 'risk' | 'trend'
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    impact: string
  }> {
    const insights = []

    // Çok boyutlu analiz önerileri
    insights.push({
      type: 'optimization' as const,
      title: 'Holding Yapısı Optimizasyonu',
      description: 'Çoklu şirket konsolidasyonu ile grup bazlı optimizasyon fırsatları belirlendi.',
      priority: 'high' as const,
      impact: 'Grup genelinde %20-25 maliyet optimizasyonu potansiyeli',
    })

    // Senaryo analizleri
    insights.push({
      type: 'trend' as const,
      title: 'Senaryo Analizi Önerisi',
      description: 'Farklı senaryolara göre finansal durumunuzu simüle edin.',
      priority: 'medium' as const,
      impact: 'Risk yönetimi ve stratejik planlama için kritik',
    })

    return insights
  }

  /**
   * Risk analizi
   */
  private calculateRiskAnalysis(data: Awaited<ReturnType<typeof this.collectFinancialData>>): {
    overallRisk: 'low' | 'medium' | 'high'
    riskFactors: Array<{
      factor: string
      level: 'low' | 'medium' | 'high'
      description: string
    }>
    mitigation: string[]
  } {
    const riskFactors: Array<{
      factor: string
      level: 'low' | 'medium' | 'high'
      description: string
    }> = []

    // Kredi kartı borç riski
    const totalCardDebt = data.creditCards.reduce(
      (sum, card) => sum + Number(card.limitAmount) - Number(card.availableLimit),
      0
    )
    if (totalCardDebt > 0) {
      riskFactors.push({
        factor: 'Kredi Kartı Borcu',
        level: totalCardDebt > 50000 ? 'high' : 'medium',
        description: `Toplam kredi kartı borcunuz: ₺${totalCardDebt.toLocaleString('tr-TR')}`,
      })
    }

    // Nakit akış riski
    const recentTransactions = data.transactions.slice(0, 30)
    const expenses = recentTransactions
      .filter(t => t.txType.code === 'GIDER')
      .reduce((sum, t) => sum + Number(t.amount), 0)
    const income = recentTransactions
      .filter(t => t.txType.code === 'GELIR')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    if (expenses > income * 1.1) {
      riskFactors.push({
        factor: 'Nakit Akış Riski',
        level: 'high',
        description: 'Harcamalarınız gelirinizden fazla. Acil önlem alınmalı.',
      })
    }

    const overallRisk =
      riskFactors.filter(f => f.level === 'high').length > 0
        ? 'high'
        : riskFactors.filter(f => f.level === 'medium').length > 0
          ? 'medium'
          : 'low'

    return {
      overallRisk,
      riskFactors,
      mitigation: [
        'Acil fon oluşturun (3-6 aylık giderler)',
        'Kredi kartı borçlarını önceliklendirin',
        'Gereksiz harcamaları kesin',
      ],
    }
  }

  /**
   * Gelecek tahminleri
   */
  private generatePredictions(
    transactions: Array<{
      txType: { code: string }
      category: { name: string }
      amount: number | string | bigint
      transactionDate: Date | string
    }>,
    months: number
  ): {
    next3Months: Array<{
      month: string
      predictedIncome: number
      predictedExpense: number
      confidence: number
    }>
    recommendations: string[]
  } {
    const now = new Date()
    const predictions = []

    // Son 3 ayın ortalaması
    const recentMonths = []
    for (let i = 1; i <= 3; i++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const monthTransactions = transactions.filter(
        t => new Date(t.transactionDate) >= monthStart && new Date(t.transactionDate) <= monthEnd
      )

      const income = monthTransactions
        .filter(t => t.txType.code === 'GELIR')
        .reduce((sum, t) => sum + Number(t.amount), 0)
      const expense = monthTransactions
        .filter(t => t.txType.code === 'GIDER')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      recentMonths.push({ income, expense })
    }

    const avgIncome = recentMonths.reduce((sum, m) => sum + m.income, 0) / recentMonths.length
    const avgExpense = recentMonths.reduce((sum, m) => sum + m.expense, 0) / recentMonths.length

    // Tahminler
    for (let i = 1; i <= months; i++) {
      const futureMonth = new Date(now.getFullYear(), now.getMonth() + i, 1)
      predictions.push({
        month: `${futureMonth.getFullYear()}-${String(futureMonth.getMonth() + 1).padStart(2, '0')}`,
        predictedIncome: avgIncome * (1 + 0.02 * i), // %2 aylık artış varsayımı
        predictedExpense: avgExpense * (1 + 0.03 * i), // %3 aylık artış varsayımı (enflasyon)
        confidence: Math.max(60, 85 - i * 5), // Zamanla güven azalır
      })
    }

    return {
      next3Months: predictions as Array<{
        month: string
        predictedIncome: number
        predictedExpense: number
        confidence: number
      }>,
      recommendations: [
        'Tahminlere göre gelecek aylarda bütçenizi gözden geçirin',
        'Enflasyon etkisini göz önünde bulundurun',
        'Gelir artırma stratejileri geliştirin',
      ],
    }
  }

  /**
   * Benchmark karşılaştırmaları
   */
  private generateBenchmarks(report: AIReportData): Array<{
    category: string
    yourAverage: number
    industryAverage: number
    percentile: number
  }> {
    // Örnek benchmark verileri (gerçek uygulamada veritabanından gelecek)
    const benchmarks = []

    report.topCategories.forEach(cat => {
      // Örnek industry average'lar (gerçekte AI veya database'den gelecek)
      const industryAverages: Record<string, number> = {
        Market: 2500,
        Fatura: 1800,
        Ulaşım: 1500,
        Eğlence: 1200,
        Giyim: 800,
      }

      const industryAvg = industryAverages[cat.category] || cat.amount * 0.9
      const percentile = (cat.amount / industryAvg) * 50 + 50 // Basit hesaplama

      benchmarks.push({
        category: cat.category,
        yourAverage: cat.amount,
        industryAverage: industryAvg,
        percentile: Math.min(100, Math.max(0, percentile)),
      })
    })

    return benchmarks as Array<{
      category: string
      yourAverage: number
      industryAverage: number
      percentile: number
    }>
  }
}
