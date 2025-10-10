import { NextRequest, NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth-refactored'
import { prisma } from '@/lib/prisma'
import { AuthService } from '@/server/services/impl/AuthService'
import { LoginUserDTO } from '@/server/dto/UserDTO'
import { ExceptionMapper } from '@/server/errors'
import { BadRequestError } from '@/server/errors'

// Bu metot kullanıcı girişi yapar (POST).
// Girdi: NextRequest (JSON body: email, password)
// Çıktı: NextResponse (user + session + token)
// Hata: 400, 401, 500
export const POST = ExceptionMapper.asyncHandler(async (request: NextRequest) => {
  const { email, password } = await request.json()

  if (!email || !password) {
    throw new BadRequestError('E-posta ve şifre gereklidir')
  }

  // AuthService ile giriş
  const authService = new AuthService(prisma)

  const userAgent = request.headers.get('user-agent') || undefined
  const ipAddress =
    request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'

  const loginDTO = new LoginUserDTO({ email, password })
  const result = await authService.login(loginDTO, userAgent, ipAddress)

  // Cookie ayarla
  await setAuthCookie(result.session.token, result.session.expiresAt)

  return NextResponse.json(
    {
      success: true,
      user: result.user,
      session: result.session,
      message: 'Giriş başarılı',
    },
    { status: 200 }
  )
})
