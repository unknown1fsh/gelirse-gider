import { NextRequest, NextResponse } from 'next/server'
import { AuthService, clearAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (token) {
      await AuthService.logout(token)
    }

    // Cookie'yi temizle
    await clearAuthCookie()

    return NextResponse.json({
      success: true,
      message: 'Çıkış başarılı'
    })
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
