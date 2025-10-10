import { NextRequest, NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth-refactored'
import { prisma } from '@/lib/prisma'
import { AuthService } from '@/server/services/impl/AuthService'
import { RegisterUserDTO } from '@/server/dto/UserDTO'
import { ExceptionMapper } from '@/server/errors'
import { BadRequestError } from '@/server/errors'

// Bu metot yeni kullanıcı kaydı oluşturur (POST).
// Girdi: NextRequest (JSON body: name, email, password, phone?, plan?)
// Çıktı: NextResponse (user bilgisi + token)
// Hata: 400, 409, 500
export const POST = ExceptionMapper.asyncHandler(async (request: NextRequest) => {
  const { name, email, phone, password, plan } = await request.json()

  // Validation
  if (!name || !email || !password) {
    throw new BadRequestError('Gerekli alanlar eksik (name, email, password)')
  }

  if (password.length < 6) {
    throw new BadRequestError('Şifre en az 6 karakter olmalıdır')
  }

  // E-posta format kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new BadRequestError('Geçersiz e-posta formatı')
  }

  // AuthService ile kullanıcı kaydı
  const authService = new AuthService(prisma)

  const registerDTO = new RegisterUserDTO({
    name,
    email,
    phone,
    password,
    plan: plan || 'free',
  })

  const user = await authService.register(registerDTO)

  // Kayıt sonrası otomatik giriş
  const userAgent = request.headers.get('user-agent') || undefined
  const ipAddress =
    request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'

  const loginResult = await authService.login({ email, password }, userAgent, ipAddress)

  // Cookie ayarla
  await setAuthCookie(loginResult.session.token, loginResult.session.expiresAt)

  return NextResponse.json(
    {
      success: true,
      user: loginResult.user,
      session: loginResult.session,
      message: 'Kayıt başarılı ve giriş yapıldı',
    },
    { status: 201 }
  )
})
