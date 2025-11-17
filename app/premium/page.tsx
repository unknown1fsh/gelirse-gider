'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/lib/user-context'
import {
  Crown,
  Check,
  Star,
  Zap,
  Shield,
  Brain,
  BarChart3,
  FileText,
  Target,
  TrendingUp,
  Calendar,
  Activity,
  Lightbulb,
  Bell,
  ArrowLeft,
  CreditCard,
  Lock,
  Sparkles,
  Building2,
  Bot,
  PieChart,
  LineChart,
  Download,
  Upload,
  Settings,
  Palette,
  Headphones,
  Clock,
  Award,
  Rocket,
  Eye,
  Database,
  Cloud,
  Wifi,
  Smartphone,
  Monitor,
  Laptop,
  Globe,
  Users,
  UserCheck,
  Mail,
  MessageSquare,
  Phone,
  Video,
  Camera,
  Mic,
  Volume2,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh,
  Cry,
  Surprised,
  Wink,
  Tongue,
  Kiss,
  Hug,
  Hand,
  Clap,
  Wave,
  Point,
  Fist,
  Peace,
  Ok,
  No,
  Yes,
  Maybe,
  Question,
  Exclamation,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  MinusCircle,
  PlusCircle,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Moon,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Flame,
  Snowflake,
  Umbrella,
  TreePine,
  TreeDeciduous,
  Flower,
  Leaf,
  Sprout,
  Bug,
  Bird,
  Fish,
  Turtle,
  Rabbit,
  Cat,
  Dog,
  Horse,
  Cow,
  Pig,
  Sheep,
  Goat,
  Chicken,
  Duck,
  Bee,
  Butterfly,
  Spider,
  Ant,
  Ladybug,
  Snail,
  Worm,
  Frog,
  Lizard,
  Snake,
  Dragon,
  Unicorn,
  Phoenix,
  Pegasus,
  Mermaid,
  Fairy,
  Elf,
  Dwarf,
  Giant,
  Troll,
  Goblin,
  Orc,
  Wizard,
  Witch,
  Vampire,
  Werewolf,
  Ghost,
  Zombie,
  Skeleton,
  Mummy,
  Demon,
  Angel,
  Devil,
  God,
  Goddess,
  King,
  Queen,
  Prince,
  Princess,
  Knight,
  Warrior,
  Archer,
  Mage,
  Priest,
  Monk,
  Paladin,
  Rogue,
  Assassin,
  Thief,
  Bard,
  Druid,
  Ranger,
  Barbarian,
  Cleric,
  Sorcerer,
  Warlock,
  Necromancer,
  Alchemist,
  Engineer,
  Inventor,
  Scientist,
  Doctor,
  Nurse,
  Teacher,
  Student,
  Artist,
  Musician,
  Writer,
  Poet,
  Actor,
  Director,
  Producer,
  Editor,
  Journalist,
  Reporter,
  Photographer,
  Designer,
  Architect,
  Mechanic,
  Electrician,
  Plumber,
  Carpenter,
  Painter,
  Gardener,
  Chef,
  Baker,
  Waiter,
  Bartender,
  Driver,
  Pilot,
  Captain,
  Sailor,
  Soldier,
  Police,
  Firefighter,
  Paramedic,
  Lawyer,
  Judge,
  Politician,
  President,
  Minister,
  Ambassador,
  Diplomat,
  Spy,
  Detective,
  Investigator,
  Researcher,
  Analyst,
  Consultant,
  Advisor,
  Manager,
  CEO,
  CFO,
  CTO,
  COO,
  VP,
  Chairman,
  Board,
  Committee,
  Team,
  Group,
  Organization,
  Company,
  Corporation,
  Business,
  Enterprise,
  Industry,
  Market,
  Economy,
  Finance,
  Banking,
  Investment,
  Trading,
  Stock,
  Bond,
  Fund,
  Portfolio,
  Asset,
  Liability,
  Equity,
  Revenue,
  Profit,
  Loss,
  Income,
  Expense,
  Budget,
  Cost,
  Price,
  Value,
  Worth,
  Money,
  Cash,
  Credit,
  Debit,
  Account,
  Balance,
  Transaction,
  Payment,
  Invoice,
  Bill,
  Tax,
  Fee,
  Commission,
  Interest,
  Dividend,
  Salary,
  Wage,
  Bonus,
  Tip,
  Gift,
  Donation,
  Charity,
  Fundraising,
  Sponsorship,
  Partnership,
  Collaboration,
  Agreement,
  Contract,
  Deal,
  Offer,
  Proposal,
  Bid,
  Tender,
  Quote,
  Estimate,
  Forecast,
  Prediction,
  Plan,
  Strategy,
  Goal,
  Objective,
  Mission,
  Vision,
  Purpose,
  Reason,
  Cause,
  Effect,
  Result,
  Outcome,
  Success,
  Failure,
  Win,
  Lose,
  Victory,
  Defeat,
  Triumph,
  Achievement,
  Accomplishment,
  Milestone,
  Progress,
  Development,
  Growth,
  Improvement,
  Enhancement,
  Upgrade,
  Update,
  Innovation,
  Invention,
  Discovery,
  Breakthrough,
  Revolution,
  Evolution,
  Transformation,
  Change,
  Transition,
  Shift,
  Move,
  Action,
  Task,
  Job,
  Work,
  Labor,
  Effort,
  Energy,
  Power,
  Force,
  Strength,
  Weakness,
  Advantage,
  Disadvantage,
  Benefit,
  Risk,
  Opportunity,
  Threat,
  Challenge,
  Problem,
  Solution,
  Answer,
  Issue,
  Matter,
  Subject,
  Topic,
  Theme,
  Concept,
  Idea,
  Thought,
  Opinion,
  View,
  Perspective,
  Angle,
  Approach,
  Method,
  Technique,
  Process,
  Procedure,
  System,
  Structure,
  Framework,
  Model,
  Pattern,
  Template,
  Format,
  Style,
  Design,
  Layout,
  Arrangement,
  Organization,
  Management,
  Control,
  Command,
  Order,
  Rule,
  Law,
  Regulation,
  Policy,
  Guideline,
  Standard,
  Criterion,
  Requirement,
  Specification,
  Condition,
  Term,
  Clause,
  Section,
  Chapter,
  Part,
  Component,
  Element,
  Factor,
  Variable,
  Parameter,
  Attribute,
  Property,
  Characteristic,
  Feature,
  Function,
  Capability,
  Ability,
  Skill,
  Talent,
  Quality,
  Trait,
  Behavior,
  Attitude,
  Personality,
  Character,
  Nature,
  Essence,
  Core,
  Heart,
  Soul,
  Spirit,
  Mind,
  Body,
  Physical,
  Mental,
  Emotional,
  Spiritual,
  Psychological,
  Social,
  Cultural,
  Historical,
  Traditional,
  Modern,
  Contemporary,
  Current,
  Present,
  Past,
  Future,
  Time,
  Date,
  Day,
  Week,
  Month,
  Year,
  Century,
  Millennium,
  Era,
  Age,
  Period,
  Duration,
  Length,
  Width,
  Height,
  Depth,
  Size,
  Scale,
  Dimension,
  Measurement,
  Quantity,
  Amount,
  Number,
  Count,
  Total,
  Sum,
  Average,
  Maximum,
  Minimum,
  Range,
  Limit,
  Boundary,
  Edge,
  Border,
  Margin,
  Space,
  Area,
  Region,
  Zone,
  Territory,
  Land,
  Ground,
  Earth,
  World,
  Planet,
  Universe,
  Galaxy,
  Sun,
  Moon,
  Sky,
  Rain,
  Snow,
  Wind,
  Storm,
  Thunder,
  Lightning,
  Fire,
  Water,
  Air,
  Ice,
  Steam,
  Smoke,
  Dust,
  Sand,
  Rock,
  Stone,
  Metal,
  Wood,
  Glass,
  Plastic,
  Rubber,
  Fabric,
  Cloth,
  Leather,
  Paper,
  Cardboard,
  Ceramic,
  Porcelain,
  Crystal,
  Diamond,
  Gold,
  Silver,
  Bronze,
  Copper,
  Iron,
  Steel,
  Aluminum,
  Titanium,
  Platinum,
  Mercury,
  Lead,
  Zinc,
  Nickel,
  Chromium,
  Manganese,
  Silicon,
  Carbon,
  Oxygen,
  Hydrogen,
  Nitrogen,
  Helium,
  Neon,
  Argon,
  Krypton,
  Xenon,
  Radon,
  Uranium,
  Plutonium,
  Radium,
  Polonium,
  Actinium,
  Thorium,
  Protactinium,
  Neptunium,
  Americium,
  Curium,
  Berkelium,
  Californium,
  Einsteinium,
  Fermium,
  Mendelevium,
  Nobelium,
  Lawrencium,
  Rutherfordium,
  Dubnium,
  Seaborgium,
  Bohrium,
  Hassium,
  Meitnerium,
  Darmstadtium,
  Roentgenium,
  Copernicium,
  Nihonium,
  Flerovium,
  Moscovium,
  Livermorium,
  Tennessine,
  Oganesson,
} from 'lucide-react'

