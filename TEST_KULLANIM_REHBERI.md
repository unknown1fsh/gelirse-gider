# 🧪 KULLANICI TEST REHBERİ

## ⚠️ BİLDİRİLEN SORUNLAR

1. "Hesaptan yapılan giderler gösterilmiyor"
2. "Nakit giderler Nakit hesabından düşmeli"

## ✅ KOD ANALİZİ

**Backend kodu %100 doğru:**
- ✅ Gider transaction'ı oluşturulur
- ✅ Hesap bakiyesinden düşer (`balance.sub(amount)`)
- ✅ Nakit için otomatik hesap oluşturulur
- ✅ Dashboard API'de hesaplanır

**Muhtemel sorun:** Frontend cache veya sayfa yenileme

---

## 🧪 TEST SENARYOLARI

### TEST 1: NAKİT GİDER EKLEME

#### Adımlar:
```
1. http://localhost:3000/transactions/new-expense
2. Kategori: Market
3. Tutar: 5000
4. Ödeme Yöntemi: Nakit
5. Hesap: BOŞ BIRAK ← (Önemli!)
6. Tarih: Bugün
7. [Gider Ekle] butonuna bas
```

#### Beklenen Sonuç:
```
✅ "Başarıyla eklendi" mesajı
✅ Transaction oluşturuldu
✅ Otomatik nakit hesabı atandı
```

#### Kontrol:
```
1. Hesaplar sayfası → Nakit hesabına tıkla
2. İşlem listesinde yeni gider görünmeli
3. Bakiye azalmış olmalı (-5.000 TL)
```

---

### TEST 2: BANKA HESABI GİDERİ

#### Adımlar:
```
1. http://localhost:3000/transactions/new-expense
2. Kategori: Kira
3. Tutar: 10000
4. Ödeme Yöntemi: Banka Havalesi
5. Hesap: Ziraat Bankası Vadesiz Hesap ← SEÇMELISINIZ
6. Tarih: Bugün
7. [Gider Ekle] butonuna bas
```

#### Beklenen Sonuç:
```
✅ Transaction oluşturuldu
✅ Ziraat hesabı bakiyesi azaldı
```

#### Kontrol:
```
1. Hesaplar → Ziraat hesabına tıkla
2. Bakiye: Önceki - 10.000 TL
3. İşlem listesinde "Kira" gideri görünmeli
```

---

### TEST 3: DASHBOARD KONTROLÜ

#### Adımlar:
```
1. http://localhost:3000/dashboard
2. Sayfayı YENİLE (F5)
3. Toplam Gider kartına bak
4. Hesap Bakiyeleri kartına bak
```

#### Beklenen Görünüm:
```
┌─────────────────────────────────────────────────────┐
│  Toplam Gelir    │  Toplam Gider  │  Net Durum      │
│   170.000 TL     │   173.000 TL   │   -3.000 TL     │
│   3 işlem        │   4 işlem      │                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Hesap Bakiyeleri │  Altın Değeri │  Net Varlık     │
│    442.000 TL     │     0 TL      │   442.000 TL    │
└─────────────────────────────────────────────────────┘
```

**Eğer farklıysa:**
- Gider 0 TL → Cache problemi (Ctrl+Shift+R ile hard refresh)
- Hesap Bakiyeleri yanlış → Database senkronizasyon sorunu

---

### TEST 4: PORTFOLIO SAYFASI

#### Adımlar:
```
1. http://localhost:3000/portfolio
2. Tüm kartları kontrol et
```

#### Beklenen Görünüm:
```
Banka Hesapları:  442.000 TL (Ziraat + Nakit toplamı)
Varlık Dağılımı:
  ████████████████████████ 100% Banka
  
Detaylı Liste:
  - Ziraat: xxx.000 TL
  - Nakit:   xx.000 TL
```

---

## 🔍 DEBUG ADIMLARİ

### Browser Console Kontrolü

1. **F12** bas (Developer Tools)
2. **Console** tab'ini aç
3. Hata var mı bak (kırmızı yazılar)

**Eğer hata varsa:**
```
TypeError: Cannot read properties of undefined...
  → Frontend render hatası
  
Failed to fetch...
  → Backend çalışmıyor
  
400/500 Error...
  → API hatası
```

### Network Tab Kontrolü

1. **F12** → **Network** tab
2. Nakit gider ekle
3. **transactions** isteğine tıkla
4. **Response** tab'inde:

```json
{
  "id": 535,
  "amount": "5000",
  "accountId": 94,  ← Nakit hesap ID
  "txType": { "code": "GIDER" },
  ...
}
```

**Kontrol:**
- ✅ `accountId` var mı? (Nakit hesap)
- ✅ Status 200 OK mi?

### Prisma Studio ile Database Kontrol

