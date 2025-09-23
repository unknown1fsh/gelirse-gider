import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Coins, TrendingUp, AlertCircle } from 'lucide-react'

export default function GoldPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Altın ve Ziynet</h1>
          <p className="text-muted-foreground">
            Altın yatırımlarınızı ve ziynet eşyalarınızı takip edin
          </p>
        </div>
        <Link
          href="/gold/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Coins className="mr-2 h-4 w-4" />
          Yeni Altın Eşyası
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gram</CardTitle>
            <Coins className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">0,00</div>
            <p className="text-xs text-muted-foreground">
              Toplam altın ağırlığı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alış Değeri</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₺ 0,00</div>
            <p className="text-xs text-muted-foreground">
              Toplam alış değeri
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Güncel Değer</CardTitle>
            <AlertCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₺ 0,00</div>
            <p className="text-xs text-muted-foreground">
              Güncel piyasa değeri
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kar/Zarar</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₺ 0,00</div>
            <p className="text-xs text-muted-foreground">
              Toplam kar/zarar
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Altın Eşya Listesi</CardTitle>
          <CardDescription>
            Tüm altın ve ziynet eşyalarınızın listesi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Coins className="h-8 w-8 mx-auto mb-2" />
            <p>Henüz altın eşyası eklenmemiş</p>
            <Link 
              href="/gold/new"
              className="text-primary hover:underline"
            >
              İlk altın eşyanızı ekleyin
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

