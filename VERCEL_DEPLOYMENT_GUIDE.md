# 🚀 Vercel Deployment Rehberi - GiderSE-Gelir

Bu rehber, GiderSE-Gelir uygulamasını Vercel'e deploy etmek için adım adım talimatlar içerir.

## 📋 Ön Koşullar

- [ ] GitHub hesabı
- [ ] Vercel hesabı (https://vercel.com)
- [ ] PostgreSQL database (Neon, Supabase veya Vercel Postgres)

## 🎯 Deployment Adımları

### 1️⃣ Database Kurulumu

#### Seçenek A: Neon (Önerilen - Ücretsiz)

1. https://neon.tech adresine git
2. Yeni bir proje oluştur
3. Database adı: `gidersegelir`
4. Connection string'i kopyala (2 tane alacaksınız):
   - **Pooled connection** → `DATABASE_URL` için
   - **Direct connection** → `DIRECT_URL` için

#### Seçenek B: Supabase

1. https://supabase.com adresine git
2. Yeni bir proje oluştur
3. Settings → Database → Connection String
4. Connection pooling'i aktif et
5. Her iki connection string'i de kopyala

#### Seçenek C: Vercel Postgres

1. Vercel Dashboard → Storage → Create Database
2. Postgres'i seç
3. Connection string'leri kopyala

### 2️⃣ GitHub Repository Hazırlığı

```bash
# Tüm değişiklikleri commit et
git add .
git commit -m "feat: Production için hazırlık"
git push origin master
```

### 3️⃣ Vercel'e Deployment

#### Yöntem 1: Vercel Dashboard (Kolay)

1. https://vercel.com/dashboard adresine git
2. **"Add New..." → "Project"** butonuna tıkla
3. GitHub repository'nizi seçin: `giderseGelir`
4. **"Import"** butonuna tıkla

#### Framework Ayarları

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build (otomatik)
Output Directory: .next (otomatik)
Install Command: npm install (otomatik)
```

### 4️⃣ Environment Variables Kurulumu

#### Otomatik Import (Önerilen)

1. Vercel project sayfasında **Settings → Environment Variables**
2. **"Import .env" düğmesine** tıkla veya manuel olarak ekle:

#### Manuel Ekleme

Aşağıdaki değişkenleri ekleyin:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Auth (MUTLAKA güçlü bir secret kullanın!)
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="[BURAYA openssl rand -base64 32 ÇIKTISINI YAPIŞTIRIN]"

# App
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

#### 🔐 Secret Key Oluşturma

**Windows (PowerShell):**

```powershell
# Yöntem 1: OpenSSL
openssl rand -base64 32

# Yöntem 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Mac/Linux:**

```bash
openssl rand -base64 32
```

#### Environment Scope Seçimi

Her değişken için **3 ortamı da seçin**:

- ✅ Production
- ✅ Preview
- ✅ Development

### 5️⃣ Database Migration

Vercel'e ilk deploy sonrası, database'i migrate etmeniz gerekir:

#### Yöntem 1: Vercel CLI (Önerilen)

```bash
# Vercel CLI yükle (eğer yoksa)
npm i -g vercel

# Vercel'e login
vercel login

# Projeyi linkit
vercel link

# Environment variables'ı çek
vercel env pull

# Database migrate
npx prisma migrate deploy

# Prisma client oluştur
npx prisma generate

# Seed data (opsiyonel - demo kullanıcılar için)
npx prisma db seed
```

#### Yöntem 2: GitHub Actions (Otomatik)

`.github/workflows/deploy.yml` dosyası oluşturun:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### 6️⃣ Domain Ayarları (Opsiyonel)

1. Vercel Dashboard → **Settings → Domains**
2. Özel domain ekle: `gidersegelir.com`
3. DNS kayıtlarını güncelle (Vercel size rehberlik eder)
4. SSL sertifikası otomatik oluşur

### 7️⃣ Build Settings (Opsiyonel Optimizasyonlar)

**Settings → General:**

```bash
# Build Command
npm run build && npx prisma generate

# Install Command
npm ci

# Development Command
npm run dev
```

**Node.js Version:**

- Versiyon 18.x veya 20.x seçin

### 8️⃣ Deployment'ı Test Et

1. Deployment tamamlandıktan sonra Vercel size bir URL verecek:
   - Production: `https://your-app.vercel.app`
   - Preview: Her PR için otomatik URL

2. Uygulamayı test edin:
   - ✅ Ana sayfa yükleniyor mu?
   - ✅ Login/Register çalışıyor mu?
   - ✅ Dashboard veriler geliyor mu?
   - ✅ Dönem sistemi çalışıyor mu?

### 9️⃣ Production Checklist

Deployment'tan önce kontrol edin:

#### Güvenlik

- [ ] `NEXTAUTH_SECRET` güçlü ve unique
- [ ] Database credentials güvenli
- [ ] `.env` dosyaları `.gitignore`'da
- [ ] API rate limiting aktif
- [ ] CORS ayarları yapıldı

#### Performance

- [ ] Database connection pooling aktif
- [ ] Image optimization aktif
- [ ] Static pages cache'leniyor
- [ ] API routes optimize

#### Fonksiyonalite

- [ ] Tüm sayfalar yükleniyor
- [ ] Authentication çalışıyor
- [ ] Database queries çalışıyor
- [ ] Dönem sistemi çalışıyor
- [ ] Premium features gizli/gösteriliyor

#### Monitoring

- [ ] Vercel Analytics aktif
- [ ] Error tracking (Sentry) kurulu
- [ ] Database monitoring aktif

## 🔧 Yaygın Sorunlar ve Çözümler

### Sorun: "Module not found" hatası

```bash
# Çözüm: node_modules'i temizle ve yeniden yükle
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: Update package-lock"
git push
```

### Sorun: Prisma Client hatası

```bash
# Çözüm: Build command'e prisma generate ekle
# Vercel Settings → General → Build Command:
npm run build && npx prisma generate
```

### Sorun: Database connection timeout

```bash
# Çözüm: DATABASE_URL'de connection pooling kullan
DATABASE_URL="postgresql://...?pgbouncer=true&connect_timeout=15"
```

### Sorun: Environment variables yüklenmiyor

```bash
# Çözüm: Vercel'de tüm ortamlar için ayarlandığından emin olun
# Production + Preview + Development hepsini seçin
```

### Sorun: "Invalid host header" hatası

```bash
# Çözüm: next.config.js'e ekleyin:
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}
```

## 📊 Deployment Sonrası

### Analytics

- Vercel Analytics'i aktif edin (ücretsiz)
- Google Analytics ekleyin (opsiyonel)

### Monitoring

- Vercel logs'u kontrol edin
- Error rate'i izleyin
- Performance metrics

### Backups

- Database backup stratejisi oluşturun
- Neon/Supabase otomatik backup yapar
- Manuel backup schedule'ı ayarlayın

## 🎉 Tebrikler!

Uygulamanız artık production'da! 🚀

### Yararlı Linkler

- **Production URL:** https://your-app.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

### Sonraki Adımlar

1. Custom domain ekle
2. Email notifications kurulum
3. Payment gateway entegrasyonu
4. Advanced analytics
5. Backup strategy

## 💬 Destek

Sorun yaşarsanız:

1. Vercel logs kontrol edin
2. GitHub Issues açın
3. Documentation'ı inceleyin

---

**Son Güncelleme:** 2025-10-11
**Versiyon:** 2.0.0
