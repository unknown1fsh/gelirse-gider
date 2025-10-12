# Netlify Environment Variables Kurulum Rehberi

## 1. Netlify Dashboard'a Git
- https://app.netlify.com
- Projenizi seçin
- **Site settings** → **Environment variables** bölümüne gidin

## 2. Aşağıdaki Environment Variables'ı Ekleyin:

### Production Environment Variables:

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_j8gikC0fDGhZ@ep-solitary-scene-ae5rw54m-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require

DIRECT_URL=postgresql://neondb_owner:npg_j8gikC0fDGhZ@ep-solitary-scene-ae5rw54m.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

# NextAuth
NEXTAUTH_URL=https://SIZIN-NETLIFY-URL.netlify.app
NEXTAUTH_SECRET=YOUR_PRODUCTION_SECRET_HERE_GENERATE_NEW_ONE

# JWT Secret
JWT_SECRET=YOUR_JWT_SECRET_HERE_GENERATE_NEW_ONE

# App
NODE_ENV=production
```

## 3. Secret Key'leri Oluştur

Güvenli secret key'ler oluşturmak için terminal'de şu komutları çalıştırın:

```bash
# NEXTAUTH_SECRET için:
openssl rand -base64 32

# JWT_SECRET için:
openssl rand -base64 32
```

Çıkan değerleri Netlify environment variables'a yapıştırın.

## 4. NEXTAUTH_URL Güncelle

Netlify size bir URL verecek (örn: `amazing-site-123456.netlify.app`)
NEXTAUTH_URL'i bununla güncelleyin:
```
NEXTAUTH_URL=https://amazing-site-123456.netlify.app
```

## 5. Deploy Context'leri

Netlify'da her environment variable için deploy context seçebilirsiniz:
- ✅ **Production**: Ana site için
- ✅ **Deploy Previews**: PR preview'ları için
- ✅ **Branch deploys**: Diğer branch'ler için

Hepsini işaretleyin ki tüm deployment'larda çalışsın.

## 6. Değişiklikleri Kaydet

**Save** butonuna tıklayın ve yeni bir deploy tetikleyin.

