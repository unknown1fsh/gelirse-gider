'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Coins, 
  ArrowLeft, 
  Home, 
  DollarSign,
  PieChart,
  BarChart3,
  Target
} from 'lucide-react'
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

export default function PortfolioPage() {
  const router = useRouter()
  const [allAccounts, setAllAccounts] = useState<AllAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch('/api/accounts')
        if (response.ok) {
          const data = await response.json()
          setAllAccounts(data)
        } else {
          setError('Portföy verileri yüklenemedi')
        }
      } catch (error) {
        console.error('Portföy verileri yüklenirken hata:', error)
        setError('Portföy verileri yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [])

  // Hesaplamalar
  const bankAccounts = allAccounts.filter(acc => acc.accountType === 'bank')
  const creditCards = allAccounts.filter(acc => acc.accountType === 'credit_card')
  const goldItems = allAccounts.filter(acc => acc.accountType === 'gold')

  // Toplam varlık hesaplamaları
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

  // Kredi kartı borçları (limit - kullanılabilir limit)
  const totalCreditCardDebt = creditCards.reduce((sum, acc) => {
    if (acc.limitAmount && acc.availableLimit) {
      const used = parseFloat(acc.limitAmount) - parseFloat(acc.availableLimit)
      return sum + used
    }
    return sum
  }, 0)

  const netWorth = totalAssets - totalCreditCardDebt

  // Kategori dağılımı
  const bankPercentage = totalAssets > 0 ? (totalBankBalance / totalAssets) * 100 : 0
  const goldPercentage = totalAssets > 0 ? (totalGoldValue / totalAssets) * 100 : 0

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
          <h1 className="text-3xl font-bold">Toplam Varlık</h1>
          <p className="text-muted-foreground">
            Portföy değerinizi ve varlık dağılımınızı görüntüleyin
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Portföy verileri yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <>
          {/* Ana KPI Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Toplam Varlık</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalAssets, 'TRY')}
                </div>
                <p className="text-xs text-green-600">
                  Tüm varlıkların toplamı
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Nakit Varlık</CardTitle>
                <Wallet className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalBankBalance, 'TRY')}
                </div>
                <p className="text-xs text-blue-600">
                  Banka hesapları toplamı
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800">Altın Değeri</CardTitle>
                <Coins className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(totalGoldValue, 'TRY')}
                </div>
                <p className="text-xs text-yellow-600">
                  Altın eşyaları değeri
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Net Değer</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netWorth, 'TRY')}
                </div>
                <p className="text-xs text-purple-600">
                  Varlık - Borç
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Varlık Dağılımı */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-indigo-600" />
                  Varlık Dağılımı
                </CardTitle>
                <CardDescription>
                  Portföyünüzün kategorilere göre dağılımı
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium">Banka Hesapları</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{formatCurrency(totalBankBalance, 'TRY')}</div>
                      <div className="text-xs text-gray-500">{bankPercentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${bankPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm font-medium">Altın Eşyaları</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{formatCurrency(totalGoldValue, 'TRY')}</div>
                      <div className="text-xs text-gray-500">{goldPercentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goldPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Hesap Özeti
                </CardTitle>
                <CardDescription>
                  Hesap türlerine göre özet bilgiler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Banka Hesapları</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{bankAccounts.length}</div>
                      <div className="text-xs text-gray-500">hesap</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Kredi Kartları</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{creditCards.length}</div>
                      <div className="text-xs text-gray-500">kart</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Altın Eşyaları</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{goldItems.length}</div>
                      <div className="text-xs text-gray-500">eşya</div>
                    </div>
                  </div>

                  {totalCreditCardDebt > 0 && (
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium">Toplam Borç</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-600">
                          {formatCurrency(totalCreditCardDebt, 'TRY')}
                        </div>
                        <div className="text-xs text-gray-500">kredi kartı</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detaylı Liste */}
          <Card>
            <CardHeader>
              <CardTitle>Tüm Varlıklar</CardTitle>
              <CardDescription>
                Portföyünüzdeki tüm varlıkların detaylı listesi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allAccounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <p>Henüz varlık eklenmemiş</p>
                  <Link 
                    href="/accounts/new"
                    className="text-blue-600 hover:underline"
                  >
                    İlk varlığınızı ekleyin
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
                                <span>{account.bank.name}</span>
                              </div>
                            )}
                            {account.accountNumber && (
                              <div className="flex items-center gap-1">
                                <span>{account.accountNumber}</span>
                              </div>
                            )}
                            {account.dueDay && (
                              <div className="flex items-center gap-1">
                                <span>{account.dueDay}. gün ödeme</span>
                              </div>
                            )}
                            {account.weightGrams && (
                              <div className="flex items-center gap-1">
                                <span>{account.weightGrams} g</span>
                              </div>
                            )}
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
        </>
      )}
    </div>
  )
}
