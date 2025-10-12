'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/validators'
import { useUser } from '@/lib/user-context'
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  AlertCircle,
  BarChart3,
  Crown,
  Sparkles,
  Award,
  Star,
  User,
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
  assets: {
    totalAccountBalance: string
    totalGoldValue: string
    totalCardDebt: string
    totalAssets: string
    netWorth: string
  }
}

export default function DashboardPage() {
  const { user, loading } = useUser()
  const [data, setData] = useState<DashboardData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      if (loading || !user) {return}

      try {
        setDataLoading(true)
        setError(null)

        const response = await fetch('/api/dashboard', {
          credentials: 'include',
        })

        if (!response.ok) {
          // 401 hatası normaldir (kullanıcı giriş yapmamış)
          if (response.status === 401) {
            setDataLoading(false)
            return
          }
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

    void fetchDashboardData()
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
      {/* User Welcome Card */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Hoş geldin, {user?.name || 'Kullanıcı'}! 👋
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  {user?.plan === 'free' 
                    ? 'Ücretsiz üyelik ile temel özellikler aktif'
                    : user?.plan === 'enterprise' || user?.plan === 'enterprise_premium'
                      ? 'Kurumsal üyelik ile tüm özellikler aktif'
                      : 'Premium üyelik ile tüm özellikler aktif'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Premium Badge */}
              {user && user.plan !== 'free' && (
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                    user.plan === 'enterprise_premium'
                      ? 'bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200'
                      : user.plan === 'enterprise'
                        ? 'bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200'
                        : 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200'
                  }`}
                >
                  {user.plan === 'enterprise_premium' ? (
                    <>
                      <Award className="h-4 w-4 text-amber-600" />
                      <span className="text-amber-700 font-semibold">Kurumsal Premium</span>
                    </>
                  ) : user.plan === 'enterprise' ? (
                    <>
                      <Star className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Kurumsal</span>
                    </>
                  ) : (
                    <>
                      <Crown className="h-4 w-4 text-purple-600" />
                      <span className="text-purple-700 font-semibold">Premium</span>
                    </>
                  )}
                </div>
              )}
              
              {/* Canlı Veri */}
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-slate-600">Canlı veri</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* KPI Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Toplam Gelir</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {formatCurrency(parseFloat(data.kpi.total_income), 'TRY')}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
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
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                {formatCurrency(parseFloat(data.kpi.total_expense), 'TRY')}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Son 30 günde {data.kpi.expense_count} işlem
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Net Durum</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center">
                <span className="text-xl font-bold text-white">₺</span>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent ${
                  parseFloat(data.kpi.net_amount) >= 0
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                    : 'bg-gradient-to-r from-red-600 to-rose-600'
                }`}
              >
                {formatCurrency(parseFloat(data.kpi.net_amount), 'TRY')}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Son 30 gün net sonuç</p>
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
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                {parseInt(data.kpi.income_count) + parseInt(data.kpi.expense_count)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Son 30 günde toplam işlem</p>
            </CardContent>
          </Card>
        </div>

        {/* ✅ TOPLAM VARLIK KARTLARI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Hesap Bakiyeleri</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center">
                <span className="text-xl font-bold text-white">₺</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {formatCurrency(parseFloat(data.assets.totalAccountBalance), 'TRY')}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Tüm banka hesapları</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Altın Değeri</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                {formatCurrency(parseFloat(data.assets.totalGoldValue), 'TRY')}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Altın ve ziynet eşyaları</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Kredi Kartı Borcu</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {formatCurrency(parseFloat(data.assets.totalCardDebt), 'TRY')}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Toplam kart borcu</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Net Varlık</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {formatCurrency(parseFloat(data.assets.netWorth), 'TRY')}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">Varlık - Borçlar</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
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
                  {data.upcomingPayments.map(payment => (
                    <div
                      key={payment.id}
                      className="group p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-slate-50 to-slate-100/50"
                    >
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
                    <div
                      key={index}
                      className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full shadow-sm ${
                            category.tx_type_name === 'Gelir'
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                              : 'bg-gradient-to-br from-red-400 to-rose-500'
                          }`}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {category.category_name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${
                            category.tx_type_name === 'Gelir' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {formatCurrency(parseFloat(category.total_amount), 'TRY')}
                        </p>
                        <p className="text-xs text-slate-500">{category.transaction_count} işlem</p>
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
