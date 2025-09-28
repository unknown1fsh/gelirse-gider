import { NextRequest, NextResponse } from 'next/server'
import { AuthService, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'E-posta ve şifre gerekli' },
        { status: 400 }
      )
    }

    // Demo hesap kontrolü
    const demoAccounts = [
      { email: 'demo@giderse.com', password: 'demo123' },
      { email: 'free@giderse.com', password: 'free123' },
      { email: 'enterprise@giderse.com', password: 'enterprise123' },
      { email: 'enterprise-premium@giderse.com', password: 'ultra123' }
    ]

    const demoAccount = demoAccounts.find(acc => acc.email === email && acc.password === password)
    
    if (demoAccount) {
      const userAgent = request.headers.get('user-agent') || undefined
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       '127.0.0.1'

      const result = await AuthService.login(email, password, userAgent, ipAddress)
      
      if (result.success && result.session) {
        // Cookie'yi ayarla
        await setAuthCookie(result.session.token, result.session.expiresAt)
        
        return NextResponse.json({
          success: true,
          user: result.user,
          message: 'Giriş başarılı'
        })
      }
    }

    // Gerçek kullanıcı girişi
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1'

    const result = await AuthService.login(email, password, userAgent, ipAddress)

    if (result.success && result.session) {
      // Cookie'yi ayarla
      await setAuthCookie(result.session.token, result.session.expiresAt)
      
      return NextResponse.json({
        success: true,
        user: result.user,
        message: 'Giriş başarılı'
      })
    }

    return NextResponse.json(
      { success: false, message: result.error || 'Giriş başarısız' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
