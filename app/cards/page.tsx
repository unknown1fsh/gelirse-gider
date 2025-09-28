'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, AlertCircle, Calendar, ArrowLeft, Home, Tag } from 'lucide-react'
import { formatCurrency } from '@/lib/validators'

interface CreditCardData {
  id: number
  name: string
  limitAmount: string
  availableLimit: string
  dueDay: number
  bank: {
    id: number
    name: string
  }
  currency: {
    id: number
    code: string
    name: string
  }
  createdAt: string
}

export default function CardsPage() {
  const router = useRouter()
  const [creditCards, setCreditCards] = useState<CreditCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCreditCards() {
      try {
        const response = await fetch('/api/cards', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setCreditCards(data)
        } else {
          setError('Kredi kartları yüklenemedi')
        }
      } catch (error) {
        console.error('Kredi kartları yüklenirken hata:', error)
        setError('Kredi kartları yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchCreditCards()
  }, [])

  // Hesaplamalar
  const totalLimit = creditCards.reduce((sum, card) => sum + parseFloat(card.limitAmount), 0)
  const totalUsed = creditCards.reduce((sum, card) => sum + (parseFloat(card.limitAmount) - parseFloat(card.availableLimit)), 0)
  const nextDueDate = creditCards.length > 0 ? Math.min(...creditCards.map(card => card.dueDay)) : null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
            <h1 className="text-3xl font-bold">Kredi Kartları</h1>
            <p className="text-muted-foreground">
              Kredi kartı limitlerinizi ve ödeme tarihlerini takip edin
            </p>
          </div>
        </div>
        <Link
          href="/cards/new"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Yeni Kart
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Limit</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalLimit, 'TRY')}
            </div>
            <p className="text-xs text-muted-foreground">
              Tüm kartların toplam limiti
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kullanılan Limit</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalUsed, 'TRY')}
            </div>
            <p className="text-xs text-muted-foreground">
              Kullanılan limit tutarı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yaklaşan Ödeme</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {nextDueDate ? `${nextDueDate}` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              En yakın ödeme tarihi
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kart Listesi</CardTitle>
          <CardDescription>
            Tüm kredi kartlarınızın listesi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Kredi kartları yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : creditCards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-8 w-8 mx-auto mb-2" />
              <p>Henüz kredi kartı eklenmemiş</p>
              <Link 
                href="/accounts/new?type=credit_card"
                className="text-blue-600 hover:underline"
              >
                İlk kartınızı ekleyin
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {creditCards.map((card) => (
                <div key={card.id} className="group p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <h3 className="font-semibold text-slate-800">{card.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          Kredi Kartı
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {card.bank.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {card.dueDay}. gün ödeme
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {new Date(card.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">
                        {formatCurrency(parseFloat(card.limitAmount), card.currency.code)}
                      </p>
                      <p className="text-sm text-slate-500">
                        Kullanılabilir: {formatCurrency(parseFloat(card.availableLimit), card.currency.code)}
                      </p>
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

