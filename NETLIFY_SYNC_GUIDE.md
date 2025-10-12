# 🔄 Local Veritabanını Netlify'e Senkronize Etme Rehberi

Bu rehber, local PostgreSQL veritabanınızı Netlify'deki veritabanına tamamen kopyalamanız için adım adım talimatlar içerir.

## ⚠️ ÖNEMLİ UYARILAR

- **Bu işlem Netlify'deki TÜM verileri silecek ve local verilerinizle değiştirecektir**
- **Bu işlem GERİ ALINAMAZ**
- İşlem öncesi Netlify veritabanınızın yedeğini almanız önerilir

## 📋 Ön Gereksinimler

### 1. PostgreSQL Komut Satırı Araçları

Script'in çalışması için `pg_dump` ve `psql` komutları gereklidir.

**Windows:**

- PostgreSQL kuruluysa zaten yüklüdür
- Eğer yoksa: [PostgreSQL indirin](https://www.postgresql.org/download/windows/)
- PATH'e eklediğinizden emin olun

**Test edin:**

```bash
pg_dump --version
psql --version
```

### 2. .env Dosyası Yapılandırması

`.env` dosyanıza Netlify veritabanı connection string'ini ekleyin:

```env
# Local Veritabanı
DATABASE_URL="postgresql://postgres:password@localhost:5432/giderse"

# Netlify Veritabanı (Netlify Dashboard'dan alın)
NETLIFY_DATABASE_URL="postgresql://user:pass@host:5432/database"
```

## 🚀 Netlify PostgreSQL Connection String Nasıl Alınır?

1. **Netlify Dashboard'a gidin:** https://app.netlify.com/
2. Projenizi seçin
3. Sol menüden **"Databases"** sekmesine tıklayın
4. PostgreSQL veritabanınızı seçin
5. **"Connection string"** veya **"External connection"** bölümünü bulun
6. Connection string'i kopyalayın
7. `.env` dosyanıza `NETLIFY_DATABASE_URL` olarak ekleyin

### Connection String Formatı

```
postgresql://username:password@hostname:port/database
```

Örnek:

```
postgresql://neon_user:AbCd1234XyZ@ep-cool-sound-123456.us-east-2.aws.neon.tech:5432/neondb
```

## 📝 Adım Adım Kullanım

### 1. Script'i Derleyin

```bash
npx ts-node scripts/sync-local-to-netlify.ts
```

### 2. Onay Soruları

Script size 2 aşamalı onay soracaktır:

```
Devam etmek istediğinize emin misiniz? (evet/hayır): evet
Netlify veritabanındaki verilerin SİLİNECEĞİNİ anlıyorum (EVET/hayır): EVET
```

⚠️ **Dikkat:** İkinci onayda tam olarak **"EVET"** yazmalısınız (büyük harfle).

### 3. Senkronizasyon Süreci

Script otomatik olarak şu adımları gerçekleştirir:

1. **📦 Local veritabanından dump alır**
   - Tüm tablolar, veriler ve yapı export edilir
   - `backup.sql` dosyası oluşturulur

2. **🗑️ Netlify veritabanını temizler**
   - Tüm tablolar silinir (CASCADE ile)
   - Veritabanı temiz hale gelir

3. **📥 Dump'ı Netlify'e yükler**
   - `backup.sql` dosyası Netlify veritabanına restore edilir
   - Tüm veriler ve yapı kopyalanır

4. **🧹 Temizlik yapar**
   - Geçici `backup.sql` dosyası silinir

### 4. Başarılı Sonuç

İşlem başarılı olursa şu mesajı göreceksiniz:

```
╔═══════════════════════════════════════════════════════════╗
║              SENKRONIZASYON BAŞARILI! 🎉                 ║
╚═══════════════════════════════════════════════════════════╝

✅ Local veritabanınız başarıyla Netlify'e kopyalandı!
```

## 🔍 Doğrulama

Senkronizasyondan sonra verileri doğrulamak için:

### 1. Netlify'de Tablo Sayısını Kontrol Edin

```bash
psql "$NETLIFY_DATABASE_URL" -c "\dt"
```

### 2. Kullanıcı Sayısını Kontrol Edin

```bash
psql "$NETLIFY_DATABASE_URL" -c "SELECT COUNT(*) FROM \"user\";"
```

### 3. Web Uygulamasını Test Edin

- Netlify URL'inizi açın
- Login olun
- Verilerinizin doğru şekilde göründüğünü kontrol edin

## ❌ Sorun Giderme

### Hata: `pg_dump: command not found`

**Çözüm:**

- PostgreSQL'in yüklü olduğundan emin olun
- PostgreSQL bin klasörünü PATH'e ekleyin
- Windows için genellikle: `C:\Program Files\PostgreSQL\15\bin`

### Hata: `connection refused`

**Çözüm:**

- Connection string'in doğru olduğundan emin olun
- Netlify veritabanınızın aktif olduğunu kontrol edin
- IP whitelisting varsa, IP'nizin izin listesinde olduğunu kontrol edin

### Hata: `permission denied`

**Çözüm:**

- Veritabanı kullanıcısının gerekli izinlere sahip olduğundan emin olun
- Connection string'deki kullanıcı adı ve şifrenin doğru olduğunu kontrol edin

### İşlem Yarım Kaldı

**Çözüm:**

1. Script'i tekrar çalıştırın
2. Temizleme adımı otomatik olarak yapılır
3. Restore işlemi baştan başlar

## 🔐 Güvenlik Notları

1. **Connection String'leri Gizli Tutun**
   - `.env` dosyası Git'e commitlenmemelidir
   - Connection string'leri kimseyle paylaşmayın

2. **Production Ortamında Dikkatli Olun**
   - Bu script development/staging için tasarlanmıştır
   - Production'da kullanmadan önce yedek alın

3. **Yedekleme**
   - Netlify'deki önemli verilerinizin yedeğini alın
   - Local veritabanınızın da yedeğini düzenli alın

## 🎯 Alternatif Yöntemler

### Manuel Export/Import

```bash
# 1. Export
pg_dump "$DATABASE_URL" > local_backup.sql

# 2. Import
psql "$NETLIFY_DATABASE_URL" < local_backup.sql
```

### Sadece Belirli Tabloları Kopyala

```bash
# Sadece user tablosunu kopyala
pg_dump "$DATABASE_URL" -t user > users.sql
psql "$NETLIFY_DATABASE_URL" < users.sql
```

## 📞 Yardım

Sorun yaşarsanız:

1. Connection string'lerin doğru olduğunu kontrol edin
2. PostgreSQL araçlarının yüklü olduğunu doğrulayın
3. Netlify veritabanının erişilebilir olduğunu test edin
4. Hata mesajlarını dikkatlice okuyun

## 🔄 Düzenli Senkronizasyon

Bu işlemi düzenli olarak yapmak isterseniz:

1. Script'i bir cron job veya scheduled task ile çalıştırabilirsiniz
2. Veya CI/CD pipeline'ınıza ekleyebilirsiniz
3. Ancak production verilerinin üzerine yazmayacağınızdan emin olun

---

**Son Güncelleme:** 2025-01-12
