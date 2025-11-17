'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function PaymentFailedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Ödeme Başarısız</CardTitle>
          <CardDescription>Ödeme işlemi tamamlanamadı</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              Ödeme işleminiz tamamlanamadı. Lütfen aşağıdaki nedenleri kontrol edin:
            </p>
            <ul className="text-red-700 text-sm mt-2 list-disc list-inside space-y-1">
              <li>Kart bilgilerinizi kontrol edin</li>
              <li>Bakiye yeterliliğini kontrol edin</li>
              <li>Kart limitinizi kontrol edin</li>
              <li>Bankanızla iletişime geçin</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => router.push('/premium')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tekrar Dene
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard'a Dön
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Sorun devam ederse{' '}
              <a href="mailto:support@giderse.com" className="text-purple-600 hover:underline">
                destek ekibimizle
              </a>{' '}
              iletişime geçin.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

