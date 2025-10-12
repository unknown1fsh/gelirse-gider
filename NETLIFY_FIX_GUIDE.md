# Netlify Sorun Çözüm Rehberi

## Tespit Edilen Sorunlar

### 1. ❌ Kategoriler, Ödeme Yöntemleri ve Para Birimleri Görünmüyor

**Sebep:** `SystemParameter` tablosunda veri yok
**Çözüm:** Aşağıdaki endpoint'i çağırarak veritabanını doldurun

### 2. ❌ Premium Kullanıcı FREE Olarak Görünüyor

**Sebep:** `UserSubscription` tablosunda aktif abonelik yok veya yanlış
**Çözüm:** Kullanıcının aboneliğini kontrol edin ve düzeltin

### 3. ❌ `/api/simple-reference` 404 Hatası

**Sebep:** Bu endpoint Netlify'da yok
**Çözüm:** Git'e push edin ve Netlify'ı yeniden deploy edin

---

## Adım Adım Çözüm

### Adım 1: SystemParameter Tablosunu Doldurun

Netlify üzerinde veya Postman ile:

```bash
POST https://giderse-gelir.netlify.app/api/seed-parameters
```

**Beklenen Sonuç:**

```json
{
  "success": true,
  "message": "SystemParameter seed tamamlandı",
  "stats": {
    "created": 26,
    "updated": 0,
    "total": 26,
    "groups": [
      { "paramGroup": "TX_TYPE", "_count": 2 },
      { "paramGroup": "TX_CATEGORY", "_count": 16 },
      { "paramGroup": "PAYMENT_METHOD", "_count": 6 },
      { "paramGroup": "CURRENCY", "_count": 4 }
    ]
  }
}
```

### Adım 2: Kullanıcı Durumunu Kontrol Edin

```bash
GET https://giderse-gelir.netlify.app/api/debug-user
```

**Beklenen Sonuç:**

```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "plan": "premium", // <-- Bu "free" ise sorun var
    "isActive": true
  },
  "subscriptions": {
    "active": {
      "id": 1,
      "planId": "premium", // <-- Bu kullanıcının gerçek planı
      "status": "active"
    }
  },
  "diagnosis": {
    "issue": "OK" // <-- "OK" değilse sorun var
  }
}
```

### Adım 3: Premium Kullanıcı Aboneliğini Düzeltin

Eğer kullanıcı premium ama sistem free gösteriyorsa:

**Postman veya cURL ile:**

```bash
POST https://giderse-gelir.netlify.app/api/subscription/upgrade
Content-Type: application/json

{
  "planId": "premium",
  "paymentMethod": "credit_card"
}
```

**Veya direkt SQL ile (Netlify Functions üzerinden):**

```sql
-- Önce mevcut aktif abonelikleri iptal et
UPDATE user_subscription
SET status = 'cancelled', cancelled_at = NOW()
WHERE user_id = {USER_ID} AND status = 'active';

-- Yeni premium abonelik oluştur
INSERT INTO user_subscription (
  user_id, plan_id, status, start_date, end_date,
  amount, currency, payment_method, auto_renew, created_at, updated_at
) VALUES (
  {USER_ID},
  'premium',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days',
  250.00,
  'TRY',
  'credit_card',
  true,
  NOW(),
  NOW()
);
```

### Adım 4: Değişiklikleri Deploy Edin

```bash
# Yeni dosyaları Git'e ekleyin
git add app/api/seed-parameters/
git add app/api/debug-user/
git add NETLIFY_FIX_GUIDE.md

# Commit yapın
git commit -m "Fix: SystemParameter seed ve premium kontrolü düzeltildi"

# Netlify'a push edin
git push origin master
```

### Adım 5: Netlify Deploy Sonrası Kontrol

1. Netlify deploy tamamlanınca tarayıcınızı yenileyin
2. Console'u açın (F12)
3. Şu loglara bakın:
   ```
   ✅ Reference data hazırlandı: { txTypes: 2, categories: 16, ... }
   🔐 User authenticated: { plan: "premium", ... }
   ```

---

## Debug Endpoint'leri

### 1. SystemParameter Durumunu Kontrol Et

```bash
GET /api/seed-parameters
```

**Sonuç:**

```json
{
  "success": true,
  "total": 26,
  "groups": [...]
}
```

### 2. Kullanıcı ve Abonelik Durumunu Kontrol Et

```bash
GET /api/debug-user
```

### 3. Reference Data Kontrolü

```bash
GET /api/reference-data
```

Console'da bu log görünmeli:

```
📊 SystemParameter veriler: { txTypes: 2, categories: 16, paymentMethods: 6, currencies: 4 }
✅ Reference data hazırlandı: { ... }
```

---

## Sık Sorunlar ve Çözümleri

### Sorun: Kategoriler hala boş geliyor

**Çözüm:**

1. `/api/seed-parameters` POST endpoint'ini çağırın
2. Netlify Functions loglarını kontrol edin
3. Database connection string'ini kontrol edin

### Sorun: Premium kullanıcı hala FREE gösteriliyor

**Çözüm:**

1. `/api/debug-user` GET endpoint'ini çağırın
2. `diagnosis.issue` alanına bakın
3. Aktif abonelik yoksa oluşturun
4. Logout yapıp tekrar login olun (session yenilensin)

### Sorun: 403 Forbidden hataları

**Çözüm:**
Premium kontrolleri kaldırılmış durumda. Eğer hala görüyorsanız:

1. Browser cache'ini temizleyin
2. Hard refresh yapın (Ctrl+Shift+R)
3. Logout/login yapın

---

## Veritabanı Manuel Kontrol

Netlify Postgres veya kullandığınız veritabanı üzerinde:

### SystemParameter Kontrolü

```sql
SELECT param_group, COUNT(*)
FROM system_parameter
WHERE is_active = true
GROUP BY param_group;
```

**Beklenen Sonuç:**

```
param_group      | count
-----------------+-------
TX_TYPE         | 2
TX_CATEGORY     | 16
PAYMENT_METHOD  | 6
CURRENCY        | 4
```

### User Subscription Kontrolü

```sql
SELECT u.email, u.name, s.plan_id, s.status, s.start_date, s.end_date
FROM "user" u
LEFT JOIN user_subscription s ON u.id = s.user_id AND s.status = 'active'
ORDER BY u.id;
```

---

## Deployment Checklist

- [x] `app/api/seed-parameters/route.ts` oluşturuldu
- [x] `app/api/debug-user/route.ts` oluşturuldu
- [x] `app/api/reference-data/route.ts` güncellendi (loglama eklendi)
- [x] `server/services/impl/AuthService.ts` güncellendi (loglama eklendi)
- [ ] Git commit yapıldı
- [ ] Netlify'a push edildi
- [ ] Netlify deploy tamamlandı
- [ ] `/api/seed-parameters` POST çağrıldı
- [ ] `/api/debug-user` GET ile kullanıcı kontrol edildi
- [ ] Browser'da test edildi

---

## İletişim

Sorun devam ederse:

1. Netlify Functions loglarını kontrol edin
2. Browser console loglarını kontrol edin
3. `/api/debug-user` sonucunu paylaşın
4. Database query sonuçlarını paylaşın
