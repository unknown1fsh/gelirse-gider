'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@/lib/user-context'
import {
  Building2,
  Users,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Headphones,
  Check,
  UserCheck,
  Bot,
  ArrowRight,
  Star,
  Award,
  Target,
  TrendingUp,
  Lock,
  Unlock,
  Database,
  Cloud,
  Settings,
  FileText,
  Calendar,
  Bell,
  Mail,
  Phone,
  MessageSquare,
  Rocket,
  Crown,
  Diamond,
  Sparkles,
  ArrowLeft,
  CreditCard,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Minus,
  Search,
  Filter,
  SortAsc,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  TrendingDown,
  DollarSign,
  Wallet,
  Coins,
  Banknote,
  Receipt,
  Calculator,
  Clipboard,
  BookOpen,
  Lightbulb,
  Brain,
  Cpu,
  HardDrive,
  Wifi,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Network,
  Layers,
  Grid,
  Layout,
  Palette,
  Brush,
  PenTool,
  Scissors,
  Copy,
  Paste,
  Cut,
  Save,
  Folder,
  File,
  Image,
  Video,
  Music,
  Volume2,
  VolumeX,
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
  Star as StarIcon,
  Heart as HeartIcon,
  Moon,
  Sun,
  Cloud as CloudIcon,
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
  Engineer as EngineerIcon,
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
  Director as DirectorIcon,
  CEO,
  CFO,
  CTO,
  COO,
  VP,
  President as PresidentIcon,
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
  Receipt as ReceiptIcon,
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
  Target as TargetIcon,
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
  Activity as ActivityIcon,
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
  Question as QuestionIcon,
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
  Layout as LayoutIcon,
  Arrangement,
  Organization as OrganizationIcon,
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
  Gift as GiftIcon,
  Quality,
  Trait,
  Behavior,
  Attitude,
  Personality,
  Character,
  Nature,
  Essence,
  Core,
  Heart as HeartIcon2,
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
  Star as StarIcon2,
  Sun as SunIcon,
  Moon as MoonIcon,
  Sky,
  Cloud as CloudIcon2,
  Rain,
  Snow,
  Wind as WindIcon,
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
  Diamond as DiamondIcon,
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

export default function EnterprisePremiumPage() {
  const router = useRouter()
  const { user } = useUser()
  const [selectedPlan, setSelectedPlan] = useState('enterprise_premium')
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  })

  const isAlreadyEnterprisePremium = user?.plan === 'enterprise_premium'

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Ultra Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Multiple gradient orbs */}
        <div className="absolute -top-60 -right-60 w-96 h-96 bg-gradient-to-br from-amber-500/30 to-orange-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-3000"></div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Floating Tech Elements */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Ultra Hero Section */}
        <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* Ultra Premium Badge */}
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-sm rounded-full px-8 py-4 border-2 border-amber-500/50 mb-12 shadow-2xl">
              <Diamond className="h-6 w-6 text-amber-400 animate-pulse" />
              <span className="text-amber-400 font-black text-lg">ULTRA PREMIUM</span>
              <Crown className="h-6 w-6 text-amber-400 animate-pulse" />
            </div>

            <h1 className="text-7xl md:text-9xl font-black mb-8 leading-none">
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                ULTRA
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                PREMIUM
              </span>
            </h1>

            <div className="text-2xl md:text-3xl text-amber-100 max-w-5xl mx-auto mb-16 leading-relaxed">
              <span className="font-bold text-amber-400">
                Dünyanın en güçlü finansal platformu.
              </span>
              <br />
              <span className="text-white">AI, Blockchain, IoT, Quantum Computing</span>
              <br />
              <span className="text-cyan-400 font-bold">
                ve Siber Güvenlik teknolojileri ile donatılmış.
              </span>
            </div>

            {/* Ultra Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white px-16 py-8 text-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-amber-400/50"
                onClick={() => router.push('/auth/register')}
              >
                <Rocket className="h-8 w-8 mr-4" />
                ULTRA PREMIUM'U BAŞLAT
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-amber-400/50 text-amber-400 hover:bg-amber-400/10 px-16 py-8 text-2xl font-black backdrop-blur-sm"
                onClick={() => setIsContactFormOpen(true)}
              >
                <MessageSquare className="h-8 w-8 mr-4" />
                ULTRA DEMO TALEP
              </Button>
            </div>

            {/* Ultra Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-amber-500/30 hover:scale-105 transition-transform">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mx-auto mb-6">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-amber-400 mb-3">Quantum Güvenlik</h3>
                <p className="text-amber-100">Gelecek nesil şifreleme ve sıfır güven mimarisi</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-purple-500/30 hover:scale-105 transition-transform">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-6">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-purple-400 mb-3">AI Süper Zeka</h3>
                <p className="text-purple-100">Gelişmiş makine öğrenmesi ve tahmin analitikleri</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-emerald-500/30 hover:scale-105 transition-transform">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-6">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-emerald-400 mb-3">Quantum İşlem</h3>
                <p className="text-emerald-100">Yıldırım hızında gerçek zamanlı işlem</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-cyan-500/30 hover:scale-105 transition-transform">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mx-auto mb-6">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-cyan-400 mb-3">Global Ağ</h3>
                <p className="text-cyan-100">Dünya çapında altyapı ve destek</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categorized Enterprise Features */}
        <div className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  ULTRA
                </span>
                <br />
                <span className="text-white">KATEGORİLER</span>
              </h2>
              <p className="text-2xl text-amber-100 max-w-4xl mx-auto">
                5 ana kategori altında düzenlenmiş dünyanın en gelişmiş kurumsal özellikleri
              </p>
            </div>

            <div className="space-y-24">
              {/* Enterprise Management Category */}
              <div className="relative">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-sm rounded-full border-2 border-amber-500/50 mb-8 shadow-2xl">
                    <Building2 className="h-8 w-8 text-amber-400" />
                    <span className="text-2xl font-black text-amber-400">🏢 KURUMSAL YÖNETİM</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6">
                    Çok Boyutlu İşletme Yönetimi
                  </h3>
                  <p className="text-xl text-amber-100 max-w-4xl mx-auto">
                    Sınırsız şirket, şube ve iş birimi yönetimi ile global operasyonlarınızı kontrol
                    edin
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: Building2,
                      title: 'Çoklu Şirket Konsolidasyonu',
                      description:
                        'Holding, ana şirket ve yan kuruluşların tek platformda yönetimi',
                      color: 'from-amber-500 to-orange-600',
                    },
                    {
                      icon: Users,
                      title: 'Sınırsız Departman Yönetimi',
                      description: 'Finans, IT, İK, Operasyon departmanları için ayrı erişim',
                      color: 'from-amber-500 to-orange-600',
                    },
                    {
                      icon: UserCheck,
                      title: 'Hiyerarşik Yetki Sistemi',
                      description: 'CEO, CFO, Müdür, Uzman seviyeli detaylı yetkilendirme',
                      color: 'from-amber-500 to-orange-600',
                    },
                    {
                      icon: Globe,
                      title: 'Global Şube Ağı',
                      description: 'Dünya çapında şube, fabrika ve ofis yönetimi',
                      color: 'from-amber-500 to-orange-600',
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-amber-500/30 hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                      <div
                        className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-xl`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-black text-white mb-4">{feature.title}</h4>
                      <p className="text-amber-100 leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise Security Category */}
              <div className="relative">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-red-500/30 to-rose-500/30 backdrop-blur-sm rounded-full border-2 border-red-500/50 mb-8 shadow-2xl">
                    <Shield className="h-8 w-8 text-red-400" />
                    <span className="text-2xl font-black text-red-400">🔒 ENTERPRISE GÜVENLİK</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6">Quantum Seviye Güvenlik</h3>
                  <p className="text-xl text-red-100 max-w-4xl mx-auto">
                    Askeri seviye şifreleme, sıfır güven mimarisi ve quantum dirençli güvenlik
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: Shield,
                      title: 'Kurumsal Quantum Şifreleme',
                      description: 'Bankacılık seviyesi quantum dirençli şifreleme teknolojisi',
                      color: 'from-red-500 to-rose-600',
                    },
                    {
                      icon: Lock,
                      title: 'Enterprise Sıfır Güven',
                      description: 'Çok faktörlü kimlik doğrulama ve mikro segmentasyon',
                      color: 'from-red-500 to-rose-600',
                    },
                    {
                      icon: Eye,
                      title: 'Siber Tehdit İzleme',
                      description: 'AI destekli siber güvenlik operasyon merkezi (SOC)',
                      color: 'from-red-500 to-rose-600',
                    },
                    {
                      icon: Database,
                      title: 'Uyumluluk Yönetimi',
                      description: 'GDPR, KVKK, SOX, PCI DSS otomatik uyumluluk raporlama',
                      color: 'from-red-500 to-rose-600',
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-red-500/30 hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                      <div
                        className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-xl`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-black text-white mb-4">{feature.title}</h4>
                      <p className="text-red-100 leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Superintelligence Category */}
              <div className="relative">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm rounded-full border-2 border-purple-500/50 mb-8 shadow-2xl">
                    <Brain className="h-8 w-8 text-purple-400" />
                    <span className="text-2xl font-black text-purple-400">🤖 AI SÜPER ZEKA</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6">Yapay Zeka Süper Zekası</h3>
                  <p className="text-xl text-purple-100 max-w-4xl mx-auto">
                    Gelişmiş makine öğrenmesi, tahmin analitikleri ve gerçek zamanlı öngörüler
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: Brain,
                      title: 'Kurumsal AI Süper Zeka',
                      description:
                        'İşletme operasyonları için özel eğitilmiş makine öğrenmesi modelleri',
                      color: 'from-purple-500 to-pink-600',
                    },
                    {
                      icon: BarChart3,
                      title: 'Kurumsal Gelir Optimizasyonu',
                      description:
                        'Pazar analizi, müşteri segmentasyonu ve gelir artırma stratejileri',
                      color: 'from-purple-500 to-pink-600',
                    },
                    {
                      icon: TrendingUp,
                      title: 'Operasyonel Verimlilik',
                      description:
                        'Üretim, lojistik ve tedarik zinciri optimizasyonu ve maliyet azaltma',
                      color: 'from-purple-500 to-pink-600',
                    },
                    {
                      icon: Bot,
                      title: 'Kurumsal Süreç Otomasyonu',
                      description: 'RPA ve AI destekli kurumsal süreç otomasyonu ve iş akışları',
                      color: 'from-purple-500 to-pink-600',
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-purple-500/30 hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                      <div
                        className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-xl`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-black text-white mb-4">{feature.title}</h4>
                      <p className="text-purple-100 leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global Infrastructure Category */}
              <div className="relative">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 backdrop-blur-sm rounded-full border-2 border-cyan-500/50 mb-8 shadow-2xl">
                    <Globe className="h-8 w-8 text-cyan-400" />
                    <span className="text-2xl font-black text-cyan-400">🌐 GLOBAL ALTYAPI</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6">Dünya Çapında Altyapı</h3>
                  <p className="text-xl text-cyan-100 max-w-4xl mx-auto">
                    Dünya çapında altyapı, çoklu para birimi, çoklu dil ve 7/24 global destek
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: Globe,
                      title: 'Global İş Ağı',
                      description: 'Dünya çapında şube, fabrika ve ofis koordinasyonu',
                      color: 'from-cyan-500 to-blue-600',
                    },
                    {
                      icon: Cloud,
                      title: 'Enterprise Bulut Altyapısı',
                      description: 'Yüksek performanslı kurumsal bulut işlem platformu',
                      color: 'from-cyan-500 to-blue-600',
                    },
                    {
                      icon: Wifi,
                      title: 'Çoklu Para Birimi Yönetimi',
                      description: 'Global ticaret için 150+ para birimi ve döviz kuru yönetimi',
                      color: 'from-cyan-500 to-blue-600',
                    },
                    {
                      icon: Headphones,
                      title: 'VIP Kurumsal Destek',
                      description: 'Dedicated hesap yöneticisi ve 7/24 premium kurumsal destek',
                      color: 'from-cyan-500 to-blue-600',
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-cyan-500/30 hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                      <div
                        className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-xl`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-black text-white mb-4">{feature.title}</h4>
                      <p className="text-cyan-100 leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise Revenue Growth Category */}
              <div className="relative">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 backdrop-blur-sm rounded-full border-2 border-yellow-500/50 mb-8 shadow-2xl">
                    <TrendingUp className="h-8 w-8 text-yellow-400" />
                    <span className="text-2xl font-black text-yellow-400">
                      💰 KURUMSAL GELİR ARTTIRMA
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6">
                    Kurumsal Gelir Artırma Stratejileri
                  </h3>
                  <p className="text-xl text-yellow-100 max-w-4xl mx-auto">
                    AI destekli kurumsal gelir artırma, pazar genişletme ve operasyonel büyüme
                    stratejileri
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: TrendingUp,
                      title: 'Pazar Genişletme',
                      description:
                        'Yeni pazar segmentleri ve coğrafi bölgeler için strateji geliştirme',
                      color: 'from-yellow-500 to-amber-600',
                    },
                    {
                      icon: Target,
                      title: 'Müşteri Segmentasyonu',
                      description: 'AI destekli müşteri analizi ve kişiselleştirilmiş pazarlama',
                      color: 'from-yellow-500 to-amber-600',
                    },
                    {
                      icon: BarChart3,
                      title: 'Ürün Portföy Optimizasyonu',
                      description: 'Kurumsal ürün portföyü analizi ve gelir optimizasyonu',
                      color: 'from-yellow-500 to-amber-600',
                    },
                    {
                      icon: Building2,
                      title: 'Kurumsal Ortaklıklar',
                      description: 'Stratejik iş ortaklıkları ve sinerji yaratma fırsatları',
                      color: 'from-yellow-500 to-amber-600',
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-yellow-500/30 hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                      <div
                        className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-xl`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-black text-white mb-4">{feature.title}</h4>
                      <p className="text-yellow-100 leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Intelligence Category */}
              <div className="relative">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 backdrop-blur-sm rounded-full border-2 border-emerald-500/50 mb-8 shadow-2xl">
                    <BarChart3 className="h-8 w-8 text-emerald-400" />
                    <span className="text-2xl font-black text-emerald-400">
                      📈 İŞ ZEKASI & ANALYTICS
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6">Gelişmiş İş Zekası</h3>
                  <p className="text-xl text-emerald-100 max-w-4xl mx-auto">
                    Gelişmiş raporlama, API erişimi, özel entegrasyonlar ve iş zekası araçları
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: BarChart3,
                      title: 'Kurumsal Dashboard',
                      description: "CEO/CFO seviyesi yönetim dashboard'ları ve KPI raporları",
                      color: 'from-emerald-500 to-teal-600',
                    },
                    {
                      icon: Database,
                      title: 'Enterprise API',
                      description: 'ERP, CRM, muhasebe sistemleri ile tam entegrasyon',
                      color: 'from-emerald-500 to-teal-600',
                    },
                    {
                      icon: Settings,
                      title: 'Özel Sistem Entegrasyonları',
                      description: 'SAP, Oracle, Microsoft Dynamics ile özel entegrasyon',
                      color: 'from-emerald-500 to-teal-600',
                    },
                    {
                      icon: FileText,
                      title: 'Beyaz Etiket Çözümü',
                      description: 'Kendi markanızla özelleştirilebilir kurumsal platform',
                      color: 'from-emerald-500 to-teal-600',
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-emerald-500/30 hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                      <div
                        className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-xl`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-black text-white mb-4">{feature.title}</h4>
                      <p className="text-emerald-100 leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ultra CTA Section */}
        <div className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-sm rounded-3xl p-16 border-2 border-amber-500/50 shadow-2xl">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
                ULTRA GÜÇ İÇİN
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {' '}
                  HAZIR MISINIZ?
                </span>
              </h2>
              <p className="text-2xl text-amber-100 mb-12 max-w-4xl mx-auto">
                Dünyanın en güçlü şirketlerinin kullandığı Ultra Premium Kurumsal çözümlerimize
                katılın
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white px-20 py-8 text-2xl font-black shadow-2xl border-2 border-amber-400/50"
                  onClick={() => router.push('/auth/register')}
                >
                  <Crown className="h-8 w-8 mr-4" />
                  ULTRA PREMIUM BAŞLAT
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-amber-400/50 text-amber-400 hover:bg-amber-400/10 px-20 py-8 text-2xl font-black backdrop-blur-sm"
                  onClick={() => setIsContactFormOpen(true)}
                >
                  <Phone className="h-8 w-8 mr-4" />
                  ULTRA SATIŞ EKİBİ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
