'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, List, TrendingUp, TrendingDown, Calendar, Tag, Wallet, CreditCard } from 'lucide-react'
import { formatCurrency } from '@/lib/validators'

interface Transaction {
  id: number
  amount: string
  transactionDate: string
  description: string | null
  tags: string[]
  txType: {
    id: number
    name: string
    code: string
  }
  category: {
    id: number
    name: string
  }
  paymentMethod: {
    id: number
    name: string
  }
  account: {
    id: number
    name: string
    bank: {
      name: string
    }
    currency: {
      code: string
    }
  } | null
  creditCard: {
    id: number
    name: string
    bank: {
      name: string
    }
    currency: {
      code: string
    }
  } | null
  currency: {
    id: number
    code: string
    name: string
  }
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('/api/transactions', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setTransactions(data)
        } else {
          setError('İşlemler yüklenemedi')
        }
      } catch (error) {
        console.error('İşlemler yüklenirken hata:', error)
        setError('İşlemler yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">İşlemler</h1>
          <p className="text-muted-foreground">
            Gelir ve gider işlemlerinizi yönetin
          </p>
        </div>
        <Link
          href="/transactions/new"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni İşlem
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/transactions/new?type=gelir">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gelir Ekle</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+</div>
              <p className="text-xs text-muted-foreground">
                Yeni gelir işlemi ekleyin
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/transactions/new?type=gider">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gider Ekle</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-</div>
              <p className="text-xs text-muted-foreground">
                Yeni gider işlemi ekleyin
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Son İşlemler
          </CardTitle>
          <CardDescription>
            En son eklenen işlemlerin listesi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">İşlem listesi yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <List className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">Henüz işlem bulunmuyor</p>
              <p className="text-sm text-slate-400 mt-1">İlk işleminizi eklemek için yukarıdaki butonları kullanın</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="group p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          transaction.txType.code === 'GELIR' 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }`} />
                        <h3 className="font-semibold text-slate-800">
                          {transaction.category.name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          transaction.txType.code === 'GELIR' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.txType.name}
                        </span>
                      </div>
                      
                      {transaction.description && (
                        <p className="text-sm text-slate-600 mb-2">{transaction.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(transaction.transactionDate).toLocaleDateString('tr-TR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {transaction.paymentMethod.name}
                        </div>
                        {transaction.account && (
                          <div className="flex items-center gap-1">
                            <Wallet className="h-3 w-3" />
                            {transaction.account.name}
                          </div>
                        )}
                        {transaction.creditCard && (
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            {transaction.creditCard.name}
                          </div>
                        )}
                      </div>
                      
                      {transaction.tags && transaction.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {transaction.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transaction.txType.code === 'GELIR' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.txType.code === 'GELIR' ? '+' : '-'}
                        {formatCurrency(parseFloat(transaction.amount), transaction.currency.code)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {transactions.length > 10 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-slate-500">
                    {transactions.length - 10} işlem daha var
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

