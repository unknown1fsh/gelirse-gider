# Production Deployment Kılavuzu

Bu dokümantasyon, GiderSe Gelir uygulamasının Railway platformunda production'a geçişi için gerekli adımları içerir.

## Ön Gereksinimler

1. Railway hesabı (https://railway.app)
2. Resend hesabı (email servisi için) - https://resend.com
3. PayTR hesabı (kişisel ödeme linki için) - https://www.paytr.com
4. PostgreSQL veritabanı (Railway otomatik sağlar)

## 1. Email Servisi Kurulumu (Resend)

### 1.1 Resend Hesabı Oluşturma

1. https://resend.com adresine gidin
2. Hesap oluşturun
3. Dashboard'dan API Key oluşturun
4. API Key'i kopyalayın (re_ ile başlar)

### 1.2 Railway Environment Variables

Railway dashboard → Your Project → Variables → Add Environment Variable

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 1.3 Email Doğrulama

Email doğrulama sistemi otomatik olarak çalışır:
- Kullanıcı kaydı sonrası verification email gönderilir
- Email doğrulanmamış kullanıcılar için banner gösterilir
- Settings sayfasından doğrulama email'i yeniden gönderilebilir

## 2. PayTR Kişisel Ödeme Linki Kurulumu

### 2.1 PayTR Hesabı Oluşturma

1. https://www.paytr.com adresine gidin
2. "Ödeme Linki" hizmeti için başvuru yapın (şahıs olarak)
3. Merchant ID, Key ve Salt bilgilerinizi alın

### 2.2 Railway Environment Variables

Railway dashboard → Your Project → Variables → Add Environment Variable

```
PAYTR_MERCHANT_ID=your-merchant-id
PAYTR_MERCHANT_KEY=your-merchant-key
PAYTR_MERCHANT_SALT=your-merchant-salt
PAYTR_API_URL=https://www.paytr.com/odeme
```

### 2.3 PayTR Webhook URL

PayTR dashboard'da webhook URL'ini ayarlayın:
```
https://your-app.railway.app/api/subscription/paytr-webhook
```

### 2.4 Ödeme Akışı

1. Kullanıcı premium/enterprise upgrade butonuna tıklar
2. Backend PayTR'dan ödeme linki oluşturur
3. Kullanıcı PayTR ödeme sayfasına yönlendirilir
4. Ödeme sonrası webhook ile subscription aktif edilir
5. Kullanıcı success sayfasına yönlendirilir

## 3. Environment Variables Listesi

Railway dashboard'da aşağıdaki environment variable'ları ekleyin:

### Zorunlu Variables

```bash
# Database (Railway otomatik ekler)
DATABASE_URL=postgresql://...

# Next.js
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.railway.app

# Authentication
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=your-32-character-secret-key-here

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-minimum-32-characters
```

### Email Service (Resend)

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### PayTR Payment Gateway

```bash
PAYTR_MERCHANT_ID=your-merchant-id
PAYTR_MERCHANT_KEY=your-merchant-key
PAYTR_MERCHANT_SALT=your-merchant-salt
PAYTR_API_URL=https://www.paytr.com/odeme
```

## 4. Database Migration

Railway deployment sonrası migration'lar otomatik çalışır (`npm start` script'i). 

Manuel migration için:
```bash
railway connect
npx prisma migrate deploy
```

## 5. Güvenlik Kontrolleri

### 5.1 Password Policy

- Minimum 8 karakter (production'da zorunlu)
- Şifre gücü kontrolü (opsiyonel, eklenebilir)

### 5.2 Rate Limiting

- Login: 5 istek/dakika
- Register: 3 istek/dakika
- IP bazlı rate limiting aktif

### 5.3 HTTPS

- Production'da HTTPS zorunlu
- Middleware otomatik HTTP → HTTPS redirect yapar

### 5.4 Security Headers

Aşağıdaki security headers aktif:
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- Content-Security-Policy

## 6. Email Verification Zorunluluğu

Kritik işlemler için email verification kontrolü:
- Premium/Enterprise subscription upgrade
- Şifre değiştirme (opsiyonel, eklenebilir)

## 7. Monitoring ve Health Check

### 7.1 Health Check Endpoint

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-26T...",
  "database": "connected",
  "environment": {
    "valid": true,
    "errors": [],
    "warnings": []
  }
}
```

### 7.2 Log Monitoring

Railway dashboard'dan logları izleyin:
- Railway dashboard → Your Project → Deployments → Logs

## 8. Troubleshooting

### 8.1 Email Gönderilmiyor

- RESEND_API_KEY doğru mu kontrol edin
- Resend dashboard'dan API limit kontrolü yapın
- Railway logs'da email gönderme hatalarını kontrol edin

### 8.2 PayTR Ödeme Linki Oluşturulamıyor

- PayTR API bilgileri doğru mu kontrol edin
- PayTR test mode aktif mi kontrol edin
- Railway logs'da PayTR API hatalarını kontrol edin

### 8.3 Database Bağlantı Hatası

- DATABASE_URL doğru mu kontrol edin
- Railway PostgreSQL service çalışıyor mu kontrol edin
- Migration'lar tamamlandı mı kontrol edin

## 9. Post-Deployment Checklist

- [ ] Tüm environment variables eklendi
- [ ] Database migration'ları tamamlandı
- [ ] Email doğrulama test edildi
- [ ] PayTR ödeme akışı test edildi (test mode)
- [ ] Health check endpoint çalışıyor
- [ ] HTTPS zorunluluğu aktif
- [ ] Rate limiting çalışıyor
- [ ] Security headers aktif
- [ ] Log monitoring çalışıyor

## 10. İlk Kullanıcı Testi

1. Yeni kullanıcı kaydı yapın
2. Email doğrulama email'ini kontrol edin
3. Email'i doğrulayın
4. Premium upgrade butonuna tıklayın
5. PayTR ödeme sayfasına yönlendirildiğini kontrol edin
6. Test ödeme yapın (PayTR test mode)
7. Success sayfasına yönlendirildiğini kontrol edin
8. Subscription'ın aktif olduğunu kontrol edin

## 11. Support

Sorularınız için:
- Railway Docs: https://docs.railway.app
- Resend Docs: https://resend.com/docs
- PayTR Docs: https://www.paytr.com/odeme/api

---

**Son Güncelleme:** 2025-01-26
**Versiyon:** 2.1.1

