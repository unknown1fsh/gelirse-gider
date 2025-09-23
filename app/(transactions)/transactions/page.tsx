import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, List, TrendingUp, TrendingDown } from 'lucide-react'

export default function TransactionsPage() {
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
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
          <div className="text-center py-8 text-muted-foreground">
            <p>İşlem listesi yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

