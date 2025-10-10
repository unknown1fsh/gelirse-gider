# 🗄️ VERİTABANI TABLOLARI VE İLİŞKİLER

## ✅ MEVCUT TABLOLAR

### 1. E-Cüzdan Tablosu (`e_wallet`)

```sql
CREATE TABLE e_wallet (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,                    -- Kullanıcı ID
    name VARCHAR(100) NOT NULL,                  -- "PayPal Hesabım", "Papara"
    provider VARCHAR(50) NOT NULL,               -- "PayPal", "Papara", "Ininal"
    account_email VARCHAR(255),                  -- E-posta
    account_phone VARCHAR(20),                   -- Telefon
    balance DECIMAL(15,2) DEFAULT 0,             -- Bakiye
    currency_id INTEGER NOT NULL,                -- Para birimi
    active BOOLEAN DEFAULT true,                 -- Aktif/Pasif
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (currency_id) REFERENCES ref_currency(id)
);
```

### 2. Alıcı/Kişi Tablosu (`beneficiary`)

```sql
CREATE TABLE beneficiary (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,                    -- Kullanıcı ID
    name VARCHAR(100) NOT NULL,                  -- "Ahmet Yılmaz", "ABC A.Ş."
    iban VARCHAR(34),                            -- IBAN numarası
    account_no VARCHAR(50),                      -- Hesap numarası
    bank_id INTEGER,                             -- Banka ID (opsiyonel)
    phone_number VARCHAR(20),                    -- Telefon
    email VARCHAR(255),                          -- E-posta
    description TEXT,                            -- Açıklama/Not
    active BOOLEAN DEFAULT true,                 -- Aktif/Pasif
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (bank_id) REFERENCES ref_bank(id)
);
```

### 3. Transaction Tablosu (Güncellenmiş)

```sql
CREATE TABLE transaction (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tx_type_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    payment_method_id INTEGER NOT NULL,
    account_id INTEGER,                          -- Banka hesabı (opsiyonel)
    credit_card_id INTEGER,                      -- Kredi kartı (opsiyonel)
    e_wallet_id INTEGER,                         -- E-cüzdan (opsiyonel) ✨ YENİ
    beneficiary_id INTEGER,                      -- Alıcı/Kişi (opsiyonel) ✨ YENİ
    amount DECIMAL(15,2) NOT NULL,
    currency_id INTEGER NOT NULL,
    transaction_date DATE NOT NULL,
    description TEXT,
    notes TEXT,
    tags TEXT[],
    is_recurring BOOLEAN DEFAULT false,
    recurring_type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE,
    FOREIGN KEY (credit_card_id) REFERENCES credit_card(id) ON DELETE CASCADE,
    FOREIGN KEY (e_wallet_id) REFERENCES e_wallet(id) ON DELETE CASCADE,     ✨ YENİ
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(id) ON DELETE CASCADE ✨ YENİ
);
```

## 🔗 İLİŞKİ ŞEMASI

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Kullanıcı)                        │
│  id, email, name, plan (free/premium/enterprise)                │
└─────────────────────────────────────────────────────────────────┘
         │
         │ ON DELETE CASCADE
         │
    ┌────┴─────┬─────────┬──────────┬─────────────┬─────────┐
    │          │         │          │             │         │
    ▼          ▼         ▼          ▼             ▼         ▼
┌────────┐ ┌────────┐ ┌─────────┐ ┌────────────┐ ┌──────┐ ┌──────┐
│Account │ │ Credit │ │ EWallet │ │Beneficiary │ │ Gold │ │ Auto │
│        │ │  Card  │ │         │ │            │ │ Item │ │Payment│
└────────┘ └────────┘ └─────────┘ └────────────┘ └──────┘ └──────┘
    │          │           │            │                      │
    │          │           │            │                      │
    └──────────┴───────────┴────────────┴──────────────────────┘
                           │
                           │ ON DELETE CASCADE
                           ▼
                    ┌─────────────┐
                    │ Transaction │
                    │             │
                    │ accountId   │────────┐
                    │ creditCardId│        │ 4 opsiyonel alan
                    │ eWalletId   │        │ (birini seç)
                    │ beneficiaryId│───────┘
                    └─────────────┘
