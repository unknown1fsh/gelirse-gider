import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, AlertCircle, Calendar } from 'lucide-react'

export default function CardsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kredi Kartları</h1>
          <p className="text-muted-foreground">
            Kredi kartı limitlerinizi ve ödeme tarihlerini takip edin
          </p>
        </div>
        <Link
          href="/cards/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
            <div className="text-2xl font-bold text-blue-600">₺ 0,00</div>
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
            <div className="text-2xl font-bold text-orange-600">₺ 0,00</div>
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
            <div className="text-2xl font-bold text-red-600">-</div>
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
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-8 w-8 mx-auto mb-2" />
            <p>Henüz kredi kartı eklenmemiş</p>
            <Link 
              href="/cards/new"
              className="text-primary hover:underline"
            >
              İlk kartınızı ekleyin
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

