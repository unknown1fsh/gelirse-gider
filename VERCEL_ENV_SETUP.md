# 🔧 Vercel Environment Variables Kurulumu

## 📋 Adım Adım Kurulum

### 1️⃣ Vercel Dashboard'a Git

https://vercel.com/dashboard adresinden projenize girin.

### 2️⃣ Environment Variables Sayfasını Aç

**Settings → Environment Variables**

### 3️⃣ Aşağıdaki Değişkenleri Ekle

Her değişken için:

1. **Key** (sol kolon) - Değişken adı
2. **Value** (sağ kolon) - Değer
3. **Environments** - ✅ Production, ✅ Preview, ✅ Development (hepsini seç!)
4. **Add** düğmesine bas

---

## 🗃️ Database Configuration

### DATABASE_URL

```
postgresql://neondb_owner:npg_XDEjb4L2VQoa@ep-divine-moon-admvz4nr-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15
```

**Ortamlar:** ✅ Production ✅ Preview ✅ Development

---

### DIRECT_URL

```
postgresql://neondb_owner:npg_XDEjb4L2VQoa@ep-divine-moon-admvz4nr.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Ortamlar:** ✅ Production ✅ Preview ✅ Development

---

## 🔐 Authentication

### NEXTAUTH_SECRET

```
McH8kBUNbkAXXQvttNGDnQaQUPL6tsASwt4SyXVijF4=
```

**Ortamlar:** ✅ Production ✅ Preview ✅ Development

---

### NEXTAUTH_URL

İlk deployment sonrası Vercel size bir URL verecek. O URL'i buraya yazın:

```
https://your-app-name.vercel.app
```

**NOT:** İlk deployment sonrası bu değeri güncellemeyi unutmayın!

**Ortamlar:** ✅ Production ✅ Preview ✅ Development

---

## 🌐 Application Settings

### NODE_ENV

```
production
```

**Ortamlar:** ✅ Production

---

### NEXT_PUBLIC_APP_URL

Deployment URL'iniz (NEXTAUTH_URL ile aynı):

```
https://your-app-name.vercel.app
```

**Ortamlar:** ✅ Production ✅ Preview ✅ Development

---

## ✅ Kontrol Listesi

Environment variables ekledikten sonra:

- [ ] DATABASE_URL eklendi (pooled connection)
- [ ] DIRECT_URL eklendi (direct connection)
- [ ] NEXTAUTH_SECRET eklendi
- [ ] NEXTAUTH_URL placeholder olarak eklendi (sonra güncellenecek)
- [ ] NODE_ENV eklendi (sadece Production)
- [ ] NEXT_PUBLIC_APP_URL placeholder olarak eklendi (sonra güncellenecek)
- [ ] Tüm değişkenler için doğru ortamlar seçildi

---

## 🔄 Redeploy

Environment variables'ı ekledikten sonra:

1. **Deployments** sekmesine git
2. En son deployment'ı bul
3. **⋮ (üç nokta)** → **Redeploy** tıkla
4. ✅ **Use existing build cache** işaretini KALDIR
5. **Redeploy** butonuna bas

---

## 🗄️ Database Migration

İlk başarılı deployment sonrası database'i migrate etmeniz gerekiyor:

### Yöntem 1: Vercel CLI (Önerilen)

```bash
# Vercel CLI yükle (eğer yoksa)
npm i -g vercel

# Login
vercel login

# Projeyi linkit
vercel link

# Environment variables'ları çek
vercel env pull

# Prisma migrate
npx prisma migrate deploy

# Seed data (opsiyonel - demo kullanıcılar için)
npx prisma db seed
```

### Yöntem 2: Local Migration

`.env` dosyanızı oluşturun:

```env
DATABASE_URL=postgresql://neondb_owner:npg_XDEjb4L2VQoa@ep-divine-moon-admvz4nr-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://neondb_owner:npg_XDEjb4L2VQoa@ep-divine-moon-admvz4nr.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Sonra çalıştırın:

```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 🎯 Son Adımlar

1. **Migration başarılı olduktan sonra:**
   - Vercel deployment URL'ini kopyalayın
   - `NEXTAUTH_URL` ve `NEXT_PUBLIC_APP_URL` değişkenlerini güncelleyin
   - Tekrar redeploy yapın

2. **Test edin:**
   - https://your-app.vercel.app adresine gidin
   - Register/Login çalışıyor mu?
   - Dashboard yükleniyor mu?

3. **Demo kullanıcılar ile test:**
   - demo@giderse.com / demo123
   - free@giderse.com / free123

---

## 🆘 Sorun Giderme

### "Invalid environment variables" hatası

- Tüm değişkenlerin doğru girildiğinden emin olun
- Özellikle DATABASE_URL ve DIRECT_URL'in sonunda `?sslmode=require` olmalı

### "Database connection failed"

- DATABASE_URL'in pooled version olduğundan emin olun (pooler içeren)
- DIRECT_URL'in direct version olduğundan emin olun (pooler içermeyen)

### "Migration failed"

- DIRECT_URL'in doğru olduğundan emin olun
- Migration'ları local'de çalıştırın: `npx prisma migrate deploy`

### Deployment başarılı ama sayfa yüklenmiyor

- NEXTAUTH_URL'in deployment URL'i ile eşleştiğinden emin olun
- NEXTAUTH_SECRET'in ayarlandığından emin olun
- Vercel logs'u kontrol edin

---

**İyi çalışmalar! 🚀**

Son güncelleme: 2025-10-11
