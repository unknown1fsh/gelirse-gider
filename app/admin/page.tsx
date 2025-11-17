'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/user-context'
import {
  Users,
  TrendingUp,
  Activity,
  UserCheck,
  AlertCircle,
  Shield,
  BarChart3,
  Calendar,
  RefreshCw,
  Eye,
  Search,
  Clock,
} from 'lucide-react'
import { UserRole } from '@/server/enums/UserRole'

interface AdminDashboardData {
  users: {
    total: number
    active: number
    newToday: number
    newLast7Days: number
    newLast30Days: number
    activeLast24Hours: number
  }
  transactions: {
    total: number
    last7Days: number
    last30Days: number
  }
  accounts: {
    total: number
  }
  investments: {
    total: number
  }
  planDistribution: Array<{
    plan: string
    count: number
  }>
  roleDistribution: Array<{
    role: string
    count: number
  }>
}

interface UserListItem {
  id: number
  email: string
  name: string
  phone?: string
  avatar?: string
  plan: string
  role: string
  isActive: boolean
  createdAt: Date
  lastLoginAt?: Date
}

export default function AdminPage() {
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
  const [users, setUsers] = useState<UserListItem[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [showActiveOnly, setShowActiveOnly] = useState<boolean | null>(null)

  // Admin kontrolü
  useEffect(() => {
    if (!userLoading && user) {
      if (user.role !== UserRole.ADMIN) {
        router.push('/dashboard')
      }
    } else if (!userLoading && !user) {
      router.push('/landing')
    }
  }, [user, userLoading, router])

  // Dashboard verilerini yükle
  useEffect(() => {
    async function fetchDashboardData() {
      if (!user || user.role !== UserRole.ADMIN) return

      try {
        setDataLoading(true)
        setError(null)

        const response = await fetch('/api/admin/dashboard', {
          credentials: 'include',
        })

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push('/dashboard')
            return
          }
          throw new Error('Admin dashboard verileri alınamadı')
        }

        const result = await response.json()
        if (result.success) {
          setDashboardData(result.data)
        }
      } catch (err) {
        console.error('Admin dashboard fetch error:', err)
        setError('Dashboard verileri yüklenirken bir hata oluştu')
      } finally {
        setDataLoading(false)
      }
    }

    void fetchDashboardData()
  }, [user, router])

  // Kullanıcı listesini yükle
  useEffect(() => {
    async function fetchUsers() {
      if (!user || user.role !== UserRole.ADMIN) return

      try {
        setUsersLoading(true)
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '50',
        })

        if (searchTerm) {
          params.append('search', searchTerm)
        }
        if (selectedRole) {
          params.append('role', selectedRole)
        }
        if (showActiveOnly !== null) {
          params.append('isActive', showActiveOnly.toString())
        }

        const response = await fetch(`/api/admin/users?${params.toString()}`, {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Kullanıcı listesi alınamadı')
        }

        const result = await response.json()
        if (result.success) {
          setUsers(result.data.users)
        }
      } catch (err) {
        console.error('Users fetch error:', err)
      } finally {
        setUsersLoading(false)
      }
    }

    void fetchUsers()
  }, [user, currentPage, searchTerm, selectedRole, showActiveOnly])

  const handleUpdateUser = async (userId: number, updates: { role?: string; isActive?: boolean }) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, ...updates }),
      })

      if (!response.ok) {
        throw new Error('Kullanıcı güncellenemedi')
      }

      // Kullanıcı listesini yenile
      setUsers(users.map(u => (u.id === userId ? { ...u, ...updates } : u)))
    } catch (err) {
      console.error('Update user error:', err)
      alert('Kullanıcı güncellenirken hata oluştu')
    }
  }

  if (userLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )
  }

  if (!user || user.role !== UserRole.ADMIN) {
    return null
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Admin Paneli</h1>
                <p className="text-sm sm:text-base text-slate-600">Sistem yönetimi ve istatistikler</p>
              </div>
            </div>
            <button
              onClick={() => {
                window.location.reload()
              }}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <RefreshCw className="h-5 w-5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* İstatistik Kartları */}
        {dashboardData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-700">Toplam Kullanıcı</h3>
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{dashboardData.users.total}</div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span>{dashboardData.users.active} aktif</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-700">Bugün Kayıt</h3>
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{dashboardData.users.newToday}</div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>Son 7 gün: {dashboardData.users.newLast7Days}</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-700">Toplam İşlem</h3>
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{dashboardData.transactions.total}</div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Activity className="h-4 w-4 text-purple-500" />
                <span>Son 30 gün: {dashboardData.transactions.last30Days}</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-700">Son 24 Saat Aktif</h3>
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-md">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">
                {dashboardData.users.activeLast24Hours}
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>Kullanıcı giriş yaptı</span>
              </div>
            </div>
          </div>
        )}

        {/* Kullanıcı Yönetimi */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Kullanıcı Yönetimi</h2>
          </div>

          {/* Filtreler */}
          <div className="p-6 border-b border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ara (email, isim, telefon)..."
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedRole}
                onChange={e => {
                  setSelectedRole(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tüm Roller</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="ENTERPRISE">ENTERPRISE</option>
              </select>
              <select
                value={showActiveOnly === null ? '' : showActiveOnly.toString()}
                onChange={e => {
                  const value = e.target.value
                  setShowActiveOnly(value === '' ? null : value === 'true')
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tüm Durumlar</option>
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </div>
          </div>

          {/* Kullanıcı Listesi */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Kayıt Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {usersLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                        <span className="text-slate-600">Yükleniyor...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Kullanıcı bulunamadı
                    </td>
                  </tr>
                ) : (
                  users.map(userItem => (
                    <tr key={userItem.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {userItem.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{userItem.name}</div>
                            <div className="text-sm text-slate-500">{userItem.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            userItem.plan === 'premium' || userItem.plan === 'enterprise'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {userItem.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={userItem.role}
                          onChange={e => handleUpdateUser(userItem.id, { role: e.target.value })}
                          className="text-sm border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="ENTERPRISE">ENTERPRISE</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleUpdateUser(userItem.id, { isActive: !userItem.isActive })
                          }
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            userItem.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors`}
                        >
                          {userItem.isActive ? 'Aktif' : 'Pasif'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(userItem.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            // Kullanıcı detayı sayfasına git (opsiyonel)
                            window.open(`/admin/users/${userItem.id}`, '_blank')
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Eye className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Sayfalama */}
          <div className="p-6 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Önceki
            </button>
            <span className="text-sm text-slate-600">Sayfa {currentPage}</span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={users.length < 50}
              className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