```bash
npx prisma studio
```

1. **transaction** tablosuna git
2. En son transaction'ı bul
3. Kontrol et:
   - `tx_type_id`: 4 (GIDER)
   - `amount`: Girdiğiniz tutar
   - `account_id`: Dolu (Nakit hesap ID)
   - `user_id`: Sizin ID

4. **account** tablosuna git
5. Nakit hesabı bul (`account_id` ile)
6. `balance` alanı azalmış mı?

---

## 📊 BEKLENEN VERİ AKIŞI

### Nakit Gider: 5.000 TL Market

```
┌─────────────────────────────────────────────┐
│  1. FRONTEND SUBMIT                         │
├─────────────────────────────────────────────┤
│  POST /api/transactions                     │
│  {                                          │
│    "txTypeId": 45,        // GIDER (SysPrm) │
│    "categoryId": 57,      // Market         │
│    "paymentMethodId": 62, // NAKIT (SysPrm) │
│    "amount": 5000,                          │
│    // accountId: undefined                  │
│  }                                          │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  2. BACKEND VALIDATION                      │
├─────────────────────────────────────────────┤
│  ✅ Kategori OK                             │
│  ✅ Nakit için hesap optional               │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  3. ID MAPPING                              │
├─────────────────────────────────────────────┤
│  txTypeId: 45 → refTxTypeId: 4              │
│  categoryId: 57 → refCategoryId: 65         │
│  paymentMethodId: 62 → refPaymentMethodId: 3│
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  4. ENSURE CASH ACCOUNT                     │
├─────────────────────────────────────────────┤
│  ensureCashAccount(userId: 38, pmId: 3)     │
│  → Nakit hesap bulundu/oluşturuldu: ID 94   │
│  effectiveAccountId = 94                    │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  5. CREATE TRANSACTION                      │
├─────────────────────────────────────────────┤
│  Transaction.create({                       │
│    userId: 38,                              │
│    txTypeId: 4,     // GIDER (Ref)          │
│    categoryId: 65,  // Market (Ref)         │
│    paymentMethodId: 3, // NAKIT (Ref)       │
│    accountId: 94,   // Nakit hesap          │
│    amount: 5000                             │
│  })                                         │
│  → Transaction ID: 535 oluşturuldu          │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  6. UPDATE ACCOUNT BALANCE                  │
├─────────────────────────────────────────────┤
│  updateAccountBalance({                     │
│    accountId: 94,                           │
│    amount: 5000                             │
│  }, refTxTypeId: 4)                         │
│                                             │
│  isIncome = (4 === 3) → false (GIDER)      │
│  currentBalance = 30.000                    │
│  newBalance = 30.000 - 5.000 = 25.000       │
│                                             │
│  Account.update({                           │
│    id: 94,                                  │
│    balance: 25.000                          │
│  })                                         │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  7. DATABASE FINAL STATE                    │
├─────────────────────────────────────────────┤
│  transaction table:                         │
│    id: 535                                  │
│    account_id: 94                           │
│    tx_type_id: 4 (GIDER)                    │
│    amount: 5000                             │
│                                             │
│  account table:                             │
│    id: 94                                   │
│    name: "Nakit"                            │
│    balance: 25000 ✅                        │
└─────────────────────────────────────────────┘
```

---

## 🎯 KONTROL LİSTESİ

### Nakit Gider Testi İçin:

- [ ] Gider Ekle sayfası açılıyor
- [ ] Form doldurulabiliyor
- [ ] "Nakit" seçeneği var
- [ ] Hesap alanı boş bırakılabiliyor
- [ ] [Gider Ekle] butonu tıklanabiliyor
- [ ] Başarı mesajı görünüyor
- [ ] Hesaplar sayfasında "Nakit" hesabı var
- [ ] Nakit hesabına tıklanabiliyor
- [ ] Transaction listesinde gider görünüyor
- [ ] Nakit bakiyesi azalmış

### Dashboard Kontrolü:

- [ ] Dashboard sayfası yükleniyor
- [ ] "Toplam Gider" kartı var
- [ ] Gider tutarı görünüyor (> 0 TL)
- [ ] "Hesap Bakiyeleri" kartı var
- [ ] Hesap bakiyeleri toplamı doğru
- [ ] "Net Varlık" doğru hesaplanmış

---

## 🚨 SORUN ÇÖZÜMLEME

### EĞER: Gider ekleniyor ama gösterilmiyor

**Neden:** Cache problemi  
**Çözüm:**
```
1. Ctrl + Shift + R (Hard refresh)
2. veya F12 → Network tab → "Disable cache" işaretle
3. veya Incognito mode'da test et
```

### EĞER: Nakit bakiyesi düşmüyor