```

## 📊 DETAYLI İLİŞKİLER

### EWallet (E-Cüzdan)

**İlişkiler:**
- `userId` → **User** (ON DELETE CASCADE)
  - Kullanıcı silinirse → E-cüzdanlar da silinir
  
- `currencyId` → **RefCurrency**
  - Para birimi referansı
  
- `transactions` → **Transaction[]** (CASCADE)
  - E-cüzdan silinirse → İşlemler de silinir ✅
  
- `autoPayments` → **AutoPayment[]** (CASCADE)
  - E-cüzdan silinirse → Otomatik ödemeler de silinir ✅

**PostgreSQL Tablosu:** `e_wallet` ✅

### Beneficiary (Alıcı/Kişi)

**İlişkiler:**
- `userId` → **User** (ON DELETE CASCADE)
  - Kullanıcı silinirse → Alıcılar da silinir
  
- `bankId` → **RefBank** (opsiyonel)
  - Alıcının bankası
  
- `transactions` → **Transaction[]** (CASCADE)
  - Alıcı silinirse → İşlemler de silinir ✅
  
- `autoPayments` → **AutoPayment[]** (CASCADE)
  - Alıcı silinirse → Otomatik ödemeler de silinir ✅

**PostgreSQL Tablosu:** `beneficiary` ✅

### Transaction (İşlem)

**Opsiyonel İlişkiler (Birini seç):**
- `accountId` → Account (Banka hesabı)
- `creditCardId` → CreditCard (Kredi kartı)
- `eWalletId` → **EWallet** ✨
- `beneficiaryId` → **Beneficiary** ✨

**Cascade Davranış:**
- Hesap silinirse → O hesaptaki transaction'lar silinir
- Kart silinirse → O karttaki transaction'lar silinir
- **E-cüzdan silinirse** → O e-cüzdandaki transaction'lar silinir ✅
- **Alıcı silinirse** → O alıcıyla yapılan transaction'lar silinir ✅

## 🎯 KULLANIM ÖRNEKLERİ

### E-Cüzdan İşlemi

```typescript
// Gider ekleme - Papara ile
{
  txTypeId: 45,          // GIDER
  categoryId: 57,        // Market
  paymentMethodId: 66,   // E_CUZDAN
  eWalletId: 5,          // "Papara Hesabım" ✅
  amount: 150,
  currencyId: 68         // TRY
}

// Sonuç:
// - Transaction kaydı oluşturulur
// - Papara bakiyesinden 150 TL düşer
// - eWalletId = 5 ilişkisi kaydedilir
```

### Havale/EFT İşlemi

```typescript
// Gider ekleme - Havale/EFT
{
  txTypeId: 45,          // GIDER
  categoryId: 56,        // Kira
  paymentMethodId: 64,   // HAVALE_EFT
  accountId: 2,          // "Ziraat Bankası Ana Hesap" ✅
  beneficiaryId: 3,      // "Ev Sahibi Ahmet Bey" ✅
  amount: 10000,
  currencyId: 68         // TRY
}

// Sonuç:
// - Transaction kaydı oluşturulur
// - Ziraat hesabından 10.000 TL düşer
// - accountId = 2 ve beneficiaryId = 3 ilişkileri kaydedilir
```

## 🗃️ VERİTABANI DURUMU

```bash
# Tablolar kontrol
psql gelirse_gider

\dt
                List of tables
 Schema |       Name        | Type  |  Owner
--------+-------------------+-------+---------
 public | e_wallet          | table | postgres  ✅
 public | beneficiary       | table | postgres  ✅
 public | transaction       | table | postgres  ✅
 public | account           | table | postgres  ✅
 public | credit_card       | table | postgres  ✅
 ...
```

## ✅ TÜM İLİŞKİLER AKTİF

1. ✅ E-Cüzdan tablosu oluşturuldu (`e_wallet`)
2. ✅ Alıcı tablosu oluşturuldu (`beneficiary`)
3. ✅ Transaction'a `e_wallet_id` kolonu eklendi
4. ✅ Transaction'a `beneficiary_id` kolonu eklendi
5. ✅ Cascade delete ilişkileri kuruldu
6. ✅ Foreign key'ler aktif
7. ✅ `npx prisma db push` ile veritabanı güncellendi

---

**Özet:** Tüm tablolar, kolonlar ve ilişkiler PostgreSQL veritabanında **tam çalışır durumda!** 🎉

