# Postman Collection - GelirseGider API

Bu klasör GelirseGider API'si için Postman koleksiyonunu içerir.

## 📦 İçerik

- **collection.json** - Tüm API endpoint'lerini içeren ana koleksiyon
- **environment.json** - Local geliştirme ortamı değişkenleri

## 🚀 Kullanım

### 1. Postman'e Import Etme

1. Postman uygulamasını açın
2. File → Import menüsüne tıklayın
3. `collection.json` dosyasını seçin
4. `environment.json` dosyasını da import edin

### 2. Environment Ayarlama

1. Postman'de sağ üst köşedeki environment dropdown'dan "GelirseGider - Local" seçin
2. `baseUrl` varsayılan olarak `http://localhost:3000/api` ayarlıdır
3. `authToken` otomatik olarak login sonrası set edilir

### 3. Authentication

1. **Register** request'i ile yeni kullanıcı oluşturun
2. **Login** request'i ile giriş yapın
   - Login başarılı olursa `authToken` otomatik olarak environment'a kaydedilir
3. Diğer endpoint'ler bu token'ı otomatik olarak kullanır

## 📋 Endpoint Kategorileri

### Auth

- **POST** `/auth/register` - Yeni kullanıcı kaydı
- **POST** `/auth/login` - Kullanıcı girişi
- **GET** `/auth/me` - Mevcut kullanıcı bilgisi
- **POST** `/auth/logout` - Çıkış

### Transactions

- **GET** `/transactions` - Tüm işlemleri getir
- **POST** `/transactions` - Yeni işlem oluştur

### Accounts

- **GET** `/accounts` - Tüm hesapları getir
- **POST** `/accounts` - Yeni hesap oluştur
- **GET** `/accounts/bank` - Banka hesaplarını getir

### Credit Cards

- **GET** `/cards` - Tüm kartları getir
- **POST** `/cards` - Yeni kart oluştur

### Analysis

- **GET** `/analysis` - Dashboard istatistikleri
- **GET** `/analysis/cashflow` - Nakit akışı analizi
- **GET** `/analysis/categories` - Kategori analizi
- **GET** `/analysis/trends` - Trend analizi
- **GET** `/analysis/export` - Veri export

### Reference Data

- **GET** `/reference-data` - Tüm referans verileri

### Subscription

- **GET** `/subscription/plans` - Mevcut planlar
- **GET** `/subscription/status` - Abonelik durumu
- **POST** `/subscription/upgrade` - Plan yükselt
- **POST** `/subscription/cancel` - Aboneliği iptal et

### User

- **PUT** `/user/update` - Profil güncelle
- **POST** `/user/change-password` - Şifre değiştir

## 🔐 Authentication Flow

1. Register veya Login ile token alın
2. Token otomatik olarak environment variable'a kaydedilir
3. Koleksiyon auth type olarak Bearer Token kullanır
4. Her request otomatik olarak token'ı header'a ekler

## 🧪 Test Senaryosu

### Tam Test Akışı

1. **Register** - Yeni kullanıcı oluştur
2. **Login** - Token al
3. **Create Account** - Banka hesabı oluştur
4. **Create Credit Card** - Kredi kartı ekle
5. **Create Transaction** - İşlem ekle
6. **Get All Transactions** - İşlemleri listele
7. **Get Dashboard Stats** - Dashboard verilerini getir
8. **Logout** - Çıkış yap

## 📝 Notlar

- Tüm tarih alanları `YYYY-MM-DD` formatında olmalıdır
- Tutar alanları decimal tipindedir (örn: 100.50)
- Free plan kullanıcıları aylık 50 işlem sınırına tabidir
- Premium plan için upgrade endpoint'ini kullanın

## 🔗 Ortamlar

### Local (Default)

```
baseUrl: http://localhost:3000/api
```

### Production (Manuel eklenebilir)

```
baseUrl: https://api.gelirse-gider.com
```

## 🐛 Hata Durumları

API standart hata formatı kullanır:

```json
{
  "error": "Hata mesajı",
  "errorCode": "ERROR_CODE",
  "statusCode": 400
}
```

HTTP Status Kodları:

- **200** - Başarılı
- **201** - Oluşturuldu
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden (Limit aşıldı)
- **404** - Not Found
- **409** - Conflict (Duplicate)
- **422** - Validation Error
- **500** - Internal Server Error
