# 📅 Dönem Bazlı Finans Yönetim Sistemi - Kullanım Kılavuzu

## 🎯 Genel Bakış

GiderSE-Gelir uygulaması artık **dönem bazlı** finans yönetimi sunar. Bu sistem sayesinde:

- ✅ Farklı zaman dilimlerinde (yıllık, aylık, özel) gelir-gider takibi
- ✅ Her dönem için ayrı hesap ve işlem yönetimi
- ✅ Dönem kapanışları ve bakiye devri
- ✅ Geçmiş dönem verilerine erişim
- ✅ Dönemler arası karşılaştırma ve analiz

## 🚀 Kurulum ve İlk Çalıştırma

### 1. Veritabanı Migration

Schema güncellemelerini uygulamak için:

```bash
# Migration oluştur ve uygula
npx prisma migrate dev --name add_period_system

# Prisma client'ı güncelle
npx prisma generate
```

### 2. Mevcut Verileri Migration Et

Eğer uygulamanızda zaten kullanıcı ve veri varsa, bunları dönem sistemine taşıyın:

```bash
npm run migrate:periods
```

Bu script:

- Her kullanıcı için "Tüm Zamanlar" adında varsayılan dönem oluşturur
- Mevcut tüm hesap, işlem ve varlık kayıtlarını bu döneme atar
- Aktif session'ları günceller

### 3. Uygulamayı Başlat

```bash
npm run dev
```

## 📖 Kullanım

### Yeni Kullanıcılar

İlk giriş yapıldığında otomatik olarak **onboarding modal'ı** açılır:

1. **Otomatik Öneri**: Mevcut yıl için dönem önerilir (örn: "2024 Yılı")
2. **Hızlı Başlangıç**: "Dönem Oluştur ve Başla" butonuyla tek tıkla başlayın
3. **Özelleştirme**: İsterseniz "Özelleştir" ile kendi döneminizi tanımlayın

### Mevcut Kullanıcılar

Mevcut verileriniz otomatik olarak varsayılan bir döneme atanmıştır:

- **Dönem Adı**: "Tüm Zamanlar"
- **Tarih Aralığı**: Kayıt yılınızdan bu yıl sonuna kadar
- **Durum**: Aktif ve açık

## 🎛️ Dönem Yönetimi

### Dönem Oluşturma

**Yöntem 1 - Sidebar'dan:**

1. Sol menüdeki dönem seçiciyi açın
2. "Yeni Dönem Oluştur" tıklayın

**Yöntem 2 - Dönem Yönetimi Sayfası:**

1. `/periods` sayfasına gidin
2. "Yeni Dönem Oluştur" butonuna tıklayın

**Dönem Tipleri:**

| Tip          | Açıklama                          | Örnek                   |
| ------------ | --------------------------------- | ----------------------- |
| **Yıllık**   | Tüm yıl için (1 Ocak - 31 Aralık) | "2024 Yılı"             |
| **Mali Yıl** | Özelleştirilebilir mali yıl       | "2024-2025 Mali Yılı"   |
| **Aylık**    | Tek bir ay                        | "Ocak 2024"             |
| **Özel**     | İstediğiniz tarih aralığı         | "Q1 2024", "Yaz Dönemi" |

### Dönem Değiştirme

**Aktif Dönem Değiştirme:**

1. Sol menüdeki dönem seçiciyi açın
2. Listeden istediğiniz açık dönemi seçin
3. Tüm veriler (hesaplar, işlemler) otomatik olarak seçili döneme göre filtrelenir

**Özellikler:**

- ✅ Sadece açık dönemler aktif yapılabilir
- ✅ Kapalı dönemler görüntüleme modunda açılır
- ✅ Aktif dönem sidebar'da görünür

### Dönem Kapanışı

Bir dönemi kapatmak için:

1. `/periods` sayfasına gidin
2. Kapatmak istediğiniz dönemin "Detaylar" butonuna tıklayın
3. "Dönemi Kapat" butonunu kullanın

**Kapanış Seçenekleri:**

**Bakiye Devri YOK:**

- Dönem sadece kapatılır
- Yeni dönem oluşturulmaz
- Hesaplar bu dönemle birlikte arşivlenir

**Bakiye Devri VAR:**

- Dönem kapatılır
- Otomatik olarak yeni dönem oluşturulur
- Hesaplar yeni döneme açılış bakiyesiyle kopyalanır
- Kredi kartları temiz limitlerle başlar
- Yatırımlar güncel fiyatlarla devredilir

**Kapanış İstatistikleri:**

```
📊 Dönem Kapanış Raporu
- Toplam Varlıklar: XX,XXX TL
- Toplam Yükümlülükler: X,XXX TL
- Net Değer: XX,XXX TL
- Devir Tarihi: GG/AA/YYYY
```

## 🏗️ Mimari ve Teknik Detaylar

### Database Schema

**Yeni Tablolar:**

```sql
-- Dönem bilgileri
period (id, user_id, name, period_type, start_date, end_date, is_closed, is_active, ...)

-- Dönem kapanış bilgileri
period_closing (id, period_id, closed_at, total_assets, total_liabilities, net_worth, ...)

-- Dönemler arası transferler
period_transfer (id, from_period_id, to_period_id, account_id, transfer_amount, ...)
```

**Güncellenen Tablolar:**

