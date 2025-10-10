# 🧪 HIZLI TEST REHBERİ

## 🚀 Testleri Çalıştır

### Free User Testi

```bash
npm run test:api:free
```

**Beklenen Sonuç:**

```
✅ Başarılı: 13/17
⚠️ Premium Gerekli: 4/17 (403 Forbidden)
📈 Başarı Oranı: %76.5
```

### Premium User Testi

```bash
npm run test:api:premium
```

**Beklenen Sonuç:**

```
✅ Başarılı: 18/18
❌ Başarısız: 0/18
📈 Başarı Oranı: %100
```

---

## 📊 Test Komutları

| Komut                      | Açıklama             | Kullanıcı Tipi |
| -------------------------- | -------------------- | -------------- |
| `npm run test:api`         | Temel API testi      | FREE           |
| `npm run test:api:free`    | Free user testi      | FREE           |
| `npm run test:api:premium` | Premium user testi   | PREMIUM        |
| `npm run test`             | Vitest unit testleri | -              |
| `npm run test:watch`       | Watch mode           | -              |

---

## ✅ FREE PLAN - ERİŞİLEBİLİR (13)

- ✅ `/auth/register` - Kayıt
- ✅ `/auth/login` - Giriş
- ✅ `/auth/me` - Profil
- ✅ `/reference-data` - Referans veriler
- ✅ `/accounts` - Hesaplar
- ✅ `/accounts/bank` - Banka hesapları
- ✅ `/cards` - Kredi kartları
- ✅ `/transactions` - İşlemler
- ✅ `/dashboard` - Dashboard
- ✅ `/analysis` - Temel analiz
- ✅ `/subscription/status` - Abonelik durumu
- ✅ `/subscription/plans` - Planlar
- ✅ `/gold` - Altın portföyü

## ⚠️ PREMIUM GEREKLİ (4 - 403)

- ⚠️ `/analysis/cashflow` - Gelişmiş nakit akışı
- ⚠️ `/analysis/categories` - Kategori analizi
- ⚠️ `/analysis/trends` - Trend analizi
- ⚠️ `/investments` - Yatırım araçları

## 🌟 PREMIUM PLAN - TÜMÜ ERİŞİLEBİLİR (18)

Free Plan (13) + Aşağıdakiler:

- ⭐ `/analysis/cashflow` - Gelişmiş nakit akışı
- ⭐ `/analysis/categories` - Kategori analizi
- ⭐ `/analysis/trends` - Trend analizi
- ⭐ `/investments` - Yatırım araçları
- ⭐ `/auto-payments` - Otomatik ödemeler

---

## 🎯 SONUÇLAR

```
FREE PLAN:    13/17 (%76.5) ✅
PREMIUM PLAN: 18/18 (%100)  ✅
SİSTEM:       ÇALIŞIYOR    ✅
```
