# Railway Environment Variables Setup - Adım Adım

## 🚀 Hızlı Kurulum

Railway dashboard → Your Project → Variables → Add Environment Variable

## 📋 Ekleyeceğiniz Değişkenler

### 1. NEXTAUTH_URL

```
Key: NEXTAUTH_URL
Value: https://giderse-gelir.up.railway.app
```

### 2. NEXTAUTH_SECRET

```
Key: NEXTAUTH_SECRET
Value: ikOmXJxNqS1YZXX7qyYYLVmicURJXSZDDoa58j8Mw0w=
```

### 3. NODE_ENV

```
Key: NODE_ENV
Value: production
```

### 4. NEXT_PUBLIC_APP_URL

```
Key: NEXT_PUBLIC_APP_URL
Value: https://giderse-gelir.up.railway.app
```

### 5. DATABASE_URL (Otomatik)

Railway PostgreSQL service eklendiğinde otomatik eklenir.

## 📝 Adım Adım Kurulum

### Adım 1: Railway Dashboard'a Git

1. https://railway.app/dashboard
2. Projenizi seçin: "giderse-gelir"
3. "Variables" sekmesine tıklayın

### Adım 2: Environment Variables Ekle

Her bir variable için:

1. "+ New Variable" butonuna tıklayın
2. Key ve Value'yu girin
3. "Add" butonuna tıklayın

**Eklenecek Variables:**

```
NEXTAUTH_URL = https://giderse-gelir.up.railway.app
NEXTAUTH_SECRET = ikOmXJxNqS1YZXX7qyYYLVmicURJXSZDDoa58j8Mw0w=
NODE_ENV = production
NEXT_PUBLIC_APP_URL = https://giderse-gelir.up.railway.app
```

### Adım 3: PostgreSQL Service Kontrol

1. Railway dashboard'da "+ New" butonuna tıklayın
2. "Database" → "PostgreSQL" seçin
3. PostgreSQL service oluşturulur ve DATABASE_URL otomatik eklenir

### Adım 4: Deploy Kontrolü

Variables eklendikten sonra:

1. Railway otomatik olarak redeploy başlatır
2. Build logs'u kontrol edin
3. "Deployments" sekmesinden logları izleyin

## ✅ Kontrol Listesi

Railway dashboard'da şunları kontrol edin:

- [ ] PostgreSQL service eklendi
- [ ] DATABASE_URL environment variable var
- [ ] NEXTAUTH_URL eklendi
- [ ] NEXTAUTH_SECRET eklendi (32+ karakter)
- [ ] NODE_ENV=production
- [ ] NEXT_PUBLIC_APP_URL eklendi
- [ ] Deploy başarılı
- [ ] Application started

## 🔍 Troubleshooting

### Sorun: 502 Bad Gateway

**Neden:** Environment variables eksik veya uygulama başlamıyor

**Çözüm:**

1. Tüm variables eklendi mi kontrol et
2. Railway logs'a bak: Deployments → Latest → Logs
3. "Application failed to start" hatası varsa, DATABASE_URL kontrol et

### Sorun: Migration Failed

**Neden:** DATABASE_URL eksik veya yanlış

**Çözüm:**

1. PostgreSQL service eklendi mi kontrol et
2. DATABASE_URL variable'ı doğru mu kontrol et
3. Railway Connect shell ile migration'ı manuel çalıştır:
   ```bash
   npx prisma migrate deploy
   ```

### Sorun: Build Success ama App Not Started

**Neden:** Start command hatalı veya environment variables eksik

**Çözüm:**

1. railway.json'da startCommand kontrol et
2. Tüm environment variables eklendi mi kontrol et
3. Railway logs'da "npm run start" çıktısını kontrol et

## 📊 Beklenen Log Çıktısı

Railway dashboard → Logs'da görmelisiniz:

```
✓ Prisma Client generated
✓ Prisma migrate deploy successful
✓ Next.js production build successful
✓ Starting application on port 3000
✓ Application started successfully
✓ Listening on 0.0.0.0:PORT
```

## 🎯 Son Test

Variables eklendikten sonra:

1. Birkaç dakika bekleyin (redeploy)
2. https://giderse-gelir.up.railway.app adresine gidin
3. Health check: https://giderse-gelir.up.railway.app/api/health
4. Login sayfası: https://giderse-gelir.up.railway.app/auth/login

## 🔐 Güvenlik Notları

⚠️ **NEXTAUTH_SECRET'ı asla paylaşmayın!**
⚠️ **Production'da farklı bir secret kullanın**
⚠️ **GitHub'a asla commit etmeyin**

## 📞 Destek

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- Troubleshooting: docs/RAILWAY_TROUBLESHOOTING.md
