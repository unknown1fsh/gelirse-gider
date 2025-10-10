# 🎛️ SİSTEM PARAMETRELERİ DOKÜMANTASYONU

## 📋 GENEL BAKIŞ

Sistem Parametreleri, uygulamada kullanılan tüm referans verilerinin merkezi olarak yönetilmesini sağlar. Bu yaklaşım sayesinde:

- ✅ **Merkezi Yönetim:** Tüm parametreler tek bir tablodan yönetilir
- ✅ **Kolay Güncelleme:** Kod değişikliği yapmadan parametreler güncellenebilir
- ✅ **Performans:** Grup bazlı index'ler sayesinde hızlı sorgulama
- ✅ **Esneklik:** JSON metadata ile ekstra bilgiler saklanabilir
- ✅ **Versiyon Kontrol:** created_at ve updated_at ile değişiklik takibi

---

## 🗂️ PARAMETRE GRUPLARI

### 1. BANK - Bankalar (21 Banka)

Türkiye'de aktif olarak çalışan tüm bankalar:

**Kamu Bankaları:**

- Ziraat Bankası
- Halkbank
- VakıfBank

**Özel Bankalar:**

- Akbank
- Garanti BBVA
- İş Bankası
- Yapı Kredi
- Denizbank
- QNB Finansbank
- TEB
- Şekerbank
- Alternatifbank
- Odeabank

**Yabancı Bankalar:**

- ING Bank
- HSBC
- Citibank

**Katılım Bankaları:**

- Kuveyt Türk
- Albaraka Türk
- Türkiye Finans
- Ziraat Katılım
- Vakıf Katılım

### 2. ACCOUNT_TYPE - Hesap Türleri

- **VADESIZ:** Vadesiz Hesap
- **VADELI:** Vadeli Hesap
- **DOVIZ:** Döviz Hesap
- **ALTIN:** Altın Hesap

### 3. TX_TYPE - İşlem Türleri

- **GELIR:** Gelir (icon: TrendingUp, color: green)
- **GIDER:** Gider (icon: TrendingDown, color: red)

### 4. TX_CATEGORY - İşlem Kategorileri

#### Gelir Kategorileri:

- Maaş
- Freelance Gelir
- Yatırım Geliri
- Bonus/Prim
- Kira Geliri
- Diğer Gelirler

#### Gider Kategorileri:

- Market/Gıda
- Faturalar (Elektrik, Su, Doğalgaz)
- Kira
- Ulaşım
- Eğlence
- Sağlık
- Eğitim
- Giyim
- Teknoloji
- Diğer Giderler

### 5. PAYMENT_METHOD - Ödeme Yöntemleri

- **NAKIT:** Nakit
- **KREDI_KARTI:** Kredi Kartı
- **BANKA_KARTI:** Banka Kartı
- **HAVALE_EFT:** Havale/EFT
- **DIJITAL_CUZDAN:** Dijital Cüzdan (PayPal, Papara, etc.)

### 6. CURRENCY - Para Birimleri

- **TRY:** Türk Lirası (₺)
- **USD:** Amerikan Doları ($)
- **EUR:** Euro (€)
- **GBP:** İngiliz Sterlini (£)

### 7. GOLD_TYPE - Altın Türleri (13 Tür)

#### Takılar:

- **BILEZIK:** Bilezik
- **KOLYE:** Kolye
- **KUPE:** Küpe
- **YUZUK:** Yüzük
- **IMAM_NIKAHLI:** İmam Nikahlı
- **SET_TAKIM:** Set/Takım

#### Altın Paralar:

- **CUMHURIYET_ALTINI:** Cumhuriyet Altını (Tam) - 7.2 gr
- **YARIM_ALTIN:** Yarım Altın - 3.6 gr
- **CEYREK_ALTIN:** Çeyrek Altın - 1.8 gr
- **RESAT_ALTINI:** Reşat Altını
- **HAMIT_ALTINI:** Hamit Altını

#### Külçe:

- **ALTIN_BAR:** Altın Bar/Külçe

#### Diğer:

- **DIGER_ZIYNET:** Diğer Ziynet

### 8. GOLD_PURITY - Altın Ayarları (5 Ayar)

