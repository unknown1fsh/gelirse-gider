import { Resend } from 'resend'

// Resend client instance
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@giderse.com'
const FROM_NAME = process.env.FROM_NAME || 'GiderSe Gelir'

/**
 * Email doğrulama email'i gönderir
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn('Resend API key bulunamadı, email gönderilmedi')
    return { success: false, error: 'Email servisi yapılandırılmamış' }
  }

  const verificationUrl = `${APP_URL}/auth/verify-email?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'E-posta Adresinizi Doğrulayın',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">GiderSe Gelir</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Merhaba ${name},</h2>
              
              <p style="color: #666; font-size: 16px;">
                GiderSe Gelir'e hoş geldiniz! Hesabınızı aktifleştirmek için e-posta adresinizi doğrulamanız gerekiyor.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                  E-postamı Doğrula
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Veya aşağıdaki linki tarayıcınıza yapıştırabilirsiniz:
              </p>
              <p style="color: #667eea; font-size: 12px; word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
                ${verificationUrl}
              </p>
              
              <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                Bu e-postayı siz talep etmediyseniz, lütfen görmezden gelin. Bu link 24 saat içinde geçerliliğini yitirecektir.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} GiderSe Gelir. Tüm hakları saklıdır.</p>
            </div>
          </body>
        </html>
      `,
      text: `
Merhaba ${name},

GiderSe Gelir'e hoş geldiniz! Hesabınızı aktifleştirmek için e-posta adresinizi doğrulamanız gerekiyor.

Doğrulama linki: ${verificationUrl}

Bu link 24 saat içinde geçerliliğini yitirecektir.

Bu e-postayı siz talep etmediyseniz, lütfen görmezden gelin.

© ${new Date().getFullYear()} GiderSe Gelir. Tüm hakları saklıdır.
      `.trim(),
    })

    if (error) {
      console.error('Resend email error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Email gönderme hatası:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email gönderilemedi',
    }
  }
}

/**
 * Hoş geldin email'i gönderir
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn('Resend API key bulunamadı, email gönderilmedi')
    return { success: false, error: 'Email servisi yapılandırılmamış' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'GiderSe Gelir\'e Hoş Geldiniz! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">GiderSe Gelir</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Merhaba ${name},</h2>
              
              <p style="color: #666; font-size: 16px;">
                GiderSe Gelir ailesine hoş geldiniz! 🎉
              </p>
              
              <p style="color: #666; font-size: 16px;">
                Finansal takibinizi kolaylaştırmak için buradayız. İşte başlamak için bazı ipuçları:
              </p>
              
              <ul style="color: #666; font-size: 16px; padding-left: 20px;">
                <li>İlk hesabınızı oluşturun</li>
                <li>Gelir ve gider kayıtlarınızı ekleyin</li>
                <li>Raporlarınızı inceleyin</li>
                <li>Premium özelliklerimizi keşfedin</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${APP_URL}/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                  Dashboard'a Git
                </a>
              </div>
              
              <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                Sorularınız için her zaman yanınızdayız. İyi kullanımlar!
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} GiderSe Gelir. Tüm hakları saklıdır.</p>
            </div>
          </body>
        </html>
      `,
      text: `
Merhaba ${name},

GiderSe Gelir ailesine hoş geldiniz! 🎉

Finansal takibinizi kolaylaştırmak için buradayız. Dashboard'a gitmek için: ${APP_URL}/dashboard

Sorularınız için her zaman yanınızdayız. İyi kullanımlar!

© ${new Date().getFullYear()} GiderSe Gelir. Tüm hakları saklıdır.
      `.trim(),
    })

    if (error) {
      console.error('Resend email error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Email gönderme hatası:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email gönderilemedi',
    }
  }
}

/**
 * Şifre sıfırlama email'i gönderir
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn('Resend API key bulunamadı, email gönderilmedi')
    return { success: false, error: 'Email servisi yapılandırılmamış' }
  }

  const resetUrl = `${APP_URL}/auth/reset-password?token=${resetToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Şifre Sıfırlama İsteği',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">GiderSe Gelir</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Merhaba ${name},</h2>
              
              <p style="color: #666; font-size: 16px;">
                Şifre sıfırlama isteğiniz alındı. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                  Şifremi Sıfırla
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Veya aşağıdaki linki tarayıcınıza yapıştırabilirsiniz:
              </p>
              <p style="color: #667eea; font-size: 12px; word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
              
              <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                Bu e-postayı siz talep etmediyseniz, lütfen görmezden gelin. Bu link 1 saat içinde geçerliliğini yitirecektir.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} GiderSe Gelir. Tüm hakları saklıdır.</p>
            </div>
          </body>
        </html>
      `,
      text: `
Merhaba ${name},

Şifre sıfırlama isteğiniz alındı. Yeni şifrenizi belirlemek için aşağıdaki linke tıklayın:

${resetUrl}

Bu link 1 saat içinde geçerliliğini yitirecektir.

Bu e-postayı siz talep etmediyseniz, lütfen görmezden gelin.

© ${new Date().getFullYear()} GiderSe Gelir. Tüm hakları saklıdır.
      `.trim(),
    })

    if (error) {
      console.error('Resend email error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Email gönderme hatası:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email gönderilemedi',
    }
  }
}

