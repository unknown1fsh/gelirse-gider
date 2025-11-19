'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PremiumUpgradeModal from '@/components/premium-upgrade-modal'
import { useUser } from '@/lib/user-context'
import { isPremiumPlan } from '@/lib/plan-config'
import {
  Building2,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Shield,
  Star,
  Crown,
  Sparkles,
  Globe,
  Layers,
  Coins,
  Bell,
  ArrowLeft,
  Home,
} from 'lucide-react'

interface Investment {
  id: string
  type: 'stock' | 'fund' | 'bond' | 'crypto' | 'commodity' | 'forex' | 'real-estate' | 'other'
  name: string
  symbol: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  totalValue: number
  profitLoss: number
  profitLossPercentage: number
  purchaseDate: string
  lastUpdate: string
  description?: string
  category: string
  riskLevel: 'low' | 'medium' | 'high'
  status: 'active' | 'sold' | 'pending'
}

const investmentTypes = [
  {
    id: 'stock',
    name: 'Hisse Senetleri',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-600',
    description: 'Borsa hisseleri ve şirket payları',
    riskLevel: 'medium',
    popularity: 95,
  },
  {
    id: 'fund',
    name: 'Yatırım Fonları',
    icon: PieChart,
    color: 'from-blue-500 to-indigo-600',
    description: 'Profesyonel yönetilen yatırım fonları',
    riskLevel: 'low',
    popularity: 85,
  },
  {
    id: 'bond',
    name: 'Tahvil ve Bonolar',
    icon: Shield,
    color: 'from-purple-500 to-violet-600',
    description: 'Devlet ve kurumsal tahvilleri',
    riskLevel: 'low',
    popularity: 70,
  },
  {
    id: 'crypto',
    name: 'Kripto Paralar',
    icon: Coins,
    color: 'from-yellow-500 to-orange-600',
    description: 'Bitcoin, Ethereum ve diğer kripto paralar',
    riskLevel: 'high',
    popularity: 90,
  },
  {
    id: 'commodity',
    name: 'Emtialar',
    icon: Layers,
    color: 'from-amber-500 to-yellow-600',
    description: 'Altın, gümüş, petrol ve diğer emtialar',
    riskLevel: 'medium',
    popularity: 75,
  },
  {
    id: 'forex',
    name: 'Döviz',
    icon: Globe,
    color: 'from-cyan-500 to-blue-600',
    description: 'USD, EUR ve diğer döviz kurları',
    riskLevel: 'high',
    popularity: 80,
  },
  {
    id: 'real-estate',
    name: 'Gayrimenkul',
    icon: Building2,
    color: 'from-red-500 to-rose-600',
    description: "Emlak yatırımları ve REIT'ler",
    riskLevel: 'medium',
    popularity: 65,
  },
  {
    id: 'other',
    name: 'Diğer Araçlar',
    icon: Star,
    color: 'from-pink-500 to-purple-600',
    description: 'Vadeli işlemler, opsiyonlar ve diğer araçlar',
    riskLevel: 'high',
    popularity: 45,
  },
]

