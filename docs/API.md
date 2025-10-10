# 📡 GelirseGider - API Dokümantasyonu

## Base URL

```
http://localhost:3000/api
```

---

## 🔐 Authentication

Tüm korumalı endpoint'ler için JWT token gereklidir. Token, login sonrası cookie'de saklanır.

### Headers

```http
Cookie: auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 Endpoints

### Auth

#### POST /auth/register

Yeni kullanıcı kaydı oluşturur.

**Request Body:**

```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "Sifre123",
  "phone": "+905551234567",
  "plan": "free"
}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "email": "ahmet@example.com",
  "name": "Ahmet Yılmaz",
  "plan": "free",
  "isActive": true,
  "createdAt": "2025-10-10T10:00:00.000Z"
}
```

---

#### POST /auth/login

Kullanıcı girişi yapar ve session oluşturur.

**Request Body:**

```json
{
  "email": "ahmet@example.com",
  "password": "Sifre123"
}
```

**Response:** `200 OK`

```json
{
  "user": {
    "id": 1,
    "email": "ahmet@example.com",
    "name": "Ahmet Yılmaz",
    "plan": "free",
    "isActive": true
  },
  "session": {
    "id": "clxxx...",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-11-10T10:00:00.000Z"
  }
}
```

---

#### GET /auth/me

Mevcut kullanıcı bilgilerini getirir.

**Response:** `200 OK`

```json
{
  "id": 1,
  "email": "ahmet@example.com",
  "name": "Ahmet Yılmaz",
  "phone": "+905551234567",
  "plan": "free",
  "isActive": true,
  "createdAt": "2025-10-10T10:00:00.000Z"
}
```

---

#### POST /auth/logout

Kullanıcı oturumunu sonlandırır.

**Response:** `200 OK`

```json
{
  "success": true
}
```

---

### Transactions

#### GET /api/transactions

Kullanıcının tüm işlemlerini getirir.

**Query Parameters:**

- `limit` (optional) - Sayfa başına kayıt sayısı
- `page` (optional) - Sayfa numarası

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "userId": 1,
    "txTypeId": 1,
    "categoryId": 1,
    "amount": 1500.0,
    "currencyId": 1,
    "transactionDate": "2025-10-10",
    "description": "Maaş",
    "tags": ["gelir", "maaş"],
    "txType": { "name": "Gelir" },
    "category": { "name": "Maaş" },
    "currency": { "code": "TRY" }
  }
]
```

---

#### POST /api/transactions

Yeni işlem oluşturur.

**Request Body:**

```json
{
  "txTypeId": 1,
  "categoryId": 1,
  "paymentMethodId": 1,
  "accountId": 1,
  "amount": 1500.0,
  "currencyId": 1,
  "transactionDate": "2025-10-10",
  "description": "Maaş ödemesi",
  "tags": ["gelir", "maaş"]
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "userId": 1,
  "txTypeId": 1,
  "categoryId": 1,
  "amount": 1500.0,
  "transactionDate": "2025-10-10",
  "createdAt": "2025-10-10T10:00:00.000Z"
}
```

**Free Plan Limit Error:** `403 Forbidden`

```json
{
  "error": "Aylık işlem limitinize ulaştınız (50 işlem)",
  "errorCode": "LIMIT_EXCEEDED",
  "statusCode": 403,
  "current": 50,
  "limit": 50,
  "limitType": "transactions"
}
```

---

### Accounts

#### GET /api/accounts

Kullanıcının tüm hesaplarını getirir.

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Ziraat Bankası Vadesiz",
    "balance": 5000.0,
    "accountType": { "name": "Vadesiz" },
    "bank": { "name": "Ziraat Bankası" },
    "currency": { "code": "TRY", "symbol": "₺" }
  }
]
```

---

#### POST /api/accounts

Yeni hesap oluşturur.

**Request Body:**

```json
{
  "name": "İş Bankası Vadeli",
  "accountTypeId": 2,
  "bankId": 1,
  "currencyId": 1,
  "balance": 10000.0,
  "accountNumber": "1234567890",
  "iban": "TR330006100519786457841326"
}
```

**Response:** `201 Created`

---

### Credit Cards

#### GET /api/cards

Kullanıcının kredi kartlarını getirir.

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Bonus Kart",
    "limitAmount": 10000.0,
    "availableLimit": 7500.0,
    "statementDay": 15,
    "dueDay": 5,
    "bank": { "name": "Garanti BBVA" },
    "currency": { "code": "TRY" }
  }
]
```

---

#### POST /api/cards

Yeni kredi kartı ekler.

**Request Body:**

```json
{
  "name": "Maximum Kart",
  "bankId": 1,
  "currencyId": 1,
  "limitAmount": 15000.0,
  "availableLimit": 15000.0,
  "statementDay": 20,
  "dueDay": 10,
  "minPaymentPercent": 3.0
}
```