- **24K:** 24 Ayar (Saf Altın)
- **22K:** 22 Ayar (Cumhuriyet Altını)
- **18K:** 18 Ayar (750 milyem)
- **14K:** 14 Ayar (585 milyem)
- **8K:** 8 Ayar (333 milyem)

---

## 🔌 API ENDPOINTS

### 1. Tüm Parametreleri Getir

```http
GET /api/parameters
```

**Query Parameters:**

- `onlyActive` (boolean, default: true) - Sadece aktif parametreleri getir
- `grouped` (boolean, default: false) - Gruplara göre organize et

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "paramGroup": "BANK",
      "paramCode": "ZIRAAT",
      "paramValue": "Ziraat Bankası",
      "displayName": "Ziraat Bankası",
      "description": "T.C. Ziraat Bankası A.Ş.",
      "displayOrder": 1,
      "metadata": {
        "swiftBic": "TCZBTR2A",
        "bankCode": "0010",
        "website": "https://www.ziraatbank.com.tr"
      },
      "isActive": true,
      "createdAt": "2025-10-10T...",
      "updatedAt": "2025-10-10T..."
    }
  ],
  "count": 150
}
```

### 2. Gruplu Parametreleri Getir

```http
GET /api/parameters?grouped=true
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "group": "BANK",
      "groupName": "Bankalar",
      "parameters": [...],
      "count": 21
    },
    {
      "group": "GOLD_TYPE",
      "groupName": "Altın Türleri",
      "parameters": [...],
      "count": 13
    }
  ],
  "count": 8
}
```

### 3. Belirli Bir Grubu Getir

```http
GET /api/parameters/BANK
GET /api/parameters/GOLD_TYPE
GET /api/parameters/ACCOUNT_TYPE
```

**Response:**

```json
{
  "success": true,
  "group": "BANK",
  "data": [...],
  "count": 21
}
```

### 4. Belirli Bir Parametreyi Getir

```http
GET /api/parameters/BANK/ZIRAAT
GET /api/parameters/GOLD_TYPE/CUMHURIYET_ALTINI
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "paramGroup": "BANK",
    "paramCode": "ZIRAAT",
    "paramValue": "Ziraat Bankası",
    "displayName": "Ziraat Bankası",
    "description": "T.C. Ziraat Bankası A.Ş.",
    "displayOrder": 1,
    "metadata": {
      "swiftBic": "TCZBTR2A",
      "bankCode": "0010",
      "website": "https://www.ziraatbank.com.tr"
    },
    "isActive": true
  }
}
```

### 5. Tüm Grupları Listele

```http
OPTIONS /api/parameters
```

**Response:**

```json
{
  "success": true,
  "groups": [
    "BANK",
    "ACCOUNT_TYPE",
    "TX_TYPE",
    "TX_CATEGORY",
    "PAYMENT_METHOD",
    "CURRENCY",
    "GOLD_TYPE",
    "GOLD_PURITY"
  ],
  "count": 8
}
```

---

## 💻 KULLANIM ÖRNEKLERİ

### Frontend'de Kullanım

```typescript
// Tüm bankaları getir
const response = await fetch('/api/parameters/BANK')
const { data: banks } = await response.json()

// Dropdown için
<select>
  {banks.map(bank => (
    <option key={bank.id} value={bank.paramCode}>
      {bank.displayName}
    </option>
  ))}
</select>

// Altın türlerini getir
const goldTypes = await fetch('/api/parameters/GOLD_TYPE')
const { data: types } = await goldTypes.json()

// Metadata bilgisine erişim
const bankMetadata = banks[0].metadata
console.log(bankMetadata.swiftBic) // "TCZBTR2A"
```

### Service Layer'da Kullanım

```typescript
import { SystemParameterService } from '@/server/services/impl/SystemParameterService'
import { prisma } from '@/lib/prisma'

const parameterService = new SystemParameterService(prisma)

// Belirli bir grup
const banks = await parameterService.getByGroup('BANK')

// Belirli bir parametre
const ziraat = await parameterService.getByCode('BANK', 'ZIRAAT')

// Sadece değer
const bankName = await parameterService.getValue('BANK', 'ZIRAAT', 'Bilinmiyor')