export default function InvestmentsPage() {
  const router = useRouter()
  const { user, loading: userLoading, refreshUser } = useUser()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [activeTab, setActiveTab] = useState('portfolio')

  // Plan değişikliklerini dinle
  useEffect(() => {
    const handlePlanChange = () => {
      void refreshUser()
    }

    window.addEventListener('plan-changed', handlePlanChange)
    return () => {
      window.removeEventListener('plan-changed', handlePlanChange)
    }
  }, [refreshUser])

  // Gerçek yatırım verilerini getir
  useEffect(() => {
    if (userLoading) {
      return
    }

    async function fetchInvestments() {
      const currentPlan = user?.plan || 'free'
      const isPremium = isPremiumPlan(currentPlan)

      if (!isPremium) {
        // Free kullanıcı - demo veriler göster
        const demoInvestments: Investment[] = [
          {
            id: '1',
            type: 'stock',
            name: 'Apple Inc.',
            symbol: 'AAPL',
            quantity: 10,
            purchasePrice: 150.0,
            currentPrice: 175.5,
            totalValue: 1755.0,
            profitLoss: 255.0,
            profitLossPercentage: 17.0,
            purchaseDate: '2024-01-15',
            lastUpdate: '2024-06-30',
            category: 'Teknoloji',
            riskLevel: 'medium',
            status: 'active',
          },
          {
            id: '2',
            type: 'crypto',
            name: 'Bitcoin',
            symbol: 'BTC',
            quantity: 0.5,
            purchasePrice: 45000.0,
            currentPrice: 67500.0,
            totalValue: 33750.0,
            profitLoss: 11250.0,
            profitLossPercentage: 50.0,
            purchaseDate: '2024-02-10',
            lastUpdate: '2024-06-30',
            category: 'Kripto',
            riskLevel: 'high',
            status: 'active',
          },
          {
            id: '3',
            type: 'fund',
            name: 'Borsa İstanbul 100 Fonu',
            symbol: 'BIST100',
            quantity: 1000,
            purchasePrice: 12.5,
            currentPrice: 14.75,
            totalValue: 14750.0,
            profitLoss: 2250.0,
            profitLossPercentage: 18.0,
            purchaseDate: '2024-03-05',
            lastUpdate: '2024-06-30',
            category: 'Hisse Senedi Fonu',
            riskLevel: 'medium',
            status: 'active',
          },
        ]

        setInvestments(demoInvestments)
        setIsLoading(false)
      } else {
        // Premium kullanıcı - gerçek veriler getir
        try {
          const response = await fetch('/api/investments', { credentials: 'include' })
          if (response.ok) {
            const data = (await response.json()) as Investment[]
            setInvestments(data)
          }
        } catch (error) {
          console.error('Yatırımlar alınamadı:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    void fetchInvestments()
  }, [user?.plan, userLoading, user])

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch =
      investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || investment.type === selectedType
    return matchesSearch && matchesType
  })

  const totalValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0)
  const totalProfitLoss = investments.reduce((sum, inv) => sum + inv.profitLoss, 0)
  const totalProfitLossPercentage =
    totalValue > 0 ? (totalProfitLoss / (totalValue - totalProfitLoss)) * 100 : 0

  const getTypeInfo = (type: string) => {
    return investmentTypes.find(t => t.id === type) || investmentTypes[7]
  }

  const handleAddInvestment = (investmentType: string) => {
    const currentPlan = user?.plan || 'free'
    const isPremium =
      currentPlan === 'premium' ||
      currentPlan === 'enterprise' ||
      currentPlan === 'enterprise_premium'

    if (!isPremium) {
      setShowPremiumModal(true)
    } else {
      // Premium kullanıcı - doğrudan ekleme sayfasına git
      router.push(`/investments/${investmentType}/new`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Yatırım portföyü yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Link
                href="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4">🚀 Yatırım Araçları</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Profesyonel yatırım portföyünüzü yönetin. Hisse senetleri, fonlar, kripto paralar ve
              daha fazlası!
            </p>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    ₺{totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-blue-100">Toplam Değer</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div
                    className={`text-3xl font-bold mb-2 flex items-center justify-center ${
                      totalProfitLoss >= 0 ? 'text-green-300' : 'text-red-300'
                    }`}
                  >
                    {totalProfitLoss >= 0 ? (
                      <TrendingUp className="h-6 w-6 mr-1" />
                    ) : (
                      <TrendingDown className="h-6 w-6 mr-1" />
                    )}
                    ₺
                    {Math.abs(totalProfitLoss).toLocaleString('tr-TR', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-blue-100">Kar/Zarar</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      totalProfitLossPercentage >= 0 ? 'text-green-300' : 'text-red-300'
                    }`}
                  >
                    {totalProfitLossPercentage >= 0 ? '+' : ''}
                    {totalProfitLossPercentage.toFixed(1)}%
                  </div>
                  <div className="text-blue-100">Getiri Oranı</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Investment Types Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">💎 Yatırım Araçları</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Çeşitli yatırım araçları ile portföyünüzü çeşitlendirin ve riskinizi dağıtın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentTypes.map(type => {
              const Icon = type.icon
              return (
                <Card
                  key={type.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-300"
                  onClick={() => setSelectedType(selectedType === type.id ? 'all' : type.id)}
                >
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${type.color} mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{type.name}</h3>
                    <p className="text-gray-600 mb-4">{type.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <Badge
                        variant={
                          type.riskLevel === 'low'
                            ? 'default'
                            : type.riskLevel === 'medium'
                              ? 'secondary'
                              : 'destructive'
                        }
                        className="text-xs"
                      >
                        {type.riskLevel === 'low'
                          ? 'Düşük Risk'
                          : type.riskLevel === 'medium'
                            ? 'Orta Risk'
                            : 'Yüksek Risk'}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        {type.popularity}%
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      onClick={e => {
                        e.stopPropagation()
                        handleAddInvestment(type.id)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Yatırım Ekle
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Portfolio Management */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="portfolio" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Portföy</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analiz</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Piyasa</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Haberler</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Yatırım ara..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Tüm Türler" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Türler</SelectItem>
                      {investmentTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => handleAddInvestment('stock')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Yatırım
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Investments List */}
            <div className="grid gap-6">
              {filteredInvestments.map(investment => {
                const typeInfo = getTypeInfo(investment.type)
                const Icon = typeInfo.icon
                return (
                  <Card
                    key={investment.id}
                    className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${typeInfo.color}`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{investment.name}</h3>
                            <p className="text-gray-600">
                              {investment.symbol} • {investment.category}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {investment.quantity} adet
                              </Badge>
                              <Badge
                                variant={
                                  investment.riskLevel === 'low'
                                    ? 'default'
                                    : investment.riskLevel === 'medium'
                                      ? 'secondary'
                                      : 'destructive'
                                }
                                className="text-xs"
                              >
                                {investment.riskLevel === 'low'
                                  ? 'Düşük Risk'
                                  : investment.riskLevel === 'medium'
                                    ? 'Orta Risk'
                                    : 'Yüksek Risk'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800 mb-1">
                            ₺
                            {investment.totalValue.toLocaleString('tr-TR', {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          <div
                            className={`flex items-center justify-end space-x-1 ${
                              investment.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {investment.profitLoss >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            <span className="font-semibold">
                              ₺
                              {Math.abs(investment.profitLoss).toLocaleString('tr-TR', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                            <span className="text-sm">
                              ({investment.profitLoss >= 0 ? '+' : ''}
                              {investment.profitLossPercentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Alış: ₺
                            {investment.purchasePrice.toLocaleString('tr-TR', {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {filteredInvestments.length === 0 && (
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Henüz yatırım bulunmuyor
                    </h3>
                    <p className="text-gray-500 mb-6">
                      İlk yatırımınızı ekleyerek portföyünüzü oluşturmaya başlayın
                    </p>
                    <Button
                      onClick={() => handleAddInvestment('stock')}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      İlk Yatırımımı Ekle
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">📊 Gelişmiş Analiz</h3>
                  <p className="text-gray-600 mb-6">
                    Premium üyelik ile detaylı portföy analizleri, risk hesaplamaları ve performans
                    raporlarına erişin
                  </p>
                  <Button
                    onClick={() => setShowPremiumModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Premium Analizlere Eriş
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center">
                  <Activity className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    📈 Canlı Piyasa Verileri
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Gerçek zamanlı piyasa verileri, fiyat hareketleri ve teknik analizler
                  </p>
                  <Button
                    onClick={() => setShowPremiumModal(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Canlı Verilere Eriş
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center">
                  <Bell className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">📰 Yatırım Haberleri</h3>
                  <p className="text-gray-600 mb-6">
                    Kişiselleştirilmiş haber akışı, piyasa analizleri ve yatırım önerileri
                  </p>
                  <Button
                    onClick={() => setShowPremiumModal(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Premium Haberlere Eriş
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        featureName="Gelişmiş Yatırım Araçları"
        limitInfo={{
          current: investments.length,
          limit: 5,
          type: 'analysis',
        }}
      />
    </div>
  )
}