**Response:** `201 Created`

---

### Analysis

#### GET /api/analysis

Dashboard istatistiklerini getirir.

**Response:** `200 OK`

```json
{
  "totalIncome": 15000.0,
  "totalExpense": 8500.0,
  "balance": 6500.0,
  "accountsCount": 3,
  "cardsCount": 2,
  "transactionsCount": 45
}
```

---

#### GET /api/analysis/cashflow

Nakit akışı analizini getirir.

**Query Parameters:**

- `startDate` - Başlangıç tarihi (YYYY-MM-DD)
- `endDate` - Bitiş tarihi (YYYY-MM-DD)

**Response:** `200 OK`

```json
{
  "data": [
    {
      "date": "2025-10-01",
      "income": 5000.0,
      "expense": 2500.0,
      "balance": 2500.0
    }
  ]
}
```

---

#### GET /api/analysis/categories

Kategori bazlı analiz.

**Response:** `200 OK`

```json
{
  "income": [
    { "category": "Maaş", "amount": 15000.0, "percentage": 75 },
    { "category": "Freelance", "amount": 5000.0, "percentage": 25 }
  ],
  "expense": [
    { "category": "Market", "amount": 3000.0, "percentage": 35 },
    { "category": "Fatura", "amount": 2000.0, "percentage": 24 }
  ]
}
```

---

#### GET /api/analysis/export

Verileri export eder.

**Query Parameters:**

- `format` - excel | pdf | csv

**Response:** `200 OK` (File download)

---

### Subscription

#### GET /api/subscription/status

Mevcut abonelik durumu.

**Response:** `200 OK`

```json
{
  "planId": "free",
  "status": "active",
  "startDate": "2025-10-10",
  "endDate": "2026-10-10",
  "limits": {
    "transactions": 50,
    "accounts": 3,
    "creditCards": 2
  }
}
```

---

#### POST /api/subscription/upgrade

Plan yükseltme.

**Request Body:**

```json
{
  "planId": "premium",
  "paymentMethod": "credit_card"
}
```

**Response:** `200 OK`

```json
{
  "planId": "premium",
  "status": "active",
  "amount": 99.0,
  "currency": "TRY"
}
```

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "error": "Geçersiz istek",
  "errorCode": "BAD_REQUEST",
  "statusCode": 400
}
```

### 401 Unauthorized

```json
{
  "error": "Yetkilendirme başarısız",
  "errorCode": "UNAUTHORIZED",
  "statusCode": 401
}
```

### 403 Forbidden (Limit)

```json
{
  "error": "Limit aşıldı",
  "errorCode": "LIMIT_EXCEEDED",
  "statusCode": 403,
  "current": 50,
  "limit": 50,
  "limitType": "transactions"
}
```

### 404 Not Found

```json
{
  "error": "Kayıt bulunamadı",
  "errorCode": "NOT_FOUND",
  "statusCode": 404
}
```

### 409 Conflict

```json
{
  "error": "Bu e-posta adresi zaten kullanılıyor",
  "errorCode": "CONFLICT",
  "statusCode": 409
}
```

### 422 Validation Error

```json
{
  "error": "Validasyon hatası",
  "errorCode": "VALIDATION_ERROR",
  "statusCode": 422,
  "details": [
    {
      "field": "email",
      "message": "Geçerli bir e-posta adresi giriniz"
    }
  ]
}
```

### 500 Internal Server Error

```json
{
  "error": "Sunucu hatası",
  "errorCode": "INTERNAL_SERVER_ERROR",
  "statusCode": 500
}
```

---

## 📊 Rate Limiting

| Plan       | Limit         | Süre      |
| ---------- | ------------- | --------- |
| Free       | 100 requests  | 15 dakika |
| Premium    | 1000 requests | 15 dakika |
| Enterprise | Unlimited     | -         |

---

## 🔑 Plan Özellikleri

### Free Plan

- ✅ 50 işlem/ay
- ✅ 3 hesap
- ✅ 2 kredi kartı
- ✅ Temel analiz
- ❌ Export

### Premium Plan (₺99/ay)

- ✅ Sınırsız işlem
- ✅ Sınırsız hesap
- ✅ Sınırsız kredi kartı
- ✅ Gelişmiş analiz
- ✅ Excel/PDF export
- ✅ Altın takibi

### Enterprise Plan (₺499/ay)

- ✅ Tüm Premium özellikler
- ✅ Çoklu kullanıcı
- ✅ API erişimi
- ✅ Öncelikli destek
- ✅ Özel raporlar

---

**API Versiyon:** v1  
**Son Güncelleme:** 10 Ekim 2025
