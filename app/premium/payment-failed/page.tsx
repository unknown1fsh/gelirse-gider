'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, RefreshCw, CreditCard, Phone, Mail, HelpCircle } from 'lucide-react'

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
        <CardContent className="space-y-6">
          {/* Hata nedenleri */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
            <div className="flex items-start space-x-3 mb-3">
              <HelpCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Olası Nedenler</h3>
                <p className="text-red-800 text-sm">
                  Ödeme işleminiz tamamlanamadı. Lütfen aşağıdaki nedenleri kontrol edin:
                </p>
              </div>
            </div>
            <ul className="text-red-700 text-sm mt-3 space-y-2">
              <li className="flex items-start">
                <CreditCard className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                Kart bilgileriniz (numara, CVV, son kullanma tarihi) doğru mu?
              </li>
              <li className="flex items-start">
                <CreditCard className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                Kart bakiyeniz yeterli mi?
              </li>
              <li className="flex items-start">
                <CreditCard className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                Kart limitiniz aşılmış olabilir mi?
              </li>
              <li className="flex items-start">
                <CreditCard className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                Kartınız online işlemler için aktif mi?
              </li>
            </ul>
          </div>

          {/* Alternatif çözümler */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Alternatif Ödeme Yöntemleri
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium">Banka Havalesi:</span> Hesap numaramıza havale
                  yapabilirsiniz
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium">Farklı Kart:</span> Başka bir kredi/banka kartı
                  deneyebilirsiniz
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium">Telefon:</span> Destek ekibimiz size yardımcı olabilir
                </div>
              </div>
            </div>
          </div>

          {/* Aksiyon butonları */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/premium')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Farklı Kartla Tekrar Dene
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard&apos;a Dön
            </Button>
          </div>

          {/* Destek bilgileri */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5">
            <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Yardıma mı İhtiyacınız Var?
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-purple-800">
                <Mail className="h-4 w-4 mr-2 text-purple-600" />
                <a href="mailto:support@giderse.com" className="hover:underline">
                  support@giderse.com
                </a>
              </div>
              <div className="flex items-center text-purple-800">
                <Phone className="h-4 w-4 mr-2 text-purple-600" />
                <span>+90 (850) 123 45 67</span>
              </div>
              <p className="text-purple-700 text-xs mt-3">
                Destek ekibimiz size en kısa sürede yardımcı olacaktır. Çalışma saatleri: 09:00 - 18:00
                (Hafta içi)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