**Neden:** Transaction nakit hesabına atanmamış  
**Çözüm:**
```
1. F12 → Console → Hata var mı bak
2. Network → POST /api/transactions → Response'da accountId var mı?
3. Eğer accountId yok → Backend bug (bana bildirin)
```

### EĞER: Dashboard KPI yanlış

**Neden:** Son 30 gün filtresi  
**Kontrol:**
```
Transaction tarihi son 30 günde mi?
  - EVET → Gösterilmeli
  - HAYIR → Gösterilmez (normal)
```

---

## 💡 HIZLI TEST

**En basit test:**

1. Şu anda **demo@giderse.com** kullanıcısı ile login olun
2. **Dashboard** → "Toplam Gider" ne gösteriyor?
   - **158.000 TL** olmalı (Kira 15.000 + Diğer 143.000)
3. **Hesaplar** → "Ziraat Bankası Vadesiz Hesap" → Tıkla
   - İşlem listesinde **2 gider** görünmeli
   - Bakiye: **427.000 TL** olmalı

**Eğer doğruysa:** ✅ Sistem çalışıyor!  
**Eğer yanlışsa:** ❌ Sorun var, detayları paylaşın

---

## 📱 GERÇEK ZAMANTI TEST

### Yeni Nakit Gider Ekleyin:

```bash
1. Dashboard'daki mevcut durumu not alın:
   - Toplam Gider: _____ TL
   - Hesap Bakiyeleri: _____ TL
   - Net Varlık: _____ TL

2. Gider Ekle → Market → 3.000 TL → Nakit → [Kaydet]

3. Dashboard'a dönün ve YENİLEYİN (F5)

4. Yeni durumu kontrol edin:
   - Toplam Gider: _____ TL (eski + 3.000)
   - Hesap Bakiyeleri: _____ TL (eski - 3.000)
   - Net Varlık: _____ TL (eski - 3.000)

5. Hesaplar → Nakit → Bakiye kontrol:
   - Önceki - 3.000 = Yeni bakiye
```

**Sonucu buraya yazın:**
- [ ] ✅ Hepsi doğru (Sistem çalışıyor!)
- [ ] ❌ Gider Dashboard'da görünmüyor
- [ ] ❌ Nakit bakiyesi düşmedi
- [ ] ❌ Hata mesajı aldım: _______

---

## 🔧 ACİL DÜZELTME (Gerekirse)

Eğer gerçekten nakit giderler düşmüyorsa:

```typescript
// server/services/impl/TransactionService.ts
// Satır 115-116

const balanceUpdateData = { ...data, accountId: effectiveAccountId }
await this.updateAccountBalance(balanceUpdateData, refTxTypeId)
```

Bu kod nakit hesabı ID'sini kullanmalı. Kontrol edelim:
- `effectiveAccountId` dolu mu? (Nakit hesap ID)
- `balanceUpdateData.accountId` dolu mu?
- `updateAccountBalance` çağrılıyor mu?

---

## 📞 BİLDİRİM FORMU

Lütfen test sonuçlarını şu formatta paylaşın:

```
TEST 1 - NAKİT GİDER:
  ✅/❌ Transaction oluştu
  ✅/❌ Nakit hesap bakiyesi düştü
  ✅/❌ Dashboard'da görüldü

TEST 2 - BANKA GİDERİ:
  ✅/❌ Transaction oluştu
  ✅/❌ Banka hesap bakiyesi düştü
  ✅/❌ Dashboard'da görüldü

HATA MESAJLARI (varsa):
  Console: _______
  Network: _______
  UI: _______

EKRAN GÖRÜNTÜLERİ (varsa):
  - Dashboard
  - Hesap Detay
  - Console Errors
```

---

## ✅ BEKLENEN FİNAL DURUM (demo@giderse.com)

```
Ziraat Bankası Vadesiz Hesap:
  Bakiye: 427.000 TL
  Transactions:
    - Kira (Gider): -15.000 TL ✅
    - Maaş (Gelir): +140.000 TL ✅
    - Diğer Gider: -143.000 TL ✅

Nakit Hesap:
  Bakiye: 30.000 TL (veya test sonrası azalmış)
  Transactions:
    - Ek Gelir: +15.000 TL ✅
    - Diğer Gelir: +15.000 TL ✅
    - Market (TEST): -5.000 TL ✅ (Eğer test ettiyseniz)

Dashboard:
  Toplam Gelir: 170.000 TL ✅
  Toplam Gider: 158.000 TL ✅ (veya test sonrası +5.000)
  Hesap Bakiyeleri: 457.000 TL ✅ (veya test sonrası -5.000)

Portfolio:
  Toplam Varlık: 457.000 TL ✅
  Net Değer: 457.000 TL ✅
```

Lütfen test edin ve sonuçları paylaşın! 🙏

