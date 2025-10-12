'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = (await response.json()) as { success?: boolean; message?: string }

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.message || 'Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    } catch (err) {
      console.error('Forgot password error:', err)
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/auth/login">
            <button className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Giriş sayfasına dön
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Şifre<span className="text-blue-600">mi Unuttum</span>
          </h1>
          <p className="text-gray-600">
            E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Şifre Sıfırlama</CardTitle>
            <CardDescription>Kayıtlı e-posta adresinizi girin</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">E-posta Gönderildi</h3>
                <p className="text-gray-600 mb-6">
                  Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu
                  kontrol edin.
                </p>
                <Link href="/auth/login">
                  <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Giriş sayfasına dön
                  </button>
                </Link>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  void handleSubmit(e)
                }}
                className="space-y-4"
              >
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                </button>

                <div className="text-center text-sm text-gray-600">
                  Şifrenizi hatırladınız mı?{' '}
                  <Link href="/auth/login" className="text-blue-600 hover:underline">
                    Giriş yapın
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