Tüm ana tablolara `period_id` foreign key eklendi:

- `account`
- `credit_card`
- `e_wallet`
- `transaction`
- `auto_payment`
- `gold_item`
- `investment`

### API Endpoints

**Period Management:**

```
GET    /api/periods              # Tüm dönemleri listele
POST   /api/periods              # Yeni dönem oluştur
GET    /api/periods/[id]         # Dönem detayı
PUT    /api/periods/[id]         # Dönem güncelle
DELETE /api/periods/[id]         # Dönem sil
POST   /api/periods/[id]/activate # Dönemi aktif yap
POST   /api/periods/[id]/close   # Dönemi kapat
```

**Data APIs (Period-Filtered):**

```
GET /api/transactions    # Aktif dönemin işlemleri
GET /api/accounts        # Aktif dönemin hesapları
GET /api/investments/*   # Aktif dönemin yatırımları
```

### React Context

```typescript
// Period Context kullanımı
import { usePeriod } from '@/lib/period-context'

function MyComponent() {
  const {
    activePeriod, // Aktif dönem bilgisi
    periods, // Tüm dönemler
    loading, // Yüklenme durumu
    changePeriod, // Dönem değiştir
    createPeriod, // Yeni dönem oluştur
    closePeriod, // Dönemi kapat
    refreshPeriods, // Dönemleri yenile
  } = usePeriod()

  // ...
}
```

## 🔧 Helper Functions

```typescript
import {
  formatPeriodName, // Dönem adını formatla
  getPeriodTypeLabel, // Dönem tipi etiketini al
  calculatePeriodDates, // Dönem tarihlerini hesapla
  isPeriodActive, // Dönem aktif mi?
  canClosePeriod, // Dönem kapatılabilir mi?
  validatePeriodOverlap, // Dönem çakışması kontrolü
  getActivePeriod, // Aktif dönemi getir
} from '@/lib/period-helpers'
```

## 📊 Özellikler ve Avantajlar

### ✅ Tamamlanan Özellikler

- [x] Dönem oluşturma, düzenleme, silme
- [x] Dönem tipi seçenekleri (Yıllık, Mali Yıl, Aylık, Özel)
- [x] Aktif dönem yönetimi
- [x] Period selector UI component
- [x] Dönem bazlı veri filtreleme (transactions, accounts)
- [x] Dönem kapanış sistemi
- [x] Bakiye devir sistemi
- [x] Yeni kullanıcı onboarding
- [x] Mevcut veri migration script'i
- [x] Session bazlı aktif dönem takibi

### 🎯 Kullanım Senaryoları

**Senaryo 1: Yıllık Muhasebe**

```
- 2023 Yılı dönemi kapat
- Bakiyeleri devret
- 2024 Yılı dönemine geç
- Önceki yıl raporlarına eriş
```

**Senaryo 2: Proje Bazlı Takip**

```
- "Ev Tadilatı Q1 2024" özel dönemi oluştur
- Proje giderlerini takip et
- Proje bitti, dönemi kapat
- Proje raporunu al
```

**Senaryo 3: Mali Yıl Yönetimi**

```
- "2024-2025 Mali Yılı" oluştur
- Şirket harcamalarını takip et
- Dönem sonu mali raporlar
```

## 🐛 Sorun Giderme

### Dönem Görünmüyor

**Sebep:** Migration yapılmamış olabilir.

**Çözüm:**

```bash
npm run migrate:periods
```

### "Aktif Dönem Bulunamadı" Hatası

**Sebep:** Session'da aktif dönem kaydı yok.

**Çözüm:**

1. Çıkış yapıp tekrar giriş yapın
2. Veya yeni dönem oluşturun

### Mevcut Veriler Gözükmüyor

**Sebep:** Veriler farklı bir döneme ait olabilir.

**Çözüm:**

1. Dönem seçiciyi açın
2. "Tüm Zamanlar" dönemini seçin

### Dönem Silinmiyor

**Sebep:** Dönemde işlem/veri var.

**Çözüm:**

- Sadece boş dönemler silinebilir
- Verileri başka döneme taşıyın veya silin

## 📝 Best Practices

### ✅ Yapılması Gerekenler

- Her dönem için anlamlı isim kullanın
- Dönem sınırlarını dikkatli belirleyin
- Düzenli dönem kapanışları yapın
- Önemli dönemler için notlar ekleyin
- Bakiye devirlerini kontrol edin

### ❌ Yapılmaması Gerekenler

- Çakışan tarih aralıklarıyla dönem oluşturmayın
- İşlem varken dönem silmeye çalışmayın
- Kapalı dönemde işlem yapmaya çalışmayın
- Aktif dönemi silmeyin

## 🔄 Migration Rehberi

### Yeni Sisteme Geçiş

Eğer eski sistemden geliyorsanız:

1. **Yedek Alın:** Veritabanınızı yedekleyin
2. **Migration Çalıştırın:** `npm run migrate:periods`
3. **Kontrol Edin:** Tüm verilerin doğru döneme atandığını kontrol edin
4. **Yeni Dönemler Oluşturun:** İhtiyacınıza göre yeni dönemler ekleyin

## 📞 Destek

Sorularınız için:

- GitHub Issues
- Dokümantasyon
- Development Team

---

**Son Güncelleme:** 11 Ekim 2025  
**Versiyon:** 3.0.0 (Period System)
