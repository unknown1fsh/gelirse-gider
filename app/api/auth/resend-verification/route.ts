import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import { ExceptionMapper } from '@/server/errors'
import { BadRequestError, NotFoundError } from '@/server/errors'
import crypto from 'crypto'

// Bu metot email doğrulama email'ini yeniden gönderir (POST).
// Girdi: NextRequest (JSON body: email)
// Çıktı: NextResponse (success message)
// Hata: 400, 404, 500
export const POST = ExceptionMapper.asyncHandler(async (request: NextRequest) => {
  const { email } = await request.json()

  if (!email) {
    throw new BadRequestError('E-posta adresi gerekli')
  }

  // Kullanıcıyı bul
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user) {
    // Güvenlik için kullanıcı bulunamasa bile başarılı mesajı döndür
    return NextResponse.json({
      success: true,
      message: 'Eğer bu e-posta adresi sistemimizde kayıtlıysa, doğrulama e-postası gönderilecektir.',
    })
  }

  // Email zaten doğrulanmış mı kontrol et
  if (user.emailVerified) {
    return NextResponse.json(
      {
        success: true,
        message: 'E-posta adresiniz zaten doğrulanmış',
      },
      { status: 200 }
    )
  }

  // Yeni verification token oluştur
  const verificationToken = crypto.randomBytes(32).toString('hex')
  const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 saat

  // Token'ı veritabanına kaydet
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry,
    },
  })

  // Email gönder
  const emailResult = await sendVerificationEmail(user.email, user.name, verificationToken)

  if (!emailResult.success) {
    console.error('Email gönderme hatası:', emailResult.error)
    // Email gönderilemese bile token kaydedildi, kullanıcıya genel bir mesaj döndür
    return NextResponse.json(
      {
        success: false,
        message: 'Doğrulama e-postası gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Doğrulama e-postası gönderildi. Lütfen e-posta kutunuzu kontrol edin.',
  })
})

