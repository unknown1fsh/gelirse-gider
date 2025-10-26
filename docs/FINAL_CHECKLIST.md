# 🎯 Railway Deployment - Kesin Kontrol Listesi

## ❗ 502 Bad Gateway Hatası İçin Adım Adım Çözüm

### ✅ Adım 1: Railway Dashboard Kontrolleri

#### 1.1 Service Kontrolü

Railway dashboard'da:

- [ ] **2 service olmalı:**
  - Web Service (Next.js app)
  - PostgreSQL Database

#### 1.2 PostgreSQL Service

- [ ] "New" butonu → "Database" → "PostgreSQL" eklendi mi?
- [ ] PostgreSQL service görünüyor mu?
- [ ] DATABASE_URL otomatik eklendi mi?

### ✅ Adım 2: Environment Variables Kontrolü

Railway dashboard → Your Project → **Variables** sekmesi

**Tüm bu variables ekli olmalı:**

```bash
✅ NEXTAUTH_URL=https://giderse-gelir.up.railway.app
✅ NEXTAUTH_SECRET=ikOmXJxNqS1YZXX7qyYYLVmicURJXSZDDoa58j8Mw0w=
✅ NODE_ENV=production
✅ NEXT_PUBLIC_APP_URL=https://giderse-gelir.up.railway.app
✅ DATABASE_URL=postgresql://... (otomatik, PostgreSQL eklenince)
```

**Her bir variable için:**

1. "New Variable" tıkla
2. Key ve Value gir
3. "Add" tıkla

### ✅ Adım 3: Build Command Kontrolü

Railway dashboard → **Settings** → **Build & Deploy**

**Kontrol et:**

- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm run start`
- [ ] Watch paths: `.`

### ✅ Adım 4: Deploy Logs Kontrolü

Railway dashboard → **Deployments** → **Latest Deployment** → **View Logs**

**Görmelisiniz:**

```
✓ npm install
✓ Prisma Client generated
✓ Next.js build successful
✓ Migration successful
✓ Application started on port 3000
```

**Eğer hata varsa:**

- Hata mesajı ne?
- DATABASE_URL eksik mi?
- Build failed mi?

### ✅ Adım 5: Port ve Networking

Railway dashboard → **Settings** → **Networking**

- [ ] Service'e public URL atanmış: `https://giderse-gelir.up.railway.app`
- [ ] Port: **3000** veya Railway otomatik atar
- [ ] Health check: `/api/health`

### ✅ Adım 6: Railway.json Doğruluk

`railway.json` dosyası:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start"
  }
}
```

### ✅ Adım 7: package.json Kontrolü

`package.json` içinde:

```json
"scripts": {
  "build": "next build",
  "start": "npm run db:migrate && next start",
  "db:migrate": "prisma migrate deploy"
}
```

## 🔧 Manuel Kontroller

### Console Kontrolleri

1. **GitHub Push Kontrolü**

```bash
git log --oneline -5
# Son commit Railway'a gitti mi?
```

2. **Local Build Test**

```bash
npm install
npm run build
# Build başarılı mı?
```

3. **Local Start Test**

```bash
DATABASE_URL="postgresql://..." npm start
# Uygulama başlıyor mu?
```

## 🚨 Common Issues ve Çözümleri

### Issue 1: Build Command Çalışmıyor

**Belirti:** Build log'da "npm: command not found"

**Çözüm:**
railway.json'a explicit buildCommand ekle:

```json
"buildCommand": "npm install && npm run build"
```

### Issue 2: Migration Failed

**Belirti:** Build başarılı ama app başlamıyor

**Çözüm:**
Start command'e migration ekle (zaten var):

```json
"startCommand": "npm run start"
```

package.json'da:

```json
"start": "npm run db:migrate && next start"
```

### Issue 3: Environment Variables Eksik

**Belirti:** "Cannot find DATABASE_URL"

**Çözüm:**
Railway dashboard → Variables → Tüm variables'ı tekrar ekle

### Issue 4: Port Conflict

**Belirti:** "Port 3000 already in use"

**Çözüm:**
Railway otomatik port atar, kod kontrolü yapma

### Issue 5: 502 Bad Gateway

**Çözüm:**

1. Tüm environment variables ekli mi kontrol et
2. PostgreSQL service eklendi mi kontrol et
3. Logs'da hata var mı kontrol et
4. Redeploy et: "Settings" → "Redeploy"

## 📊 Health Check Testi

Railway deploy tamamlandıktan sonra:

```bash
# Health check endpoint
curl https://giderse-gelir.up.railway.app/api/health
```

**Expected Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-01-26T...",
  "database": "connected"
}
```

**Eğer 502 dönerse:**

- Application başlamamış
- Environment variables eksik
- Database bağlantı hatası

## 🎯 Son Adımlar

1. **Tüm variables'ı ekle** (en önemli!)
2. **PostgreSQL service ekle**
3. **Railway json dosyasını push et**
4. **5 dakika bekle** (redeploy)
5. **Health check endpoint test et**
6. **Ana sayfayı test et**

## ✅ Final Checklist

Railway'de şu adımları tamamladınız mı?

- [ ] PostgreSQL service eklendi
- [ ] NEXTAUTH_URL ekli
- [ ] NEXTAUTH_SECRET ekli (32+ karakter)
- [ ] NODE_ENV=production ekli
- [ ] NEXT_PUBLIC_APP_URL ekli
- [ ] DATABASE_URL otomatik eklendi
- [ ] railway.json doğru
- [ ] Build başarılı
- [ ] Application başladı
- [ ] Health check endpoint çalışıyor
- [ ] Ana sayfa açılıyor

**Hepsi ✅ ise ama hala 502:**
Railway dashboard → **Settings** → **Redeploy** butonuna bas

## 📞 Destek

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app/deploy/builds
