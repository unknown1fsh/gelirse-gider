'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/validators'
import UserWelcomeSection from '@/components/user-welcome'
import { useUser } from '@/lib/user-context'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Calendar,
  AlertCircle,
  BarChart3,
  Crown,
  Sparkles,
  Award,
  Star
} from 'lucide-react'

interface DashboardData {
  kpi: {
    total_income: string
    total_expense: string
    net_amount: string
    income_count: string
    expense_count: string
  }
  upcomingPayments: Array<{
    id: number
    name: string
    bank_name: string
    limit_amount: string
    available_limit: string
    due_day: number
    next_due_date: string
    current_debt: string
    min_payment: string
  }>
  categoryBreakdown: Array<{
    category_name: string
    tx_type_name: string
    total_amount: string
    transaction_count: string
  }>
}

export default function DashboardPage() {
  const { user, loading } = useUser()
  const [data, setData] = useState<DashboardData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      if (loading || !user) return

      try {
        setDataLoading(true)
        setError(null)
        
        const response = await fetch('/api/dashboard', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Dashboard verileri alınamadı')
        }
        
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        console.error('Dashboard data fetch error:', err)
        setError('Dashboard verileri yüklenirken bir hata oluştu')
      } finally {
        setDataLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, loading])

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">{error || 'Dashboard verileri yüklenemedi'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Finansal durumunuzun genel görünümü
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Premium Badge */}
              {user && user.plan !== 'free' && (
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  user.plan === 'enterprise_premium'
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 border border-amber-500/30'
                    : user.plan === 'enterprise'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 border border-emerald-500/30'
                    : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 border border-purple-500/30'
                }`}>
                  {user.plan === 'enterprise_premium' ? (
                    <>
                      <Award className="h-3 w-3" />
                      <span>Kurumsal Premium</span>
                    </>
                  ) : user.plan === 'enterprise' ? (
                    <>
                      <Star className="h-3 w-3" />
                      <span>Kurumsal</span>
                    </>
                  ) : (
                    <>
                      <Crown className="h-3 w-3" />
                      <span>Premium</span>
                    </>
                  )}
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-slate-600">Canlı veri</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Welcome Section */}
      <UserWelcomeSection />

      <div className="p-8 space-y-8">

        {/* KPI Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Toplam Gelir</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {formatCurrency(parseFloat(data.kpi.total_income), 'TRY')}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Son 30 günde {data.kpi.income_count} işlem
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Toplam Gider</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingDown className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                {formatCurrency(parseFloat(data.kpi.total_expense), 'TRY')}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Son 30 günde {data.kpi.expense_count} işlem
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Net Durum</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold bg-clip-text text-transparent ${
                parseFloat(data.kpi.net_amount) >= 0 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                  : 'bg-gradient-to-r from-red-600 to-rose-600'
              }`}>
                {formatCurrency(parseFloat(data.kpi.net_amount), 'TRY')}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Son 30 gün net sonuç
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Toplam İşlem</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg group-hover:scale-110 transition-transform">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                {parseInt(data.kpi.income_count) + parseInt(data.kpi.expense_count)}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Son 30 günde toplam işlem
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Yaklaşan Ödemeler */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-md">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                Yaklaşan Ödemeler
              </CardTitle>
              <CardDescription className="text-slate-600">
                Kredi kartı ödeme tarihleri
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {data.upcomingPayments.length > 0 ? (
                <div className="space-y-4">
                  {data.upcomingPayments.map((payment) => (
                    <div key={payment.id} className="group p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{payment.name}</p>
                          <p className="text-sm text-slate-600">{payment.bank_name}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Vade: {payment.due_day}. gün
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-red-600">
                            {formatCurrency(parseFloat(payment.current_debt), 'TRY')}
                          </p>
                          <p className="text-xs text-slate-500">
                            Min: {formatCurrency(parseFloat(payment.min_payment), 'TRY')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Yaklaşan ödeme bulunmuyor</p>
                  <p className="text-sm text-slate-400 mt-1">Tüm ödemeleriniz güncel</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Kategori Dağılımı */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                Kategori Dağılımı
              </CardTitle>
              <CardDescription className="text-slate-600">
                Son 30 gün kategori bazlı harcamalar
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {data.categoryBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {data.categoryBreakdown.slice(0, 8).map((category, index) => (
                    <div key={index} className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full shadow-sm ${
                          category.tx_type_name === 'Gelir' 
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                            : 'bg-gradient-to-br from-red-400 to-rose-500'
                        }`} />
                        <span className="text-sm font-medium text-slate-700">{category.category_name}</span>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${
                          category.tx_type_name === 'Gelir' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {formatCurrency(parseFloat(category.total_amount), 'TRY')}
                        </p>
                        <p className="text-xs text-slate-500">
                          {category.transaction_count} işlem
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Kategori verisi bulunmuyor</p>
                  <p className="text-sm text-slate-400 mt-1">Henüz işlem kaydı yok</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

