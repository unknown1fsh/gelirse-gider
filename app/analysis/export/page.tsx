'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePremium } from '@/lib/use-premium'
import { useUser } from '@/lib/user-context'
import PremiumUpgradeModal from '@/components/premium-upgrade-modal'
import {
  Download,
  FileText,
  Share2,
  Settings,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Plus,
  Minus,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Lightbulb,
  Sparkles,
  Zap,
  Award,
  Star,
  Edit3,
  Trash2,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  Bell,
  Gift,
  Crown,
  Diamond,
  Rocket,
  Shield,
  Lock,
  Unlock,
  Maximize2,
  Minimize2,
  X,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Globe,
  Wifi,
  Battery,
  Signal,
  WifiOff,
  BatteryLow,
  SignalZero,
  AlertTriangle,
  Check,
  XCircle,
  HelpCircle,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Menu,
  MoreHorizontal,
  MoreVertical,
  PlusCircle,
  MinusCircle,
  XCircle as XCircleIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  Star as StarIcon,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  Tag,
  Folder,
  FolderOpen,
  File,
  Image,
  Video,
  Music,
  Archive,
  Trash,
  Recycle,
  Save,
  Copy,
  Paste,
  Cut,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List as ListIcon,
  Indent,
  Outdent,
  Quote,
  Code,
  Link,
  Unlink,
  Table,
  Columns,
  Rows,
  Cell,
  Merge,
  Split,
  Border,
  Fill,
  Color,
  Palette,
  Brush,
  Eraser,
  Crop,
  Rotate,
  Flip,
  Mirror,
  ZoomIn,
  ZoomOut,
  Fit,
  Fullscreen,
  Minimize,
  Close,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight as ArrowRightIcon,
  Home,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  Move,
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Maximize,
  Minimize as MinimizeIcon,
  Maximize2 as Maximize2Icon,
  Minimize2 as Minimize2Icon,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Star as StarShape,
  Heart as HeartShape,
  Diamond as DiamondShape,
  Spade,
  Club,
  Flower,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Timer,
  Stopwatch,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarSearch,
  CalendarClock,
  CalendarHeart,
  CalendarStar,
  CalendarDollar,
  CalendarEuro,
  CalendarPound,
  CalendarYen,
  CalendarRuble,
  CalendarRupee,
  CalendarWon,
  CalendarYuan,
  CalendarReal,
  CalendarPeso,
  CalendarFranc,
  CalendarLira,
  CalendarKrona,
  CalendarKoruna,
  CalendarForint,
  CalendarZloty,
  CalendarLeu,
  CalendarLev,
  CalendarKuna,
  CalendarDinar,
  CalendarDirham,
  CalendarShekel,
  CalendarRiyal,
  CalendarDinar as CalendarDinarIcon,
  CalendarDirham as CalendarDirhamIcon,
  CalendarShekel as CalendarShekelIcon,
  CalendarRiyal as CalendarRiyalIcon,
  CalendarDinar as CalendarDinarIcon2,
  CalendarDirham as CalendarDirhamIcon2,
  CalendarShekel as CalendarShekelIcon2,
  CalendarRiyal as CalendarRiyalIcon2,
} from 'lucide-react'

interface ExportData {
  type: string
  format: string
  size: string
  lastGenerated: string
  status: 'ready' | 'generating' | 'error'
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

export default function ExportAnalysis() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const { handlePremiumFeature } = usePremium()
  const { user } = useUser()

  // Kullanıcı tipi tespiti
  const isEnterpriseUser =
    user?.email?.includes('enterprise') || user?.plan === 'enterprise_premium'
  const isIndividualUser = user?.email?.includes('demo') || user?.plan === 'premium'

  const handleBack = () => {
    router.back()
  }

  const handleHome = () => {
    router.push('/dashboard')
  }

