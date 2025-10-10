# 🔍 MANUEL SENKRONİZASYON TESTİ

## Test Edilen Kod Bölümleri

### 1. TransactionService.create() - Satır 75-118

```typescript
// Mapping SONRASI
const [refTxTypeId, refCategoryId, refPaymentMethodId, refCurrencyId] = await Promise.all([...])

// NAKİT KONTROLÜ
let effectiveAccountId = data.accountId
if (!data.accountId && !data.creditCardId) {
  effectiveAccountId = await this.ensureCashAccount(data.userId, refPaymentMethodId)
}

// TRANSACTION OLUŞTUR
const createData: Prisma.TransactionCreateInput = {
  ...
}

if (effectiveAccountId) {
  createData.account = { connect: { id: effectiveAccountId } }
} else if (data.creditCardId) {
  createData.creditCard = { connect: { id: data.creditCardId } }
}

const transaction = await this.transactionRepository.createWithRelations(createData)

// BAKİYE GÜNCELLE
const balanceUpdateData = { ...data, accountId: effectiveAccountId }
await this.updateAccountBalance(balanceUpdateData, refTxTypeId)
```

**Analiz:**
- ✅ effectiveAccountId nakit için doğru atanıyor
- ✅ balanceUpdateData'da effectiveAccountId kullanılıyor
- ✅ updateAccountBalance çağrılıyor

### 2. updateAccountBalance() - Satır 196-242

```typescript
const isIncome = refTxTypeId === 3 // GELIR: +, GIDER: -

if (data.accountId) {
  const currentAccount = await this.prisma.account.findUnique({ where: { id: data.accountId } })
  
  const newBalance = isIncome
    ? currentAccount.balance.add(amount)  // Gelir: +
    : currentAccount.balance.sub(amount)  // Gider: -
  
  await this.prisma.account.update({
    where: { id: data.accountId },
    data: { balance: newBalance }
  })
}
```

**Analiz:**
- ✅ Gider için `.sub(amount)` kullanılıyor
- ✅ Hem banka hesabı hem nakit için çalışır
- ✅ Bakiye azalır

## ✅ KOD ANALİZİ SONUCU

Backend kodu **DOĞRU**! Nakit giderler nakit hesabından düşüyor.

## 🔍 OLASI SORUNLAR

### Sorun 1: Dashboard Render Problemi
Frontend'de `data.kpi.total_expense` gösterilmiyor olabilir mi?

**Kontrol:** `app/(dashboard)/dashboard/page.tsx` satır 193-199
```tsx
<div className="text-3xl font-bold...">
  {formatCurrency(parseFloat(data.kpi.total_expense), 'TRY')}
</div>
```
**Sonuç:** ✅ Kod doğru

### Sorun 2: Cache/Refresh Problemi
Dashboard sayfası yenilenmemiş olabilir.

**Çözüm:** 
1. Sayfa yenile (F5)
2. Hard refresh (Ctrl+Shift+R)
3. Browser cache temizle

### Sorun 3: Transaction Tarihi
Dashboard son 30 günü gösteriyor. Eski transaction'lar gösterilmez.

**Kontrol:** Transaction tarihleri son 30 günde mi?

## 🧪 TEST SENARYOSU

### Nakit Gider Test:
```
1. Gider Ekle sayfasına git
2. Kategori: Market
3. Tutar: 5000
4. Ödeme: Nakit
5. Hesap/Kart: BOŞ BIRAK
6. [Gider Ekle]

Beklenen:
  - Nakit hesabı otomatik oluşturulur/bulunur
  - Transaction kaydedilir (accountId: Nakit hesap)
  - Nakit bakiyesi: -5000 TL
  - Dashboard Total Expense: +5000 TL
  - Dashboard Hesap Bakiyeleri: -5000 TL
```

## 📊 GERÇEK VERİ (demo@giderse.com)

Elimizdeki bilgiler (önceki test'ten):
```
Nakit Hesap ID: 94
Nakit Bakiye: 30.000 TL
Nakit Transactions:
  - 532: GELIR +15.000 TL (Ek Gelir)
  - 533: GELIR +15.000 TL (Diğer Gelir)

Beklenen Bakiye: 0 + 15.000 + 15.000 = 30.000 TL
Mevcut Bakiye: 30.000 TL
✅ DOĞRU
```

**Sonuç:** Nakit GELİRLER doğru işliyor. GİDER test edilmemiş!

## ⚠️ KULLANICI AKSİYONU GEREKLİ

Lütfen şunu test edin:

1. **Nakit Gider Ekleyin:**
   - Gider Ekle → Market → 2.000 TL → Nakit → [Kaydet]
   - Hesaplar sayfasına gidin
   - Nakit hesabına tıklayın
   - Bakiye 30.000 - 2.000 = 28.000 TL olmalı ✅

2. **Dashboard'ı Yenileyin:**
   - Dashboard sayfasını yenileyin (F5)
   - "Toplam Gider" kartında gider gösterilmeli ✅
   - "Hesap Bakiyeleri" azalmış olmalı ✅

3. **Hata Mesajı Varsa Paylaşın:**
   - Console hataları
   - Network tab (API response)

