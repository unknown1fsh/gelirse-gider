'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, CreditCard, TrendingUp, Coins, ArrowLeft, Home, Plus, Calendar, Tag } from 'lucide-react'
import { formatCurrency } from '@/lib/validators'

interface AllAccount {
  id: number
  uniqueId: string
  name: string
  accountType: string // 'bank', 'credit_card', 'gold'
  // Bank account fields
  balance?: string
  accountNumber?: string | null
  iban?: string | null
  accountType?: {
    id: number
    name: string
  }
  // Credit card fields
  limitAmount?: string
  availableLimit?: string
  dueDay?: number
  // Gold item fields
  weightGrams?: string
  purchasePrice?: string
  currentValueTry?: string | null
  goldType?: {
    id: number
    name: string
  }
  goldPurity?: {
    id: number
    name: string
  }
  // Common fields
  bank?: {
    id: number
    name: string
  }
  currency?: {
    id: number
    code: string
    name: string
  }
  createdAt: string
}

export default function AccountsPage() {
  const router = useRouter()
  const [allAccounts, setAllAccounts] = useState<AllAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch('/api/accounts', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setAllAccounts(data)
        } else {
          setError('Hesaplar yüklenemedi')
        }
      } catch (error) {
        console.error('Hesaplar yüklenirken hata:', error)
        setError('Hesaplar yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  // Hesaplamalar
  const bankAccounts = allAccounts.filter(acc => acc.accountType === 'bank')
  const creditCards = allAccounts.filter(acc => acc.accountType === 'credit_card')
  const goldItems = allAccounts.filter(acc => acc.accountType === 'gold')

  // Toplam varlık hesaplaması
  const totalBankBalance = bankAccounts.reduce((sum, acc) => {
    if (acc.balance && acc.currency) {
      // Basit döviz dönüşümü (gerçek uygulamada API'den alınmalı)
      const rate = acc.currency.code === 'USD' ? 30 : acc.currency.code === 'EUR' ? 32 : 1
      return sum + (parseFloat(acc.balance) * rate)
    }
    return sum
  }, 0)

  const totalGoldValue = goldItems.reduce((sum, acc) => {
    return sum + parseFloat(acc.currentValueTry || '0')
  }, 0)

  const totalAssets = totalBankBalance + totalGoldValue

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
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
        <div>
          <h1 className="text-3xl font-bold">Hesaplar</h1>
          <p className="text-muted-foreground">
            Banka hesaplarınızı ve kredi kartlarınızı yönetin
          </p>
        </div>
        <Link
          href="/accounts/new"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Hesap Ekle
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/accounts/bank">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Banka Hesapları</CardTitle>
              <Wallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{bankAccounts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Aktif hesap sayısı
                  </p>
                </CardContent>
          </Card>
        </Link>

        <Link href="/cards">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kredi Kartları</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{creditCards.length}</div>
              <p className="text-xs text-muted-foreground">
                Aktif kart sayısı
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/gold">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Altın ve Ziynet</CardTitle>
              <Coins className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{goldItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Altın eşya sayısı
              </p>
            </CardContent>
          </Card>
        </Link>

            <Link href="/portfolio">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Toplam Varlık</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalAssets, 'TRY')}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Toplam portföy değeri
                  </p>
                </CardContent>
              </Card>
            </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hesap Listesi</CardTitle>
          <CardDescription>
            Tüm hesaplarınızın listesi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Hesaplar yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
              ) : allAccounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-8 w-8 mx-auto mb-2" />
                  <p>Henüz hesap eklenmemiş</p>
                  <Link 
                    href="/accounts/new"
                    className="text-blue-600 hover:underline"
                  >
                    İlk hesabınızı ekleyin
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {allAccounts.map((account) => (
                    <div key={account.uniqueId} className="group p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${
                              account.accountType === 'bank' ? 'bg-blue-500' :
                              account.accountType === 'credit_card' ? 'bg-purple-500' :
                              'bg-yellow-500'
                            }`} />
                            <h3 className="font-semibold text-slate-800">{account.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              account.accountType === 'bank' ? 'bg-blue-100 text-blue-700' :
                              account.accountType === 'credit_card' ? 'bg-purple-100 text-purple-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {account.accountType === 'bank' ? 'Banka Hesabı' :
                               account.accountType === 'credit_card' ? 'Kredi Kartı' :
                               'Altın Eşyası'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            {account.bank && (
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {account.bank.name}
                              </div>
                            )}
                            {account.accountNumber && (
                              <div className="flex items-center gap-1">
                                <Wallet className="h-3 w-3" />
                                {account.accountNumber}
                              </div>
                            )}
                            {account.dueDay && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {account.dueDay}. gün ödeme
                              </div>
                            )}
                            {account.weightGrams && (
                              <div className="flex items-center gap-1">
                                <Coins className="h-3 w-3" />
                                {account.weightGrams} g
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(account.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {account.balance && account.currency && (
                            <p className="text-lg font-bold text-blue-600">
                              {formatCurrency(parseFloat(account.balance), account.currency.code)}
                            </p>
                          )}
                          {account.limitAmount && account.currency && (
                            <p className="text-lg font-bold text-purple-600">
                              {formatCurrency(parseFloat(account.limitAmount), account.currency.code)}
                            </p>
                          )}
                          {account.currentValueTry && (
                            <p className="text-lg font-bold text-yellow-600">
                              {formatCurrency(parseFloat(account.currentValueTry), 'TRY')}
                            </p>
                          )}
                          {account.currency && (
                            <p className="text-xs text-slate-500">
                              {account.currency.code}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  )
}