// Metadata
const metadata = await parameterService.getMetadata('BANK', 'ZIRAAT')
console.log(metadata?.swiftBic)

// Aktif mi kontrol
const isActive = await parameterService.isActive('BANK', 'ZIRAAT')
```

---

## 🗄️ DATABASE YAPISI

### SystemParameter Tablosu

```sql
CREATE TABLE system_parameter (
  id SERIAL PRIMARY KEY,
  param_group VARCHAR(50) NOT NULL,
  param_code VARCHAR(50) NOT NULL,
  param_value VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_param UNIQUE (param_group, param_code)
);

CREATE INDEX idx_param_group ON system_parameter(param_group, is_active);
```

---

## 🔧 YÖNETİM

### Yeni Parametre Eklemek

```typescript
await prisma.systemParameter.create({
  data: {
    paramGroup: 'BANK',
    paramCode: 'YENI_BANKA',
    paramValue: 'Yeni Banka A.Ş.',
    displayName: 'Yeni Banka',
    description: 'Yeni kurulan banka',
    displayOrder: 22,
    metadata: {
      swiftBic: 'YENITR2A',
      bankCode: '9999',
      website: 'https://www.yenibanka.com.tr',
    },
    isActive: true,
  },
})
```

### Parametre Güncellemek

```typescript
await prisma.systemParameter.update({
  where: {
    paramGroup_paramCode: {
      paramGroup: 'BANK',
      paramCode: 'ZIRAAT',
    },
  },
  data: {
    displayName: 'T.C. Ziraat Bankası',
    metadata: {
      swiftBic: 'TCZBTR2A',
      bankCode: '0010',
      website: 'https://www.ziraatbank.com.tr',
      phoneNumber: '444 0 100',
    },
  },
})
```

### Parametre Deaktive Etmek

```typescript
await prisma.systemParameter.update({
  where: {
    paramGroup_paramCode: {
      paramGroup: 'BANK',
      paramCode: 'ESKI_BANKA',
    },
  },
  data: {
    isActive: false,
  },
})
```

---

## ✅ AVANTAJLAR

### 1. Merkezi Yönetim

- Tüm parametreler tek yerden yönetilir
- Kod değişikliği gerektirmez
- Hızlı güncelleme imkanı

### 2. Performans

- Index'li sorgular
- Grup bazlı erişim
- Cache friendly yapı

### 3. Esneklik

- JSON metadata ile sınırsız ek bilgi
- Gruplandırma desteği
- Sıralama kontrolü

### 4. Versiyon Kontrol

- created_at / updated_at ile tarihçe
- Soft delete (isActive) desteği
- Audit trail imkanı

---

## 📊 İSTATİSTİKLER

| Grup               | Parametre Sayısı |
| ------------------ | ---------------- |
| **BANK**           | 21               |
| **ACCOUNT_TYPE**   | 4                |
| **TX_TYPE**        | 2                |
| **TX_CATEGORY**    | ~15              |
| **PAYMENT_METHOD** | 5                |
| **CURRENCY**       | 4                |
| **GOLD_TYPE**      | 13               |
| **GOLD_PURITY**    | 5                |
| **TOPLAM**         | ~69              |

---

## 🔄 ESKİ YAPIDAN FAR

KI

### Önceki Yapı:

```typescript
// Her tablo ayrı
;(RefBank,
  RefAccountType,
  RefTxType,
  RefTxCategory,
  RefPaymentMethod,
  RefCurrency,
  RefGoldType,
  RefGoldPurity)
```

### Yeni Yapı:

```typescript
// Tek tablo, grup bazlı
SystemParameter (param_group ile ayrım)
```

### Avantajlar:

- ✅ Tek API endpoint ile tüm parametreler
- ✅ Kolay yeni grup ekleme
- ✅ Merkezi sorgulama
- ✅ Daha az kod tekrarı

---

**Not:** Mevcut referans tabloları (`RefBank`, `RefAccountType`, vb.) hala kullanılabilir. `SystemParameter` tablosu ek bir merkezi yönetim katmanı sağlar ve ileride mevcut tabloların yerine geçebilir.
