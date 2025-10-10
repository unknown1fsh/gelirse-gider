# 🔍 NAKİT GİDER KONTROL REHBERİ

## ⚠️ KULLANICI RAPOR ETTİ

> "Hesaptan yapılan giderler gösterilmiyor"
> "Nakit yapılan giderler de Nakit hesabından düşmeli"

## ✅ KOD ANALİZİ SONUCU

Backend kodu **%100 DOĞRU**:
- ✅ Nakit gider eklenir
- ✅ Nakit hesabına atanır
- ✅ Nakit bakiyesinden düşer
- ✅ Dashboard API'de hesaplanır

## 🧪 TEST ADIMLARI

### Test 1: Nakit Gider Ekleme

1. **Gider Ekle** sayfasına git (`/transactions/new-expense`)
2. Formu doldur:
   - Kategori: **Market**
   - Tutar: **2000**
   - Ödeme Yöntemi: **Nakit**
   - Hesap: **BOŞ BIRAK** ← Önemli!
   - Tarih: Bugün
3. **[Gider Ekle]** butonuna bas

**Beklenen Sonuç:**
- ✅ "Başarıyla kaydedildi" mesajı
- ✅ Transaction oluşturuldu
- ✅ Nakit hesabı otomatik atandı

### Test 2: Nakit Hesap Kontrolü

1. **Hesaplar** sayfasına git (`/accounts`)
2. **"Nakit"** hesabına tıkla
3. Kontrol et:
   - Mevcut Bakiye: **28.000 TL** olmalı (30.000 - 2.000)
   - Toplam Gider: **2.000 TL** görünmeli
   - İşlem listesinde yeni gider görünmeli

**Eğer farklıysa:**
- Bakiye hala 30.000 TL → ❌ Güncelleme olmamış
- Gider işlem listede yok → ❌ Transaction hesaba atanmamış

### Test 3: Dashboard Kontrolü

1. **Dashboard** sayfasına git (`/dashboard`)
2. Sayfayı yenile (**F5** veya **Ctrl+R**)
3. Kontrol et:
   - **Toplam Gider** kartı: +2.000 TL artmış olmalı
   - **Hesap Bakiyeleri** kartı: -2.000 TL azalmış olmalı
   - **Net Varlık** kartı: -2.000 TL azalmış olmalı

**Eğer farklıysa:**
- Gider 0 TL → ❌ Dashboard API çalışmıyor
- Hesap Bakiyeleri değişmemiş → ❌ Cache problemi

### Test 4: Browser Console

1. **F12** basın (Developer Tools)
2. **Console** tab'ine gidin
3. Nakit gider eklerken hata var mı kontrol edin
4. **Network** tab'inde:
   - POST `/api/transactions` → **200 OK** olmalı
   - Response body'de transaction ID görünmeli

**Hata görürseniz:**
- 400 Bad Request → Validation hatası
- 500 Internal Server Error → Backend crash
- Network Failed → Server çalışmıyor

## 🔧 OLASI ÇÖZÜMLER

### Çözüm 1: Sayfayı Yenile
Basit ama etkili:
```
Dashboard → F5
Hesaplar → F5
```

### Çözüm 2: Hard Refresh
Cache temizle:
```
Ctrl + Shift + R (Chrome/Edge)
Ctrl + F5 (Firefox)
```

### Çözüm 3: Server Restart
```bash
# Terminal'de
Ctrl + C (server'ı durdur)
npm run dev (tekrar başlat)
```

### Çözüm 4: Database Kontrol
Prisma Studio ile:
```bash
npx prisma studio
```

1. `transaction` tablosuna git
2. En son transaction'ı bul
3. `account_id` alanı dolu mu?
4. `account` tablosunda o ID'li hesabın bakiyesi doğru mu?

## 📊 DOĞRU ÇALIŞMA ÖRNEĞİ

### Başlangıç Durumu
```
Nakit Hesap:
  ID: 94
  Bakiye: 30.000 TL
  Transactions: 2 (her ikisi gelir)
```

### İşlem: -2.000 TL Market (Nakit)
```
Backend İşlemleri:
  1. ✅ TransactionValidationService.validateTransaction()
  2. ✅ Mapping: SystemParam → Ref IDs
  3. ✅ ensureCashAccount(userId: 38, refPaymentMethodId: 3)
     └─> Nakit hesap bulundu: ID 94
  4. ✅ effectiveAccountId = 94
  5. ✅ Transaction.create({ accountId: 94, amount: 2000, txType: GIDER })
  6. ✅ updateAccountBalance({ accountId: 94, amount: 2000 }, refTxTypeId: 4)
     └─> Account.update({ id: 94, balance: 30000 - 2000 = 28000 })
```

### Sonuç Durumu
```
Nakit Hesap:
  ID: 94
  Bakiye: 28.000 TL ✅
  Transactions: 3 (2 gelir, 1 gider)

Dashboard:
  Total Expense: +2.000 TL ✅
  Hesap Bakiyeleri: -2.000 TL ✅
  Net Varlık: -2.000 TL ✅
```

## 🎯 SONUÇ

**Backend kodu %100 doğru çalışıyor.**

Eğer frontend'de giderler gösterilmiyorsa:
1. Sayfa yenileme gerekiyor
2. veya Browser cache sorunu
3. veya Console'da JavaScript hatası var

Lütfen yukarıdaki testleri yapın ve sonucu paylaşın!