export default function PremiumPage() {
  const router = useRouter()
  const { user } = useUser()
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [isProcessing, setIsProcessing] = useState(false)

  const isAlreadyPremium = user?.plan === 'premium'

  const premiumCategories = [
    {
      id: 'ai-analysis',
      title: '🧠 AI & Akıllı Analizler',
      description: 'Yapay zeka teknolojisiyle finansal geleceğinizi şekillendirin. Kişiselleştirilmiş öngörüler ve akıllı analizlerle paranızı daha iyi yönetin, tasarruf fırsatlarını kaçırmayın.',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      features: [
        {
          icon: Brain,
          title: 'AI Finansal Asistan',
          description: '7/24 yanınızda olan kişisel finansal danışmanınız. Harcama alışkanlıklarınızı analiz eder ve size özel stratejiler sunar.',
          color: 'text-purple-600',
        },
        {
          icon: Bot,
          title: 'Otomatik Kategorileme',
          description: 'Her harcamanızı anında doğru kategoriye yerleştirir. Manuel işlem yapmadan finansal durumunuzu takip edin.',
          color: 'text-purple-600',
        },
        {
          icon: TrendingUp,
          title: 'Tahmin Modelleri',
          description: 'Gelecek 3-6 ay için gelir ve harcama tahminleriyle finansal planlamanızı güçlendirin. Beklenmedik durumlara hazırlıklı olun.',
          color: 'text-purple-600',
        },
        {
          icon: Lightbulb,
          title: 'Akıllı Öneriler',
          description: 'Gizli tasarruf fırsatlarını keşfedin ve yatırım önerileriyle paranızın değer kazanmasını sağlayın.',
          color: 'text-purple-600',
        },
      ],
    },
    {
      id: 'advanced-reporting',
      title: '📊 Gelişmiş Raporlama',
      description: 'Finansal verilerinizi görselleştirin ve derinlemesine analiz edin. Profesyonel raporlarla finansal durumunuzu her açıdan görün, kararlarınızı veriye dayandırın.',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      features: [
        {
          icon: BarChart3,
          title: 'İnteraktif Grafikler',
          description: 'Tıklayarak detaylarına inebileceğiniz dinamik grafikler. Finansal verilerinizi görsel olarak keşfedin ve anlamlandırın.',
          color: 'text-blue-600',
        },
        {
          icon: PieChart,
          title: 'Harcama Dağılımı',
          description: 'Paranızın nereye gittiğini net bir şekilde görün. Kategori bazlı detaylı analizlerle harcama alışkanlıklarınızı optimize edin.',
          color: 'text-blue-600',
        },
        {
          icon: LineChart,
          title: 'Trend Analizleri',
          description: 'Gelir ve harcama trendlerinizi zaman içinde izleyin. Büyüme fırsatlarını yakalayın ve riskleri önceden görün.',
          color: 'text-blue-600',
        },
        {
          icon: FileText,
          title: 'PDF/Excel Raporları',
          description: 'Muhasebeci, danışman veya banka için hazır profesyonel raporlar. Tek tıkla indirin ve paylaşın.',
          color: 'text-blue-600',
        },
      ],
    },
    {
      id: 'smart-goals',
      title: '🎯 Akıllı Hedefleme',
      description: 'Hayallerinizi gerçeğe dönüştürün. Akıllı hedef takip sistemiyle tasarruf, yatırım ve finansal bağımsızlık hedeflerinize adım adım ulaşın.',
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      features: [
        {
          icon: Target,
          title: 'Kişisel Hedefler',
          description: 'Ev, araba, tatil veya emeklilik için hedefler belirleyin. Sistem sizin için en uygun planı oluşturur ve ilerlemenizi takip eder.',
          color: 'text-orange-600',
        },
        {
          icon: Calendar,
          title: 'Mevsimsel Analiz',
          description: 'Yaz tatili, bayram alışverişi gibi mevsimsel harcamalarınızı önceden tahmin edin ve bütçenizi buna göre ayarlayın.',
          color: 'text-orange-600',
        },
        {
          icon: Bell,
          title: 'Akıllı Bildirimler',
          description: 'Hedefinize yaklaştığınızda kutlayın, sapma olduğunda uyarı alın. Her zaman rotada kalın.',
          color: 'text-orange-600',
        },
        {
          icon: Award,
          title: 'Başarı Takibi',
          description: 'Her hedefe ulaştığınızda başarı rozetleri kazanın. Motivasyonunuzu yüksek tutun ve finansal başarılarınızı kutlayın.',
          color: 'text-orange-600',
        },
      ],
    },
    {
      id: 'automation',
      title: '⚡ Otomasyon & Verimlilik',
      description: 'Finansal işlemlerinizi otomatikleştirin ve zamandan tasarruf edin. Tekrarlayan görevleri sisteme bırakın, siz sadece kararlarınıza odaklanın.',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      features: [
        {
          icon: Activity,
          title: 'Otomatik Takip',
          description: 'Tüm nakit akışınızı ve harcamalarınızı arka planda izler. Hiçbir işlemi kaçırmadan finansal durumunuzu anlık takip edin.',
          color: 'text-green-600',
        },
        {
          icon: Zap,
          title: 'Akıllı Tekrarlar',
          description: 'Kira, faturalar, abonelikler gibi düzenli ödemeleri otomatik tanır ve kaydeder. Unutma derdi olmadan rahat edin.',
          color: 'text-green-600',
        },
        {
          icon: Clock,
          title: 'Zaman Tasarrufu',
          description: 'Manuel işlemler yerine otomasyon kullanarak haftada saatlerce zaman kazanın. Finansal yönetimi kolaylaştırın.',
          color: 'text-green-600',
        },
        {
          icon: Settings,
          title: 'Özelleştirilebilir',
          description: 'Kendi otomasyon kurallarınızı oluşturun. İhtiyaçlarınıza göre sisteminizi şekillendirin ve maksimum verimlilik sağlayın.',
          color: 'text-green-600',
        },
      ],
    },
    {
      id: 'premium-support',
      title: '🛡️ Premium Destek',
      description: 'Premium üyelikle birlikte öncelikli destek, gelişmiş güvenlik ve özel özellikler. Finansal verileriniz güvende, her zaman yanınızdayız.',
      color: 'from-slate-500 to-gray-600',
      bgColor: 'from-slate-50 to-gray-50',
      borderColor: 'border-slate-200',
      features: [
        {
          icon: Headphones,
          title: '7/24 Premium Destek',
          description: 'Herhangi bir sorunuzda anında yanınızdayız. Öncelikli müşteri hizmetleri ve uzman teknik destek ekibimizle tanışın.',
          color: 'text-slate-600',
        },
        {
          icon: Shield,
          title: 'Gelişmiş Güvenlik',
          description: 'Bankacılık seviyesinde şifreleme ve güvenlik protokolleri. Finansal verileriniz en üst düzey koruma altında.',
          color: 'text-slate-600',
        },
        {
          icon: Palette,
          title: 'Premium Tema',
          description: 'Göz yormayan koyu mod ve ferah açık tema seçenekleri. Arayüzü kendi zevkinize göre özelleştirin.',
          color: 'text-slate-600',
        },
        {
          icon: Cloud,
          title: 'Bulut Yedekleme',
          description: 'Tüm finansal verileriniz otomatik olarak bulutta yedeklenir. Cihaz değiştirseniz bile verileriniz her zaman erişilebilir.',
          color: 'text-slate-600',
        },
      ],
    },
  ]

  const pricingPlans = [
    {
      id: 'free',
      name: 'Ücretsiz',
      price: '0',
      period: 'ay',
      description: 'Temel özellikler',
      features: [
        'Aylık 50 işlem',
        'Temel raporlar',
        'Mobil erişim',
        'E-posta desteği',
        'Temel kategoriler',
      ],
      limitations: ['Sınırlı işlem sayısı', 'Temel raporlar', 'Standart destek'],
      color: 'from-slate-500 to-slate-600',
      popular: false,
      disabled: isAlreadyPremium,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '250',
      period: 'ay',
      description: 'Tüm premium özellikler',
      features: [
        'Sınırsız işlem',
        'AI destekli analizler',
        'Gelişmiş raporlar',
        'Veri dışa aktarma',
        'Akıllı bildirimler',
        'Öncelikli destek',
        'Premium tema',
        'Otomatik yedekleme',
      ],
      limitations: [],
      color: 'from-purple-500 to-pink-600',
      popular: true,
      disabled: isAlreadyPremium,
      savings: 'Yıllık ödeme ile %20 indirim',
    },
    {
      id: 'enterprise',
      name: 'Kurumsal Premium',
      price: '450',
      period: 'ay',
      description: 'İşletmeler için',
      features: [
        'Tüm Premium özellikler',
        'Sınırsız kullanıcı',
        'API erişimi',
        'Özel entegrasyonlar',
        'Dedicated destek',
        'Özel raporlar',
        'Beyaz etiket çözümü',
        'Gelişmiş güvenlik',
      ],
      limitations: [],
      color: 'from-blue-500 to-indigo-600',
      popular: false,
      disabled: isAlreadyPremium,
      custom: 'Özel fiyatlandırma mevcut',
    },
  ]

  const handleUpgrade = async (planId: string = 'premium') => {
    if (isAlreadyPremium) {
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Free plan için direkt dashboard'a git
        if (planId === 'free') {
          router.push('/dashboard?upgraded=true')
          return
        }

        // Premium/Enterprise için PayTR ödeme linkine yönlendir
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        } else {
          throw new Error('Ödeme linki oluşturulamadı')
        }
      } else {
        alert(data.message || 'Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Geri</span>
              </Button>
              <div className="h-6 w-px bg-slate-300" />
              <h1 className="text-xl font-semibold text-slate-900">Premium Üyelik</h1>
            </div>

            {isAlreadyPremium && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200">
                <Crown className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Premium Üye</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200 mb-6">
            <Crown className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Premium Özellikler</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Finansal Yolculuğunuzu
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {' '}
              Yükseltin
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            AI destekli analizler, gelişmiş raporlar ve kişiselleştirilmiş önerilerle finansal
            hedeflerinize daha hızlı ulaşın.
          </p>

          {isAlreadyPremium ? (
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium">Zaten Premium üyesiniz!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2"
              >
                <Star className="h-4 w-4 mr-1" />
                En Popüler
              </Badge>
              <span className="text-slate-600">Sadece 29₺/ay</span>
            </div>
          )}
        </div>

        {/* Categorized Features */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">Premium Özellikler</h2>
          <p className="text-xl text-center text-slate-600 mb-16 max-w-3xl mx-auto">
            Finansal hayatınızı dönüştürecek 5 ana kategori altında düzenlenmiş premium özellikler
          </p>

          <div className="space-y-16">
            {premiumCategories.map((category, categoryIndex) => (
              <div key={category.id} className="relative">
                {/* Category Header */}
                <div className="text-center mb-12">
                  <div
                    className={`inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r ${category.bgColor} rounded-full border-2 ${category.borderColor} mb-6`}
                  >
                    <span className="text-2xl">{category.title.split(' ')[0]}</span>
                    <span className="text-lg font-bold text-slate-900">
                      {category.title.split(' ').slice(1).join(' ')}
                    </span>
                  </div>

                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">{category.description}</p>
                </div>

                {/* Category Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.features.map((feature, featureIndex) => (
                    <Card
                      key={featureIndex}
                      className={`group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:scale-105 ${category.borderColor} hover:border-opacity-50`}
                    >
                      <CardContent className="p-6">
                        <div
                          className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${category.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>

                        <h4 className="font-bold text-slate-900 mb-3 text-lg">{feature.title}</h4>

                        <p className="text-sm text-slate-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Category Separator */}
                {categoryIndex < premiumCategories.length - 1 && (
                  <div className="flex items-center justify-center mt-16">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                    <div className="px-4">
                      <Sparkles className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Pricing Plans */}
        {!isAlreadyPremium && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">Plan Seçin</h2>
            <p className="text-xl text-center text-slate-600 mb-16 max-w-3xl mx-auto">
              İhtiyaçlarınıza en uygun planı seçin ve finansal yolculuğunuza başlayın
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {pricingPlans.map(plan => (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden transition-all duration-300 border-2 ${
                    plan.popular
                      ? 'ring-4 ring-purple-500/50 shadow-2xl scale-105 border-purple-200'
                      : 'hover:shadow-xl border-slate-200'
                  } ${plan.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-102'}`}
                  onClick={() => !plan.disabled && setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 text-sm font-bold rounded-bl-lg">
                      <Star className="h-4 w-4 inline mr-1" />
                      En Popüler
                    </div>
                  )}

                  {plan.savings && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 text-xs font-bold rounded-full">
                      {plan.savings}
                    </div>
                  )}

                  <CardHeader className="text-center pb-6 pt-8">
                    <CardTitle className="text-3xl font-black text-slate-900 mb-2">
                      {plan.name}
                    </CardTitle>

                    <div className="mt-6 mb-4">
                      <span className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {plan.price}₺
                      </span>
                      <span className="text-xl text-slate-600 font-medium">/{plan.period}</span>
                    </div>

                    <CardDescription className="text-lg text-slate-600 font-medium">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-8 pb-8">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                          <span className="text-slate-700 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations && plan.limitations.length > 0 && (
                      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                        <h4 className="text-sm font-bold text-slate-600 mb-2">Sınırlamalar:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="h-1 w-1 bg-slate-400 rounded-full"></div>
                              <span className="text-sm text-slate-500">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {plan.custom && (
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-bold text-blue-700">{plan.custom}</p>
                      </div>
                    )}

                    {plan.id === 'premium' && (
                      <Button
                        onClick={handleUpgrade}
                        disabled={isProcessing}
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isProcessing ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>İşleniyor...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <Crown className="h-5 w-5" />
                            <span>Premium'a Yükselt</span>
                          </div>
                        )}
                      </Button>
                    )}

                    {plan.id === 'enterprise' && (
                      <Button
                        onClick={() => handleUpgrade('enterprise')}
                        disabled={isProcessing}
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isProcessing ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>İşleniyor...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-5 w-5" />
                            <span>Enterprise'a Yükselt</span>
                          </div>
                        )}
                      </Button>
                    )}

                    {plan.id === 'free' && (
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-4 text-lg"
                        disabled
                      >
                        <div className="flex items-center space-x-3">
                          <Lock className="h-5 w-5" />
                          <span>Mevcut Plan</span>
                        </div>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        {!isAlreadyPremium && (
          <div className="text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Hemen Başlayın</h3>
                </div>

                <p className="text-slate-600 mb-6">
                  Premium üyeliğinizle birlikte tüm gelişmiş özelliklere anında erişim sağlayın.
                </p>

                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={handleUpgrade}
                    disabled={isProcessing}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>İşleniyor...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Crown className="h-5 w-5" />
                        <span>Premium'a Yükselt</span>
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
