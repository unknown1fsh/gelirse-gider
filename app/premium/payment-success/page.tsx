'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  const merchantOid = searchParams.get('merchant_oid')

  useEffect(() => {
    // Ödeme durumunu kontrol et ve subscription'ı güncelle
    if (merchantOid) {
      // PayTR webhook zaten subscription'ı güncellemiş olmalı
      // Burada sadece kullanıcıyı bilgilendiriyoruz
      setLoading(false)
      setSuccess(true)
    } else {
      setLoading(false)
      setSuccess(false)
    }
  }, [merchantOid])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {loading ? (
            <>
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold">Ödeme Kontrol Ediliyor</CardTitle>
              <CardDescription>Lütfen bekleyin...</CardDescription>
            </>
          ) : success ? (
            <>
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600">Ödeme Başarılı!</CardTitle>
              <CardDescription>Aboneliğiniz aktif edildi</CardDescription>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-600">Ödeme Bilgisi Bulunamadı</CardTitle>
              <CardDescription>Ödeme durumunuzu kontrol edin</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  Ödemeniz başarıyla tamamlandı. Premium özellikleriniz aktif edildi. Artık tüm
                  premium özelliklere erişebilirsiniz!
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  Dashboard'a Git
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => router.push('/premium')}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Premium Özellikleri Keşfet
                </Button>
              </div>
            </>
          )}

          {!loading && !success && (
            <div className="space-y-2">
              <p className="text-gray-600 text-sm text-center">
                Ödeme bilgisi bulunamadı. Eğer ödemeniz tamamlandıysa, lütfen birkaç dakika bekleyin
                veya destek ekibimizle iletişime geçin.
              </p>
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full"
                size="lg"
              >
                Dashboard'a Dön
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

