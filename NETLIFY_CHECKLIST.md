# ✅ Netlify Deployment Checklist

Deployment öncesi bu checklist'i kontrol edin.

## 🔍 Pre-Deployment

- [ ] GitHub repository'si public veya Netlify'a erişim verilmiş
- [ ] `netlify.toml` dosyası root'ta
- [ ] `package.json`'da `build:netlify` script'i var
- [ ] `.gitignore` dosyası güncel (.env, .next, node_modules)
- [ ] Neon database aktif ve erişilebilir

## 🔐 Environment Variables (Netlify Dashboard)

Netlify → Site Settings → Environment Variables:

- [ ] `DATABASE_URL` (Neon pooler URL ile)
- [ ] `DIRECT_URL` (Neon direct URL ile)
- [ ] `NEXTAUTH_URL` (Netlify site URL'i)
- [ ] `NEXTAUTH_SECRET` (openssl rand -base64 32 ile oluştur)
- [ ] `JWT_SECRET` (openssl rand -base64 32 ile oluştur)
- [ ] `NODE_ENV=production`

## 🗄️ Database Setup

Lokal terminalden çalıştır:

```bash
# Production database URL'i .env'e ekle (geçici)
DATABASE_URL="postgresql://neondb_owner:npg_j8gikC0fDGhZ@ep-solitary-scene-ae5rw54m-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

# Migration çalıştır
npx prisma migrate deploy

# (Opsiyonel) Test datası ekle
npx tsx prisma/seed.ts
```

- [ ] Migrations başarıyla çalıştı
- [ ] Database tabloları oluşturuldu
- [ ] Test user oluşturuldu (seed ile)

## 🔧 Build Settings (Netlify)

- [ ] Build command: `npm run build:netlify` veya auto-detect
- [ ] Publish directory: `.next`
- [ ] Node version: 18 (netlify.toml'da tanımlı)

## 📦 Plugins

Netlify Dashboard → Plugins:

- [ ] "Essential Next.js Build Plugin" yüklü

## 🚀 First Deploy

- [ ] "Deploy site" butonuna tıkla
- [ ] Build logs'u izle (3-5 dakika)
- [ ] Build başarılı: ✅
- [ ] Site preview çalışıyor: ✅

## 🧪 Post-Deployment Testing

Site URL'inde test et:

- [ ] Landing page açılıyor
- [ ] Login sayfası çalışıyor
- [ ] Yeni kullanıcı oluşturulabiliyor
- [ ] Login çalışıyor
- [ ] Dashboard yükleniyor
- [ ] Mobil görünüm test edildi (hamburger menu)
- [ ] Transactions sayfası çalışıyor
- [ ] Hesaplar sayfası çalışıyor

## 📱 Mobil Test

- [ ] iPhone (Safari) test edildi
- [ ] Android (Chrome) test edildi
- [ ] Hamburger menu açılıp kapanıyor
- [ ] Sidebar overlay çalışıyor
- [ ] Kartlar responsive görünüyor
- [ ] Touch events çalışıyor

## 🔒 Security Check

- [ ] HTTPS aktif (otomatik Netlify SSL)
- [ ] Environment variables güvenli
- [ ] Database credentials expose edilmemiş
- [ ] CORS ayarları doğru

## 📊 Monitoring Setup

- [ ] Netlify Analytics aktif (opsiyonel)
- [ ] Deploy notifications ayarlanmış (Slack/Email)
- [ ] Error tracking kurulmuş (Sentry vb. - opsiyonel)

## 🎯 Domain Setup (Opsiyonel)

- [ ] Custom domain eklenmiş
- [ ] DNS records ayarlanmış
- [ ] SSL certificate aktif
- [ ] NEXTAUTH_URL domain ile güncellenmiş

## 🔄 Continuous Deployment

Test et:

- [ ] Git push → otomatik deploy tetikleniyor
- [ ] PR açıldığında preview deploy oluşuyor
- [ ] Build hatası varsa notification geliyor

## ✨ Tamamlandı!

Tüm checkler ✅ ise deployment başarılı!

🎉 Site canlı: https://YOUR-SITE.netlify.app

## 🐛 Sorun mu var?

`NETLIFY_DEPLOYMENT_GUIDE.md` dosyasındaki sorun giderme bölümüne bakın.

