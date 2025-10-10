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

export default function EnterprisePage() {
  const router = useRouter()
  const { user } = useUser()
  const [selectedPlan, setSelectedPlan] = useState('enterprise')
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  })

  const isAlreadyEnterprise = user?.plan === 'enterprise'
  const isAlreadyEnterprisePremium = user?.plan === 'enterprise_premium'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-500/30 mb-8">
              <Award className="h-5 w-5 text-amber-400" />
              <span className="text-amber-400 font-semibold">Enterprise Solutions</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8">
              <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                ULTRA
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                POWER
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-12 leading-relaxed">
              Dünyanın en güçlü finansal yönetim platformu.
              <span className="text-amber-400 font-bold"> AI, Blockchain, IoT</span> ve
              <span className="text-emerald-400 font-bold"> Siber Güvenlik</span> teknolojileri ile
              donatılmış.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-12 py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => router.push('/enterprise-premium')}
              >
                <Rocket className="h-6 w-6 mr-3" />
                ULTRA PREMIUM'U KEŞFET
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-6 text-xl font-bold backdrop-blur-sm"
                onClick={() => setIsContactFormOpen(true)}
              >
                <MessageSquare className="h-6 w-6 mr-3" />
                DEMO TALEP ET
              </Button>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
                <p className="text-blue-200">Bank-level encryption & compliance</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI-Powered</h3>
                <p className="text-blue-200">Machine learning & predictive analytics</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Real-time</h3>
                <p className="text-blue-200">Instant processing & updates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Features Grid */}
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  ENTERPRISE
                </span>
                <br />
                <span className="text-white">FEATURES</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards */}
              {[
                {
                  icon: Building2,
                  title: 'Multi-Company Management',
                  description: 'Manage unlimited companies, subsidiaries, and business units',
                  color: 'from-blue-500 to-indigo-600',
                },
                {
                  icon: Users,
                  title: 'Unlimited Users',
                  description: 'Add unlimited team members with role-based access',
                  color: 'from-emerald-500 to-teal-600',
                },
                {
                  icon: Shield,
                  title: 'Enterprise Security',
                  description: 'SOC 2, ISO 27001, GDPR compliant security',
                  color: 'from-red-500 to-rose-600',
                },
                {
                  icon: BarChart3,
                  title: 'Advanced Analytics',
                  description: 'Real-time dashboards and predictive insights',
                  color: 'from-purple-500 to-pink-600',
                },
                {
                  icon: Globe,
                  title: 'Global Operations',
                  description: 'Multi-currency, multi-language, multi-timezone',
                  color: 'from-amber-500 to-orange-600',
                },
                {
                  icon: Headphones,
                  title: '24/7 VIP Support',
                  description: 'Dedicated account manager and priority support',
                  color: 'from-cyan-500 to-blue-600',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <div
                    className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-blue-200 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-3xl p-12 border border-amber-500/30">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                READY FOR
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {' '}
                  ULTRA POWER?
                </span>
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join the world's most powerful companies using our Enterprise solutions
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-12 py-6 text-xl font-bold shadow-2xl"
                  onClick={() => router.push('/enterprise-premium')}
                >
                  <Crown className="h-6 w-6 mr-3" />
                  ULTRA PREMIUM
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-6 text-xl font-bold backdrop-blur-sm"
                  onClick={() => setIsContactFormOpen(true)}
                >
                  <Phone className="h-6 w-6 mr-3" />
                  CONTACT SALES
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
