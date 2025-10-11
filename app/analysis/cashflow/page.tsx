'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePremium } from '@/lib/use-premium'
import { useUser } from '@/lib/user-context'
import PremiumUpgradeModal from '@/components/premium-upgrade-modal'
import {
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  FileText,
  Settings,
  Lightbulb,
  Sparkles,
  Award,
  Star,
  ArrowRight,
  Plus,
  Minus,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Home,
  X,
  MessageSquare,
  Crown,
  Bell,
  Download,
  Eye,
  Share2,
} from 'lucide-react'

interface CashFlowData {
  totalIncome: number
  totalExpenses: number
  netCashFlow: number
  monthlyTrend: number
  categories: {
    name: string
    amount: number
    percentage: number
    trend: number
  }[]
}

interface PremiumFeature {
  id: string
  title: string
  description: string
  icon: any
  gradient: string
  performance: string
  action: string
  onClick: () => void
}

export default function CashFlowAnalysis() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [cashFlowData, setCashFlowData] = useState<CashFlowData | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [premiumFeatureName, setPremiumFeatureName] = useState('')
  const { handlePremiumFeature } = usePremium()
  const { user } = useUser()

  // Kullanıcı tipi tespiti
  const isEnterpriseUser =
    user?.email?.includes('enterprise') || user?.plan === 'enterprise_premium'
  const isIndividualUser = user?.email?.includes('demo') || user?.plan === 'premium'

  // Veri yükleme
  useEffect(() => {
    async function fetchCashFlowData() {
      try {
        const response = await fetch('/api/analysis/cashflow')
        if (response.ok) {
          const data = await response.json()
          setCashFlowData(data)
        } else if (response.status === 403) {
          // Premium gerektiriyor
          const error = await response.json()
          setPremiumFeatureName('Gelişmiş Nakit Akışı Analizi')
          setShowPremiumModal(true)
        }
      } catch (error) {
        console.error('Nakit akışı verileri yüklenirken hata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCashFlowData()
  }, [])

  const handleBack = () => {
    router.back()
  }

  const handleHome = () => {
    router.push('/dashboard')
  }

  // Şahıs Premium özellikler
  const individualPremiumFeatures: PremiumFeature[] = [
    {
      id: 'income-boost',
      title: 'Gelir Artır',
      description: 'AI destekli gelir artırma stratejileri',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      performance: '+15%',
      action: 'Strateji Oluştur',
      onClick: () => handlePremiumFeature('Gelir Artır', () => setSelectedFeature('income-boost')),
    },
    {
      id: 'savings-plan',
      title: 'Tasarruf Planı',
      description: 'Kişiselleştirilmiş tasarruf optimizasyonu',
      icon: Target,
      gradient: 'from-blue-500 to-cyan-600',
      performance: '-20%',
      action: 'Plan Oluştur',
      onClick: () =>
        handlePremiumFeature('Tasarruf Planı', () => setSelectedFeature('savings-plan')),
    },
    {
      id: 'ai-advice',
      title: 'AI Önerileri',
      description: 'Yapay zeka destekli finansal danışmanlık',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-600',
      performance: 'AI',
      action: 'Danışmanlık Al',
      onClick: () => handlePremiumFeature('AI Önerileri', () => setSelectedFeature('ai-advice')),
    },
    {
      id: 'report-download',
      title: 'Rapor İndir',
      description: 'Premium nakit akışı analiz raporu',
      icon: FileText,
      gradient: 'from-orange-500 to-red-600',
      performance: 'PDF',
      action: 'Rapor Oluştur',
      onClick: () =>
        handlePremiumFeature('Rapor İndir', () => setSelectedFeature('report-download')),
    },
    {
      id: 'auto-tracking',
      title: 'Otomatik Takip',
      description: 'Nakit akışı otomatik izleme',
      icon: Activity,
      gradient: 'from-indigo-500 to-purple-600',
      performance: 'Auto',
      action: 'Hedef Belirle',
      onClick: () =>
        handlePremiumFeature('Otomatik Takip', () => setSelectedFeature('auto-tracking')),
    },
    {
      id: 'smart-goals',
      title: 'Akıllı Hedef',
      description: 'Akıllı hedef belirleme',
      icon: Target,
      gradient: 'from-green-500 to-emerald-600',
      performance: 'Smart',
      action: 'Hedef Belirle',
      onClick: () => handlePremiumFeature('Akıllı Hedef', () => setSelectedFeature('smart-goals')),
    },
    {
      id: 'daily-tips',
      title: 'Günlük İpuçları',
      description: 'Günlük finansal ipuçları',
      icon: Lightbulb,
      gradient: 'from-yellow-500 to-orange-600',
      performance: 'Tips',
      action: 'İpuçları',
      onClick: () =>
        handlePremiumFeature('Günlük İpuçları', () => setSelectedFeature('daily-tips')),
    },
  ]

  // Kurumsal Premium özellikler
  const enterprisePremiumFeatures: PremiumFeature[] = [
    {
      id: 'revenue-optimization',
      title: 'Gelir Optimizasyonu',
      description: 'AI destekli kurumsal gelir artırma stratejileri',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      performance: '+25%',
      action: 'Strateji Oluştur',
      onClick: () =>
        handlePremiumFeature('Gelir Optimizasyonu', () =>
          setSelectedFeature('revenue-optimization')
        ),
    },
    {
      id: 'cost-optimization',
      title: 'Maliyet Optimizasyonu',
      description: 'Kurumsal maliyet azaltma ve verimlilik stratejileri',
      icon: Target,
      gradient: 'from-blue-500 to-cyan-600',
      performance: '-35%',
      action: 'Plan Oluştur',
      onClick: () =>
        handlePremiumFeature('Maliyet Optimizasyonu', () =>
          setSelectedFeature('cost-optimization')
        ),
    },
    {
      id: 'enterprise-ai',
      title: 'Enterprise AI',
      description: 'Kurumsal AI destekli finansal danışmanlık ve analiz',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-600',
      performance: 'AI',
      action: 'Danışmanlık Al',
      onClick: () =>
        handlePremiumFeature('Enterprise AI', () => setSelectedFeature('enterprise-ai')),
    },
    {
      id: 'enterprise-reports',
      title: 'Enterprise Raporlar',
      description: 'Kurumsal nakit akışı analiz raporları ve dashboard',
      icon: FileText,
      gradient: 'from-orange-500 to-red-600',
      performance: 'PDF',
      action: 'Rapor Oluştur',
      onClick: () =>
        handlePremiumFeature('Enterprise Raporlar', () => setSelectedFeature('enterprise-reports')),
    },
    {
      id: 'enterprise-automation',
      title: 'Enterprise Otomasyon',
      description: 'Kurumsal nakit akışı otomatik izleme ve yönetim',
      icon: Activity,
      gradient: 'from-indigo-500 to-purple-600',
      performance: 'Auto',
      action: 'Hedef Belirle',
      onClick: () =>
        handlePremiumFeature('Enterprise Otomasyon', () =>
          setSelectedFeature('enterprise-automation')
        ),
    },
    {
      id: 'enterprise-goals',
      title: 'Kurumsal Hedefler',
      description: 'AI destekli kurumsal hedef belirleme ve takip',
      icon: Target,
      gradient: 'from-green-500 to-emerald-600',
      performance: 'Smart',
      action: 'Hedef Belirle',
      onClick: () =>
        handlePremiumFeature('Kurumsal Hedefler', () => setSelectedFeature('enterprise-goals')),
    },
    {
      id: 'enterprise-insights',
      title: 'Kurumsal İçgörüler',
      description: 'AI destekli kurumsal finansal içgörüler ve öneriler',
      icon: Lightbulb,
      gradient: 'from-yellow-500 to-orange-600',
      performance: 'AI',
      action: 'İçgörüler',
      onClick: () =>
        handlePremiumFeature('Kurumsal İçgörüler', () => setSelectedFeature('enterprise-insights')),
    },
  ]

  // Kullanıcı tipine göre premium özellikleri seç
  const premiumFeatures = isEnterpriseUser ? enterprisePremiumFeatures : individualPremiumFeatures

  // Modal render fonksiyonu
  const renderModal = () => {
    if (!selectedFeature) {return null}

    const feature = premiumFeatures.find(f => f.id === selectedFeature)
    if (!feature) {return null}

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className={`h-2 bg-gradient-to-r ${feature.gradient} rounded-t-2xl`} />

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} text-white`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{feature.title}</h2>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFeature(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Şahıs Premium Modalları */}
            {selectedFeature === 'income-boost' && <IncomeBoostModal />}

            {selectedFeature === 'savings-plan' && <SavingsPlanModal />}

            {selectedFeature === 'ai-advice' && <AIAdviceModal />}

            {selectedFeature === 'report-download' && <ReportDownloadModal />}

            {selectedFeature === 'auto-tracking' && <AutoTrackingModal />}

            {selectedFeature === 'smart-goals' && <SmartGoalsModal />}

            {selectedFeature === 'daily-tips' && <DailyTipsModal />}

            {/* Kurumsal Premium Modalları */}
            {selectedFeature === 'revenue-optimization' && <RevenueOptimizationModal />}

            {selectedFeature === 'cost-optimization' && <CostOptimizationModal />}

            {selectedFeature === 'enterprise-ai' && <EnterpriseAIModal />}

            {selectedFeature === 'enterprise-reports' && <EnterpriseReportsModal />}

            {selectedFeature === 'enterprise-automation' && <EnterpriseAutomationModal />}

            {selectedFeature === 'enterprise-goals' && <EnterpriseGoalsModal />}

            {selectedFeature === 'enterprise-insights' && <EnterpriseInsightsModal />}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleHome}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Home className="w-4 h-4" />
              Anasayfa
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEnterpriseUser ? 'Kurumsal Nakit Akışı Analizi' : 'Nakit Akışı Analizi'}
              </h1>
              <p className="text-gray-600">
                {isEnterpriseUser
                  ? 'Enterprise AI destekli kurumsal nakit akışı yönetimi'
                  : 'Premium AI destekli nakit akışı yönetimi'}
              </p>
            </div>
          </div>
        </div>

        {/* Premium Aksiyonlar */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Crown className="w-6 h-6 text-yellow-500" />
              {isEnterpriseUser ? 'Kurumsal Premium Aksiyonlar' : 'Premium Aksiyonlar'}
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
              >
                {isEnterpriseUser ? 'Enterprise AI' : 'AI Destekli'}
              </Badge>
            </CardTitle>
            <p className="text-gray-600">
              {isEnterpriseUser
                ? 'Kurumsal nakit akışınızı optimize etmek için Enterprise AI destekli öneriler'
                : 'Nakit akışınızı iyileştirmek için AI destekli premium öneriler'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {premiumFeatures.map(feature => (
                <div
                  key={feature.id}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${feature.gradient} p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                  onClick={feature.onClick}
                >
                  {/* Performance Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {feature.performance}
                    </Badge>
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="text-white">
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/90 mb-4">{feature.description}</p>

                    {/* Action Button */}
                    <Button
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                    >
                      {feature.action}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ana Analiz Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-green-700">₺45,230</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-500 text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Toplam Gider</p>
                  <p className="text-2xl font-bold text-red-700">₺32,180</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -8.2%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-500 text-white">
                  <TrendingDown className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Net Nakit Akışı</p>
                  <p className="text-2xl font-bold text-blue-700">₺13,050</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <ArrowRight className="w-3 h-3 mr-1" />
                    +25.3%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  <span className="text-2xl font-bold">₺</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Aylık Trend</p>
                  <p className="text-2xl font-bold text-purple-700">Pozitif</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    +18.7%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-500 text-white">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kategori Analizi */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" />
              Kategori Bazlı Analiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(isEnterpriseUser
                ? [
                    {
                      name: 'Operasyonel Giderler',
                      amount: 8500,
                      percentage: 26.4,
                      trend: 5.2,
                      color: 'from-red-400 to-red-600',
                    },
                    {
                      name: 'Lojistik & Ulaştırma',
                      amount: 6200,
                      percentage: 19.3,
                      trend: -2.1,
                      color: 'from-blue-400 to-blue-600',
                    },
                    {
                      name: 'Pazarlama & Reklam',
                      amount: 4800,
                      percentage: 14.9,
                      trend: 8.7,
                      color: 'from-purple-400 to-purple-600',
                    },
                    {
                      name: 'İnsan Kaynakları',
                      amount: 3200,
                      percentage: 9.9,
                      trend: 12.3,
                      color: 'from-green-400 to-green-600',
                    },
                    {
                      name: 'Teknoloji & IT',
                      amount: 9480,
                      percentage: 29.5,
                      trend: -1.8,
                      color: 'from-gray-400 to-gray-600',
                    },
                  ]
                : [
                    {
                      name: 'Gıda & İçecek',
                      amount: 8500,
                      percentage: 26.4,
                      trend: 5.2,
                      color: 'from-red-400 to-red-600',
                    },
                    {
                      name: 'Ulaşım',
                      amount: 6200,
                      percentage: 19.3,
                      trend: -2.1,
                      color: 'from-blue-400 to-blue-600',
                    },
                    {
                      name: 'Eğlence',
                      amount: 4800,
                      percentage: 14.9,
                      trend: 8.7,
                      color: 'from-purple-400 to-purple-600',
                    },
                    {
                      name: 'Sağlık',
                      amount: 3200,
                      percentage: 9.9,
                      trend: 12.3,
                      color: 'from-green-400 to-green-600',
                    },
                    {
                      name: 'Diğer',
                      amount: 9480,
                      percentage: 29.5,
                      trend: -1.8,
                      color: 'from-gray-400 to-gray-600',
                    },
                  ]
              ).map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${category.color}`} />
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600">₺{category.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">%{category.percentage}</p>
                      <p
                        className={`text-sm flex items-center ${category.trend > 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {category.trend > 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        %{Math.abs(category.trend)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Render */}
      {renderModal()}

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        featureName={premiumFeatureName}
        limitInfo={{
          current: 0,
          limit: 0,
          type: 'analysis',
        }}
      />
    </div>
  )
}

// Modal Components - Şahıs Premium
function IncomeBoostModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
        <h3 className="text-lg font-bold text-emerald-800 mb-3">💰 Gelir Artırma Stratejileri</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700">Freelance projeler için portföy oluştur</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700">Yatırım portföyünü çeşitlendir</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700">Ek gelir kaynakları araştır</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Strateji Oluştur
        </Button>
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Detaylı Analiz
        </Button>
      </div>
    </div>
  )
}

function SavingsPlanModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-bold text-blue-800 mb-3">🎯 Tasarruf Optimizasyonu</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700">Gereksiz abonelikleri iptal et</span>
          </div>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700">Otomatik tasarruf planı kur</span>
          </div>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700">Alışveriş alışkanlıklarını optimize et</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
          <Settings className="w-4 h-4 mr-2" />
          Plan Oluştur
        </Button>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Takvim Görünümü
        </Button>
      </div>
    </div>
  )
}

function AIAdviceModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <h3 className="text-lg font-bold text-purple-800 mb-3">🤖 AI Finansal Danışmanlık</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700">Kişiselleştirilmiş yatırım önerileri</span>
          </div>
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700">Risk analizi ve portföy optimizasyonu</span>
          </div>
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700">24/7 finansal rehberlik</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <MessageSquare className="w-4 h-4 mr-2" />
          Danışmanlık Al
        </Button>
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Örnek Analizler
        </Button>
      </div>
    </div>
  )
}

function ReportDownloadModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
        <h3 className="text-lg font-bold text-orange-800 mb-3">📊 Premium Rapor Seçenekleri</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700">Detaylı nakit akışı analizi</span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700">Excel ve PDF formatları</span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700">Grafik ve görselleştirmeler</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Rapor Oluştur
        </Button>
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Paylaş
        </Button>
      </div>
    </div>
  )
}

function AutoTrackingModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
        <h3 className="text-lg font-bold text-indigo-800 mb-3">⚡ Otomatik İzleme</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700">Gerçek zamanlı nakit akışı takibi</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700">Otomatik bildirimler</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700">Hedef takibi ve uyarılar</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <Settings className="w-4 h-4 mr-2" />
          Hedef Belirle
        </Button>
        <Button variant="outline">
          <Bell className="w-4 h-4 mr-2" />
          Bildirim Ayarları
        </Button>
      </div>
    </div>
  )
}

function SmartGoalsModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-3">🎯 Akıllı Hedef Belirleme</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-green-700">SMART hedef metodolojisi</span>
          </div>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-green-700">İlerleme takibi</span>
          </div>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-green-700">Motivasyon ve ödül sistemi</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Hedef Belirle
        </Button>
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          İlerleme Görünümü
        </Button>
      </div>
    </div>
  )
}

function DailyTipsModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
        <h3 className="text-lg font-bold text-yellow-800 mb-3">💡 Günlük Finansal İpuçları</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700">Kişiselleştirilmiş finansal ipuçları</span>
          </div>
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700">Günlük bildirimler</span>
          </div>
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700">Pratik uygulama önerileri</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
          <Bell className="w-4 h-4 mr-2" />
          İpuçları Aktif Et
        </Button>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Takvim Görünümü
        </Button>
      </div>
    </div>
  )
}

// Modal Components - Kurumsal Premium
function RevenueOptimizationModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
        <h3 className="text-lg font-bold text-emerald-800 mb-3">💰 Kurumsal Gelir Optimizasyonu</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700">Pazar genişletme stratejileri geliştir</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700">
              Müşteri segmentasyonu ve fiyatlandırma optimizasyonu
            </span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700">Yeni iş modelleri ve gelir kaynakları</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Strateji Oluştur
        </Button>
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Detaylı Analiz
        </Button>
      </div>
    </div>
  )
}

function CostOptimizationModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-bold text-blue-800 mb-3">🎯 Kurumsal Maliyet Optimizasyonu</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700">Operasyonel maliyetleri analiz et ve azalt</span>
          </div>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700">Tedarik zinciri optimizasyonu</span>
          </div>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700">Enerji ve kaynak verimliliği artır</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
          <Settings className="w-4 h-4 mr-2" />
          Plan Oluştur
        </Button>
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Analiz Et
        </Button>
      </div>
    </div>
  )
}

function EnterpriseAIModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <h3 className="text-lg font-bold text-purple-800 mb-3">🤖 Enterprise AI Danışmanlık</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700">Kurumsal finansal strateji önerileri</span>
          </div>
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700">Risk analizi ve kurumsal portföy optimizasyonu</span>
          </div>
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700">24/7 kurumsal finansal rehberlik</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <MessageSquare className="w-4 h-4 mr-2" />
          Danışmanlık Al
        </Button>
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Örnek Analizler
        </Button>
      </div>
    </div>
  )
}

function EnterpriseReportsModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
        <h3 className="text-lg font-bold text-orange-800 mb-3">📊 Enterprise Rapor Seçenekleri</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700">Kurumsal nakit akışı analizi ve dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700">CEO/CFO seviyesi raporlar</span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700">KPI ve performans metrikleri</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Rapor Oluştur
        </Button>
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Paylaş
        </Button>
      </div>
    </div>
  )
}

function EnterpriseAutomationModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
        <h3 className="text-lg font-bold text-indigo-800 mb-3">⚡ Enterprise Otomasyon</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700">Kurumsal nakit akışı otomatik izleme</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700">RPA ve iş süreci otomasyonu</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700">Kurumsal hedef takibi ve uyarılar</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <Settings className="w-4 h-4 mr-2" />
          Hedef Belirle
        </Button>
        <Button variant="outline">
          <Bell className="w-4 h-4 mr-2" />
          Bildirim Ayarları
        </Button>
      </div>
    </div>
  )
}

function EnterpriseGoalsModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-3">🎯 Kurumsal Hedef Belirleme</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-green-700">Kurumsal KPI ve OKR metodolojisi</span>
          </div>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-green-700">Departman bazlı hedef takibi</span>
          </div>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-green-700">Performans değerlendirme sistemi</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Hedef Belirle
        </Button>
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          İlerleme Görünümü
        </Button>
      </div>
    </div>
  )
}

function EnterpriseInsightsModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
        <h3 className="text-lg font-bold text-yellow-800 mb-3">💡 Kurumsal Finansal İçgörüler</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700">AI destekli kurumsal finansal öneriler</span>
          </div>
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700">Pazar trendleri ve fırsat analizleri</span>
          </div>
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700">Kurumsal strateji önerileri</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
          <Bell className="w-4 h-4 mr-2" />
          İçgörüleri Aktif Et
        </Button>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Takvim Görünümü
        </Button>
      </div>
    </div>
  )
}
