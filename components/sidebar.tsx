'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/lib/user-context'
import { 
  Home, 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  Settings,
  Plus,
  BarChart3,
  Coins,
  Calendar,
  DollarSign,
  Sparkles,
  PieChart,
  User,
  Crown,
  LogOut,
  TrendingDown,
  Building2,
  Activity,
  Layers
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, color: 'text-blue-500' },
  { name: 'Toplam Varlık', href: '/portfolio', icon: PieChart, color: 'text-emerald-500' },
  { name: 'İşlemler', href: '/transactions', icon: Plus, color: 'text-green-500' },
  { name: 'Hesaplar', href: '/accounts', icon: Wallet, color: 'text-purple-500' },
  { name: 'Kredi Kartları', href: '/cards', icon: CreditCard, color: 'text-orange-500' },
  { name: 'Otomatik Ödemeler', href: '/auto-payments', icon: Calendar, color: 'text-pink-500' },
  { name: 'Altın ve Ziynet', href: '/gold', icon: Coins, color: 'text-yellow-500' },
  { name: 'Diğer Yatırım Araçları', href: '/investments', icon: Building2, color: 'text-cyan-500' },
  { name: 'Analiz ve Raporlar', href: '/analysis', icon: BarChart3, color: 'text-indigo-500' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useUser()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="flex h-screen w-72 flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
      {/* Logo ve Başlık */}
      <div className="flex h-20 items-center justify-center border-b border-slate-700/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              GiderSE-Gelir
            </h1>
            <p className="text-xs text-slate-400">Finans Yönetimi</p>
          </div>
        </div>
      </div>

      {/* Free kullanıcı için Premium Satın Al butonu */}
      {user && user.plan === 'free' && (
        <div className="mx-6 mb-4">
          <Link
            href="/premium"
            className="block p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl border border-purple-500/30 hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 group-hover:scale-110 transition-transform">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Premium Satın Al</p>
                <p className="text-xs text-purple-200">Gelişmiş özellikler</p>
              </div>
              <div className="text-purple-300 group-hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      )}
      
      {/* Navigasyon */}
      <nav className="flex-1 space-y-2 p-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white shadow-lg border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-md'
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                isActive 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md' 
                  : 'bg-slate-700/50 group-hover:bg-slate-600/50'
              }`}>
                <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color}`} />
              </div>
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
              )}
            </Link>
          )
        })}
      </nav>
      
      {/* Alt Kısım */}
      <div className="border-t border-slate-700/50 p-6">
        
        <div className="space-y-2">
          <Link 
            href="/settings" 
            className="flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-700/50 hover:text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50">
              <Settings className="h-4 w-4" />
            </div>
            <span>Ayarlar</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-red-600/20 hover:text-red-400"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50">
              <LogOut className="h-4 w-4" />
            </div>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </div>
  )
}