  // Premium özellikler
  // Şahıs Premium özellikler
  const individualPremiumFeatures: PremiumFeature[] = [
    {
      id: 'quick-export',
      title: 'Hızlı Export',
      description: 'Tek tıkla tüm raporları dışa aktar',
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-600',
      performance: 'Quick',
      action: 'Export Başlat',
      onClick: () => handlePremiumFeature('Hızlı Export', () => setSelectedFeature('quick-export')),
    },
    {
      id: 'custom-reports',
      title: 'Özel Raporlar',
      description: 'Kişiselleştirilmiş rapor şablonları',
      icon: FileText,
      gradient: 'from-green-500 to-emerald-600',
      performance: 'Custom',
      action: 'Şablon Oluştur',
      onClick: () =>
        handlePremiumFeature('Özel Raporlar', () => setSelectedFeature('custom-reports')),
    },
    {
      id: 'scheduled-exports',
      title: 'Otomatik Export',
      description: 'Zamanlanmış otomatik rapor oluşturma',
      icon: Calendar,
      gradient: 'from-purple-500 to-pink-600',
      performance: 'Auto',
      action: 'Zamanla',
      onClick: () =>
        handlePremiumFeature('Otomatik Export', () => setSelectedFeature('scheduled-exports')),
    },
    {
      id: 'multi-format',
      title: 'Çoklu Format',
      description: 'Excel, PDF, CSV ve daha fazlası',
      icon: Download,
      gradient: 'from-orange-500 to-red-600',
      performance: 'Multi',
      action: 'Format Seç',
      onClick: () => handlePremiumFeature('Çoklu Format', () => setSelectedFeature('multi-format')),
    },
    {
      id: 'secure-sharing',
      title: 'Güvenli Paylaşım',
      description: 'Şifreli ve güvenli dosya paylaşımı',
      icon: Shield,
      gradient: 'from-indigo-500 to-purple-600',
      performance: 'Secure',
      action: 'Paylaşım Ayarla',
      onClick: () => setSelectedFeature('secure-sharing'),
    },
    {
      id: 'cloud-sync',
      title: 'Bulut Senkronizasyonu',
      description: 'Otomatik bulut yedekleme ve senkronizasyon',
      icon: Globe,
      gradient: 'from-teal-500 to-cyan-600',
      performance: 'Cloud',
      action: 'Senkronize Et',
      onClick: () => setSelectedFeature('cloud-sync'),
    },
    {
      id: 'advanced-analytics',
      title: 'Gelişmiş Analitik',
      description: 'Derinlemesine analitik raporlar',
      icon: BarChart3,
      gradient: 'from-pink-500 to-rose-600',
      performance: 'Advanced',
      action: 'Analitik Oluştur',
      onClick: () => setSelectedFeature('advanced-analytics'),
    },
  ]

