'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  TrendingUp,
  Shield,
  Smartphone,
  BarChart3,
  CreditCard,
  Calendar,
  Coins,
  Sparkles,
  Check,
  Star,
  Crown,
  Zap,
  Target,
  PieChart,
  Wallet,
  Bell,
  Lock,
  Globe,
  Download,
  ArrowRight,
  Play,
  Users,
  Award,
  Clock,
  Heart,
  Gift,
  Rocket,
  Infinity,
  Brain,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [activePlan, setActivePlan] = useState('premium')

  const features = [
    {
      icon: BarChart3,
      title: 'Gelişmiş Analizler',
      description: 'Detaylı finansal raporlar ve trend analizleri',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: CreditCard,
      title: 'Kredi Kartı Yönetimi',
      description: 'Tüm kartlarınızı tek yerden yönetin',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Calendar,
      title: 'Otomatik Ödemeler',
      description: 'Tekrarlayan ödemeleri otomatik takip edin',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: Coins,
      title: 'Altın ve Yatırım',
      description: 'Altın fiyatları ve yatırım portföyü',
      color: 'from-yellow-500 to-amber-600',
    },
    {
      icon: Shield,
      title: 'Güvenli Veri',
      description: 'End-to-end şifreleme ile güvenli saklama',
      color: 'from-red-500 to-rose-600',
    },
    {
      icon: Smartphone,
      title: 'Mobil Uyumlu',
      description: 'Her cihazdan erişim imkanı',
      color: 'from-indigo-500 to-blue-600',
    },
  ]

  const premiumFeatures = [
    {
      icon: Infinity,
      title: 'Sınırsız İşlem',
      description: 'İstediğiniz kadar gelir-gider kaydı',
      color: 'text-purple-600',
    },
    {
      icon: BarChart3,
      title: 'Gelişmiş Raporlar',
      description: 'Detaylı analiz ve öngörüler',
      color: 'text-blue-600',
    },
    {
      icon: Zap,
      title: 'Hızlı İşlemler',
      description: 'Premium hız ve performans',
      color: 'text-yellow-600',
    },
    {
      icon: Crown,
      title: 'Öncelikli Destek',
      description: '7/24 premium müşteri desteği',
      color: 'text-orange-600',
    },
    {
      icon: Download,
      title: 'Veri Dışa Aktarma',
      description: 'Excel, PDF formatlarında raporlar',
      color: 'text-green-600',
    },
    {
      icon: Bell,
      title: 'Akıllı Bildirimler',
      description: 'Kişiselleştirilmiş uyarılar',
      color: 'text-pink-600',
    },
  ]

  const pricingPlans = [
    {
      name: 'Ücretsiz',
      price: '0',
      period: 'ay',
      description: 'Bireysel kullanıcılar için',
      features: [
        'Aylık 50 işlem',
        'Temel raporlar',
        'Mobil erişim',
        'E-posta desteği',
        'Kişisel bütçe takibi',
        'Temel analizler',
      ],
      color: 'from-slate-500 to-slate-600',
      popular: false,
    },
    {
      name: 'Premium',
      price: '250',
      period: 'ay',
      description: 'Bireysel kullanıcılar için',
      features: [
        'Sınırsız işlem',
        'Gelişmiş analizler',
        'Öncelikli destek',
        'Veri dışa aktarma',
        'Akıllı bildirimler',
        'Premium tema',
        'Yatırım takibi',
        'Hedef belirleme',
      ],
      color: 'from-purple-500 to-pink-600',
      popular: true,
    },
    {
      name: 'Kurumsal',
      price: '450',
      period: 'ay',
      description: 'Şirketler ve tüzel kişilikler için',
      features: [
        'Tüm Premium özellikler',
        'Sınırsız kullanıcı hesabı',
        'Şirket bazlı raporlama',
        'Muhasebe entegrasyonu',
        'Vergi raporları',
        'Çoklu şube desteği',
        'API erişimi',
        'Özel entegrasyonlar',
        'Dedicated destek',
        'Özel raporlar',
      ],
      color: 'from-blue-500 to-indigo-600',
      popular: false,
    },
    {
      name: 'Kurumsal Premium',
      price: '1000',
      period: 'ay',
      description: 'Büyük şirketler ve holdingler için',
      features: [
        'Tüm Kurumsal özellikler',
        '8 farklı hesap türü',
        '5 premium kredi kartı',
        'Uluslararası işlemler',
        'AI destekli analizler',
        'Blockchain entegrasyonu',
        'IoT ve akıllı sistemler',
        'Siber güvenlik paketi',
        '7/24 VIP destek',
        'Özel danışman ataması',
        'Özel raporlama',
        'API limiti yok',
        'Holding yapısı desteği',
        'Çoklu şirket yönetimi',
        'Konsolide raporlama',
      ],
      color: 'from-amber-500 to-orange-600',
      popular: false,
      ultra: true,
    },
  ]

  const stats = [
    { number: '50K+', label: 'Aktif Kullanıcı', icon: Users },
    { number: '1M+', label: 'İşlem Kaydı', icon: TrendingUp },
    { number: '99.9%', label: 'Uptime', icon: Shield },
    { number: '4.9/5', label: 'Kullanıcı Puanı', icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  <span className="text-2xl font-bold text-white">₺</span>
                </div>
                <span className="text-white font-medium">GiderSE-Gelir</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Finansal
              </span>
              <br />
              <span className="text-white">Özgürlüğünüz</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Gelir ve giderlerinizi akıllıca yönetin, finansal hedeflerinize ulaşın.
              <span className="text-purple-400 font-semibold"> Premium özellikler</span> ile
              finansal hayatınızı kontrol altına alın.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl"
                onClick={() => router.push('/auth/register')}
              >
                <Rocket className="h-5 w-5 mr-2" />
                Ücretsiz Başla
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
                onClick={() => router.push('/auth/login')}
              >
                <Play className="h-5 w-5 mr-2" />
                Giriş Yap
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <Icon className="h-6 w-6 text-purple-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Neden{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                GiderSE-Gelir
              </span>
              ?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Modern finansal yönetim araçları ile hayatınızı kolaylaştırın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-300">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Premium Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full px-6 py-3 border border-purple-500/30 mb-6">
              <Crown className="h-5 w-5 text-purple-400" />
              <span className="text-purple-400 font-semibold">Premium Üyelik</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Premium
              </span>{' '}
              ile
              <br />
              Finansal Kontrolünüzü Artırın
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Gelişmiş özellikler, sınırsız işlem ve öncelikli destek ile finansal hedeflerinize
              daha hızlı ulaşın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {premiumFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className={`p-2 rounded-lg bg-white/10 ${feature.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-slate-300 text-sm">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl"
              onClick={() => router.push('/auth/register')}
            >
              <Crown className="h-5 w-5 mr-2" />
              Premium'a Geç
            </Button>
          </div>
        </div>
      </div>

      {/* Kurumsal Premium Section */}
      <div className="py-20 bg-gradient-to-r from-amber-600/10 to-orange-600/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-full px-6 py-3 border border-amber-500/30 mb-6">
              <Award className="h-5 w-5 text-amber-400" />
              <span className="text-amber-400 font-semibold">Kurumsal Premium</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Kurumsal Premium
              </span>{' '}
              ile
              <br />
              Büyük Şirketler için Ultra Lüks Yönetim
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Holdingler, büyük şirketler ve tüzel kişilikler için tasarlanmış ultra lüks finansal
              yönetim platformu. AI, Blockchain, IoT ve siber güvenlik teknolojileri ile donatılmış.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl border border-amber-500/30 hover:bg-amber-500/30 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">8 Hesap Türü</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Ana operasyon, yatırım portföyü, uluslararası işlemler ve daha fazlası
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl border border-amber-500/30 hover:bg-amber-500/30 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">5 Premium Kart</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Black Diamond, Executive Platinum, Corporate Elite ve daha fazlası
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl border border-amber-500/30 hover:bg-amber-500/30 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Uluslararası</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Çoklu para birimi, global transferler ve uluslararası işlemler
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl border border-amber-500/30 hover:bg-amber-500/30 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI Teknolojisi</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Yapay zeka destekli analizler, tahminler ve öneriler
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 bg-gradient-to-br from-amber-500/10 to-orange-600/10 backdrop-blur-sm rounded-2xl border border-amber-500/20">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Rocket className="h-6 w-6 text-amber-400 mr-3" />
                Teknoloji Paketi
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-amber-400" />
                  <span className="text-slate-300">Blockchain entegrasyonu</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-amber-400" />
                  <span className="text-slate-300">IoT ve akıllı sistemler</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-amber-400" />
                  <span className="text-slate-300">Siber güvenlik paketi</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-amber-400" />
                  <span className="text-slate-300">API limiti yok</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-amber-500/10 to-orange-600/10 backdrop-blur-sm rounded-2xl border border-amber-500/20">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Award className="h-6 w-6 text-amber-400 mr-3" />
                VIP Hizmetler
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-amber-400" />
                  <span className="text-slate-300">7/24 VIP destek</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-amber-400" />
                  <span className="text-slate-300">Özel danışman ataması</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-amber-400" />
                  <span className="text-slate-300">Özel raporlama</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-amber-400" />
                  <span className="text-slate-300">Öncelikli işlemler</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl"
              onClick={() => router.push('/enterprise')}
            >
              <Award className="h-5 w-5 mr-2" />
              Kurumsal Premium'u Keşfet
            </Button>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Size Uygun{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Planı
              </span>{' '}
              Seçin
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              <span className="text-purple-400 font-semibold">Bireysel kullanıcılar</span> için
              Ücretsiz ve Premium planlar,
              <span className="text-blue-400 font-semibold">
                {' '}
                şirketler ve tüzel kişilikler
              </span>{' '}
              için Kurumsal planlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => {
              return (
                <Card
                  key={index}
                  className={`relative bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 ${
                    plan.popular ? 'ring-2 ring-purple-500/50 scale-105' : ''
                  } ${plan.ultra ? 'ring-2 ring-amber-500/50 scale-110' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        En Popüler
                      </div>
                    </div>
                  )}
                  {plan.ultra && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Ultra Lüks
                      </div>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-white">₺{plan.price}</span>
                      <span className="text-slate-400">/{plan.period}</span>
                    </div>
                    <CardDescription className="text-slate-300 mt-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                          : plan.ultra
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                      onClick={() => router.push('/auth/register')}
                    >
                      {plan.name === 'Ücretsiz' ? 'Ücretsiz Başla' : 'Planı Seç'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-12 border border-purple-500/30">
            <h2 className="text-4xl font-bold text-white mb-4">
              Finansal Geleceğinizi{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Bugün
              </span>{' '}
              Şekillendirin
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Binlerce kullanıcı zaten finansal özgürlüklerine kavuştu. Sıra sizde!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl"
                onClick={() => router.push('/auth/register')}
              >
                <Rocket className="h-5 w-5 mr-2" />
                Hemen Başla
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
                onClick={() => router.push('/auth/login')}
              >
                <Play className="h-5 w-5 mr-2" />
                Giriş Yap
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-3xl font-bold text-white">₺</span>
              </div>
              <span className="text-2xl font-bold text-white">GiderSE-Gelir</span>
            </div>
            <p className="text-slate-400 mb-4">Finansal özgürlüğünüz için güvenilir partneriniz</p>
            <div className="flex justify-center space-x-6 text-sm text-slate-400">
              <span>© 2024 GiderSE-Gelir</span>
              <span>•</span>
              <span>Gizlilik Politikası</span>
              <span>•</span>
              <span>Kullanım Şartları</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
