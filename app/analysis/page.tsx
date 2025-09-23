import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, PieChart, FileText } from 'lucide-react'

export default function AnalysisPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analiz ve Raporlar</h1>
        <p className="text-muted-foreground">
          Finansal durumunuzu analiz edin ve raporlar oluşturun
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/analysis/cashflow">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nakit Akışı</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">📊</div>
              <p className="text-xs text-muted-foreground">
                Aylık nakit akış analizi
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analysis/categories">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kategori Analizi</CardTitle>
              <PieChart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">🥧</div>
              <p className="text-xs text-muted-foreground">
                Harcama kategorileri dağılımı
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analysis/trends">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trend Analizi</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">📈</div>
              <p className="text-xs text-muted-foreground">
                Gelir ve gider trendleri
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analysis/export">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rapor Export</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">📄</div>
              <p className="text-xs text-muted-foreground">
                PDF ve Excel raporları
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hızlı İstatistikler</CardTitle>
            <CardDescription>
              Genel finansal durumunuz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bu Ay Gelir</span>
                <span className="text-sm text-green-600">₺ 0,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bu Ay Gider</span>
                <span className="text-sm text-red-600">₺ 0,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Net Durum</span>
                <span className="text-sm text-blue-600">₺ 0,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Toplam Varlık</span>
                <span className="text-sm text-purple-600">₺ 0,00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
            <CardDescription>
              En son gerçekleşen işlemler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-8 w-8 mx-auto mb-2" />
              <p>Henüz işlem bulunmuyor</p>
              <Link 
                href="/transactions/new"
                className="text-primary hover:underline"
              >
                İlk işleminizi ekleyin
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