  // Kurumsal Premium özellikler
  const enterprisePremiumFeatures: PremiumFeature[] = [
    {
      id: 'enterprise-export',
      title: 'Kurumsal Export',
      description: 'Tek tıkla kurumsal raporları dışa aktar',
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-600',
      performance: 'Quick',
      action: 'Export Başlat',
      onClick: () =>
        handlePremiumFeature('Kurumsal Export', () => setSelectedFeature('enterprise-export')),
    },
    {
      id: 'enterprise-reports',
      title: 'Kurumsal Raporlar',
      description: 'Kurumsal rapor şablonları ve dashboard',
      icon: FileText,
      gradient: 'from-green-500 to-emerald-600',
      performance: 'Custom',
      action: 'Şablon Oluştur',
      onClick: () =>
        handlePremiumFeature('Kurumsal Raporlar', () => setSelectedFeature('enterprise-reports')),
    },
    {
      id: 'enterprise-automation',
      title: 'Kurumsal Otomasyon',
      description: 'Zamanlanmış kurumsal otomatik rapor oluşturma',
      icon: Calendar,
      gradient: 'from-purple-500 to-pink-600',
      performance: 'Auto',
      action: 'Zamanla',
      onClick: () =>
        handlePremiumFeature('Kurumsal Otomasyon', () =>
          setSelectedFeature('enterprise-automation')
        ),
    },
    {
      id: 'enterprise-formats',
      title: 'Kurumsal Formatlar',
      description: 'Kurumsal Excel, PDF, CSV ve API formatları',
      icon: Download,
      gradient: 'from-orange-500 to-red-600',
      performance: 'Multi',
      action: 'Format Seç',
      onClick: () =>
        handlePremiumFeature('Kurumsal Formatlar', () => setSelectedFeature('enterprise-formats')),
    },
    {
      id: 'enterprise-security',
      title: 'Kurumsal Güvenlik',
      description: 'Enterprise şifreli ve güvenli dosya paylaşımı',
      icon: Shield,
      gradient: 'from-indigo-500 to-purple-600',
      performance: 'Secure',
      action: 'Paylaşım Ayarla',
      onClick: () => setSelectedFeature('enterprise-security'),
    },
    {
      id: 'enterprise-cloud',
      title: 'Kurumsal Bulut',
      description: 'Kurumsal bulut yedekleme ve senkronizasyon',
      icon: Globe,
      gradient: 'from-teal-500 to-cyan-600',
      performance: 'Cloud',
      action: 'Senkronize Et',
      onClick: () => setSelectedFeature('enterprise-cloud'),
    },
    {
      id: 'enterprise-analytics',
      title: 'Kurumsal Analitik',
      description: 'Derinlemesine kurumsal analitik raporlar',
      icon: BarChart3,
      gradient: 'from-pink-500 to-rose-600',
      performance: 'Advanced',
      action: 'Analitik Oluştur',
      onClick: () => setSelectedFeature('enterprise-analytics'),
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

            {selectedFeature === 'quick-export' && <QuickExportModal />}

            {selectedFeature === 'custom-reports' && <CustomReportsModal />}

            {selectedFeature === 'scheduled-exports' && <ScheduledExportsModal />}

            {selectedFeature === 'multi-format' && <MultiFormatModal />}

            {selectedFeature === 'secure-sharing' && <SecureSharingModal />}

            {selectedFeature === 'cloud-sync' && <CloudSyncModal />}

            {selectedFeature === 'advanced-analytics' && <AdvancedAnalyticsModal />}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <Download className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEnterpriseUser ? 'Kurumsal Export & Raporlar' : 'Export & Raporlar'}
                </h1>
                <p className="text-gray-600">
                  {isEnterpriseUser
                    ? 'Enterprise rapor oluşturma ve paylaşım seçenekleri'
                    : 'Premium rapor oluşturma ve paylaşım seçenekleri'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Geri
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleHome}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Anasayfa
              </Button>
            </div>
          </div>
        </div>

        {/* Premium Aksiyonlar */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Crown className="w-6 h-6 text-yellow-500" />
              {isEnterpriseUser
                ? 'Kurumsal Premium Export Aksiyonları'
                : 'Premium Export Aksiyonları'}
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-orange-400 to-red-500 text-white"
              >
                {isEnterpriseUser ? 'Enterprise' : 'Premium'}
              </Badge>
            </CardTitle>
            <p className="text-gray-600">
              {isEnterpriseUser
                ? 'Kurumsal hızlı rapor oluşturma ve paylaşım seçenekleri'
                : 'Hızlı rapor oluşturma ve paylaşım seçenekleri'}
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

        {/* Hızlı Export Seçenekleri */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-blue-600">PDF Rapor</p>
                  <p className="text-2xl font-bold text-blue-700">Hazır</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    2.3 MB
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-500 text-white">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                <Download className="w-4 h-4 mr-2" />
                İndir
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-green-600">Excel Dosyası</p>
                  <p className="text-2xl font-bold text-green-700">Hazır</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    1.8 MB
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-500 text-white">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <Download className="w-4 h-4 mr-2" />
                İndir
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-purple-600">CSV Veri</p>
                  <p className="text-2xl font-bold text-purple-700">Hazır</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    0.9 MB
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-500 text-white">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                <Download className="w-4 h-4 mr-2" />
                İndir
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-orange-600">JSON API</p>
                  <p className="text-2xl font-bold text-orange-700">Hazır</p>
                  <p className="text-xs text-orange-600 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    1.2 MB
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-500 text-white">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <Download className="w-4 h-4 mr-2" />
                İndir
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Son Export Geçmişi */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Son Export Geçmişi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: 'Tam Finansal Rapor',
                  format: 'PDF',
                  size: '2.3 MB',
                  lastGenerated: '2 saat önce',
                  status: 'ready',
                },
                {
                  type: 'Kategori Analizi',
                  format: 'Excel',
                  size: '1.8 MB',
                  lastGenerated: '1 gün önce',
                  status: 'ready',
                },
                {
                  type: 'Trend Analizi',
                  format: 'PDF',
                  size: '1.5 MB',
                  lastGenerated: '3 gün önce',
                  status: 'ready',
                },
                {
                  type: 'Nakit Akış Raporu',
                  format: 'CSV',
                  size: '0.9 MB',
                  lastGenerated: '1 hafta önce',
                  status: 'ready',
                },
                {
                  type: 'Yatırım Analizi',
                  format: 'PDF',
                  size: '2.1 MB',
                  lastGenerated: '2 hafta önce',
                  status: 'ready',
                },
              ].map((exportItem, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{exportItem.type}</p>
                      <p className="text-sm text-gray-600">
                        {exportItem.format} • {exportItem.size} • {exportItem.lastGenerated}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={exportItem.status === 'ready' ? 'secondary' : 'destructive'}
                      className={
                        exportItem.status === 'ready'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }
                    >
                      {exportItem.status === 'ready' ? 'Hazır' : 'Hata'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export İstatistikleri */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              Export İstatistikleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <h3 className="font-bold text-blue-800 mb-3">📊 Toplam Export</h3>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-blue-700">247</p>
                  <p className="text-sm text-blue-600">Bu ay oluşturulan rapor</p>
                  <Badge className="bg-blue-100 text-blue-700">+23% Artış</Badge>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h3 className="font-bold text-green-800 mb-3">💾 Toplam Boyut</h3>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-green-700">12.4 GB</p>
                  <p className="text-sm text-green-600">Toplam export boyutu</p>
                  <Badge className="bg-green-100 text-green-700">+8.5% Artış</Badge>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <h3 className="font-bold text-purple-800 mb-3">🎯 Başarı Oranı</h3>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-purple-700">%98.7</p>
                  <p className="text-sm text-purple-600">Başarılı export oranı</p>
                  <Badge className="bg-purple-100 text-purple-700">Mükemmel</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Render */}
      {renderModal()}
    </div>
  )
}

// Modal Components
function QuickExportModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-bold text-blue-800 mb-3">⚡ Hızlı Export</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700">Tek tıkla tüm raporları dışa aktar</span>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700">Otomatik format seçimi</span>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700">Toplu indirme</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
          <Zap className="w-4 h-4 mr-2" />
          Export Başlat
        </Button>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Ayarları Düzenle
        </Button>
      </div>
    </div>
  )
}

function CustomReportsModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-3">📋 Özel Rapor Şablonları</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="text-green-700">Kişiselleştirilmiş şablonlar</span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="text-green-700">Özel grafik ve görselleştirmeler</span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="text-green-700">Şablon kütüphanesi</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Şablon Oluştur
        </Button>
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Şablonları Gör
        </Button>
      </div>
    </div>
  )
}

function ScheduledExportsModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <h3 className="text-lg font-bold text-purple-800 mb-3">📅 Otomatik Export</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700">Zamanlanmış otomatik raporlar</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700">E-posta ile gönderim</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700">Bulut yedekleme</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <Calendar className="w-4 h-4 mr-2" />
          Zamanla
        </Button>
        <Button variant="outline">
          <Clock className="w-4 h-4 mr-2" />
          Takvim Görünümü
        </Button>
      </div>
    </div>
  )
}

function MultiFormatModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
        <h3 className="text-lg font-bold text-orange-800 mb-3">📄 Çoklu Format Desteği</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700">PDF, Excel, CSV, JSON</span>
          </div>
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700">Toplu format dönüştürme</span>
          </div>
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700">Özel format desteği</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Format Seç
        </Button>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Varsayılan Ayarlar
        </Button>
      </div>
    </div>
  )
}

function SecureSharingModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
        <h3 className="text-lg font-bold text-indigo-800 mb-3">🔒 Güvenli Paylaşım</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700">Şifreli dosya paylaşımı</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700">Erişim kontrolü</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700">Güvenli bağlantılar</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <Shield className="w-4 h-4 mr-2" />
          Paylaşım Ayarla
        </Button>
        <Button variant="outline">
          <Lock className="w-4 h-4 mr-2" />
          Güvenlik Ayarları
        </Button>
      </div>
    </div>
  )
}

function CloudSyncModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
        <h3 className="text-lg font-bold text-teal-800 mb-3">☁️ Bulut Senkronizasyonu</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-teal-600" />
            <span className="text-teal-700">Otomatik bulut yedekleme</span>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-teal-600" />
            <span className="text-teal-700">Çoklu cihaz senkronizasyonu</span>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-teal-600" />
            <span className="text-teal-700">Sınırsız depolama</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
          <Globe className="w-4 h-4 mr-2" />
          Senkronize Et
        </Button>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Bulut Ayarları
        </Button>
      </div>
    </div>
  )
}

function AdvancedAnalyticsModal() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-200">
        <h3 className="text-lg font-bold text-pink-800 mb-3">📊 Gelişmiş Analitik</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-pink-600" />
            <span className="text-pink-700">Derinlemesine analitik raporlar</span>
          </div>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-pink-600" />
            <span className="text-pink-700">Makine öğrenmesi destekli analiz</span>
          </div>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-pink-600" />
            <span className="text-pink-700">Özel metrikler ve KPI'lar</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
          <BarChart3 className="w-4 h-4 mr-2" />
          Analitik Oluştur
        </Button>
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Önizleme
        </Button>
      </div>
    </div>
  )
}
