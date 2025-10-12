# 🚀 Netlify Deployment Rehberi - GiderSE-Gelir

## 📋 Önkoşullar

- ✅ GitHub repository'si hazır
- ✅ Netlify hesabı
- ✅ Neon PostgreSQL database aktif

## 🔧 Adım 1: Netlify Projesi Oluşturma

1. **Netlify Dashboard'a git**: https://app.netlify.com
2. **"Add new site"** → **"Import an existing project"** tıkla
3. **GitHub'ı seç** ve repository'nizi bulun
4. **Configure** butonuna tıklayın

## ⚙️ Adım 2: Build Settings

Netlify otomatik Next.js algılayacak, ama şu ayarları kontrol edin:

```
Build command: npm run build:netlify
Publish directory: .next
```

Veya varsayılan Next.js ayarlarını kullanabilirsiniz.

## 🔐 Adım 3: Environment Variables Ekle

**Site settings** → **Environment variables** bölümünden şu değişkenleri ekleyin:

### 1. DATABASE_URL
```
postgresql://neondb_owner:npg_j8gikC0fDGhZ@ep-solitary-scene-ae5rw54m-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

### 2. DIRECT_URL
```
postgresql://neondb_owner:npg_j8gikC0fDGhZ@ep-solitary-scene-ae5rw54m.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 3. NEXTAUTH_SECRET
Terminal'de oluştur:
```bash
openssl rand -base64 32
```
Çıkan değeri yapıştır.

### 4. JWT_SECRET
Terminal'de oluştur:
```bash
openssl rand -base64 32
```
Çıkan değeri yapıştır.

### 5. NEXTAUTH_URL
Netlify size verdiği URL (örnek):
```
https://your-app-name.netlify.app
```

### 6. NODE_ENV
```
production
```

## 📦 Adım 4: Netlify Plugin Yükle

Netlify dashboard'da:
1. **Plugins** sekmesine git
2. **"Essential Next.js Plugin"** ara ve yükle

Veya `netlify.toml` dosyasında zaten tanımlı (✅ hazır).

## 🗄️ Adım 5: Database Migration

İlk deploy'dan önce veritabanını migrate etmeniz gerekiyor.

**Seçenek 1: Local'den migrate** (Önerilen)
```bash
# .env dosyanızı production database ile güncelleyin
DATABASE_URL="postgresql://neondb_owner:npg_j8gikC0fDGhZ@ep-solitary-scene-ae5rw54m-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

# Migration çalıştır
npx prisma migrate deploy

# (Opsiyonel) Seed data
npx tsx prisma/seed.ts
```

**Seçenek 2: Netlify Deploy Logs'dan**
Build sırasında otomatik migrate edilecek (`netlify.toml`'da tanımlı).

## 🚀 Adım 6: İlk Deploy

1. **"Deploy site"** butonuna tıklayın
2. Build logs'u izleyin (3-5 dakika sürebilir)
3. Deploy tamamlanınca site URL'inizi alın

## ✅ Adım 7: Domain Ayarlama (Opsiyonel)

Kendi domain'inizi bağlamak için:
1. **Domain settings** → **Add custom domain**
2. DNS ayarlarınızı Netlify'ın verdiği değerlerle güncelleyin
3. SSL sertifikası otomatik yüklenecek (Let's Encrypt)

## 🔍 Adım 8: Test Etme

Deploy tamamlandıktan sonra:

1. **Site URL'ini açın** (örn: `https://your-app.netlify.app`)
2. **Landing page** görünmeli
3. **"Giriş Yap"** butonuna tıklayın
4. Yeni kullanıcı oluşturun veya giriş yapın
5. Dashboard'u test edin

## 🐛 Sorun Giderme

### Build Hatası: "Prisma Client not found"
**Çözüm**: `postinstall` script package.json'da olmalı:
```json
"postinstall": "prisma generate"
```

### Database Connection Error
**Çözüm**: 
- DATABASE_URL'in doğru olduğunu kontrol edin
- Neon database'in aktif olduğunu doğrulayın
- `?sslmode=require` parametresinin olduğundan emin olun

### 401 Unauthorized Errors
**Çözüm**:
- NEXTAUTH_URL'in doğru olduğunu kontrol edin
- NEXTAUTH_SECRET ve JWT_SECRET'in ayarlandığından emin olun

### "Module not found" Errors
**Çözüm**:
```bash
# Bağımlılıkları yeniden yükle
npm ci
```

## 🔄 Continuous Deployment

Artık her Git push otomatik deploy tetikleyecek:
- **main/master branch** → Production deploy
- **Pull requests** → Preview deploy
- **Diğer branch'ler** → Branch deploy

## 📊 Monitoring

Netlify dashboard'dan izleyebilirsiniz:
- **Deploy logs**: Build süreçleri
- **Function logs**: API route'lar
- **Analytics**: Trafik ve performans

## 🎉 Tamamlandı!

Projeniz artık Netlify'da canlı! 

**Mobil Test İçin:**
1. Site URL'ini telefona gönderin
2. Hamburger menüyü test edin
3. Tüm sayfaların responsive çalıştığını doğrulayın

## 📚 Ek Kaynaklar

- [Netlify Next.js Docs](https://docs.netlify.com/frameworks/next-js/)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Neon Database](https://neon.tech/docs)

