'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, PieChart } from 'lucide-react'
import { parseCurrencyInput } from '@/lib/validators'

export default function NewFundInvestmentPage() {
  const router = useRouter()
  const [currencies, setCurrencies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    category: '',
    quantity: '',
    purchasePrice: '',
    currentPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    currencyId: 0,
    riskLevel: 'low' as 'low' | 'medium' | 'high',
    notes: '',
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/reference-data')
        if (response.ok) {
          const data = await response.json()
          setCurrencies(data.currencies)
          
          const tryCurrency = data.currencies.find((c: any) => c.code === 'TRY')
          if (tryCurrency) {
            setFormData(prev => ({ ...prev, currencyId: tryCurrency.id }))
          }
        }
      } catch (error) {
        console.error('Veriler yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)

    try {
      const submitData = {
        investmentType: 'fund',
        name: formData.name,
        symbol: formData.symbol,
        quantity: parseFloat(formData.quantity),
        purchasePrice: parseCurrencyInput(formData.purchasePrice),
        currentPrice: formData.currentPrice ? parseCurrencyInput(formData.currentPrice) : parseCurrencyInput(formData.purchasePrice),
        purchaseDate: formData.purchaseDate,
        currencyId: formData.currencyId,
        category: formData.category || 'Yatırım Fonu',
        riskLevel: formData.riskLevel,
        notes: formData.notes,
        metadata: {},
      }

      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
        credentials: 'include',
      })

      if (response.ok) {
        alert('Yatırım fonu başarıyla eklendi')
        router.push('/investments')
      } else {
        const errorData = await response.json()
        alert('Hata: ' + (errorData.error || 'Yatırım eklenemedi'))
      }
    } catch (error) {
      console.error('Yatırım eklenirken hata:', error)
      alert('Yatırım eklenirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">Yükleniyor...</div>
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="h-6 w-6 text-blue-500" />
            <h1 className="text-3xl font-bold text-blue-600">Yeni Yatırım Fonu</h1>
          </div>
          <p className="text-muted-foreground">Profesyonel yönetilen yatırım fonları</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Fon Bilgileri</CardTitle>
          <CardDescription>Yatırım fonunuzun detaylarını girin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Fon Adı *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Örn: Borsa İstanbul 100 Fonu"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fon Kodu</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={e => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  placeholder="BIST100"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="Hisse Senedi Fonu">Hisse Senedi Fonu</option>
                  <option value="Borçlanma Araçları Fonu">Borçlanma Araçları Fonu</option>
                  <option value="Karma Fon">Karma Fon</option>
                  <option value="Endeks Fon">Endeks Fon</option>
                  <option value="Altın Fon">Altın Fon</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Adet/Pay *</label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="1000"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alış Fiyatı (₺) *</label>
                <input
                  type="text"
                  value={formData.purchasePrice}
                  onChange={e => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                  placeholder="0,00"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Güncel Fiyat (₺)</label>
                <input
                  type="text"
                  value={formData.currentPrice}
                  onChange={e => setFormData(prev => ({ ...prev, currentPrice: e.target.value }))}
                  placeholder="Alış fiyatı"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alış Tarihi *</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={e => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Risk Seviyesi</label>
                <select
                  value={formData.riskLevel}
                  onChange={e => setFormData(prev => ({ ...prev, riskLevel: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Düşük Risk</option>
                  <option value="medium">Orta Risk</option>
                  <option value="high">Yüksek Risk</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Notlar</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Fon hakkında notlarınız..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={saving}
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {saving ? (
                  'Kaydediliyor...'
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Yatırımı Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

