import { NextRequest, NextResponse } from 'next/server'
import { AuthService, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, plan } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Gerekli alanlar eksik' },
        { status: 400 }
      )
    }

    // Şifre uzunluk kontrolü
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      )
    }

    // E-posta format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz e-posta formatı' },
        { status: 400 }
      )
    }

    // Kullanıcı kaydı
    const result = await AuthService.register({
      name,
      email,
      phone,
      password,
      plan: plan || 'free'
    })

    if (result.success) {
      // Kayıt sonrası otomatik giriş
      const userAgent = request.headers.get('user-agent') || undefined
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       '127.0.0.1'

      const loginResult = await AuthService.login(email, password, userAgent, ipAddress)
      
      if (loginResult.success && loginResult.session) {
        // Cookie'yi ayarla
        await setAuthCookie(loginResult.session.token, loginResult.session.expiresAt)
        
        return NextResponse.json({
          success: true,
          user: loginResult.user,
          message: 'Kayıt başarılı ve giriş yapıldı'
        })
      }
    }

    return NextResponse.json(
      { success: false, message: result.error || 'Kayıt başarısız' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Register API error:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
