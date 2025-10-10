# 🔍 VERİTABANI ANALİZ VE DÜZELTMELERİ

## 🐛 Tespit Edilen Sorunlar

### 1. **KRİTİK: Gelir/Gider Karışıklığı**

**Sorun:**  
Frontend'te yeni işlem eklerken `txTypeId` varsayılan olarak `data.txTypes[0].id` seçiliyor.

```typescript
// app/(transactions)/transactions/new/page.tsx:59
if (data.txTypes.length > 0) {
  setFormData(prev => ({ ...prev, txTypeId: data.txTypes[0].id }))
}
```

**Neden Sorun:**

- Seed data'da GELIR id:1, GIDER id:2 olarak tanımlı
- Ancak veritabanında sıralama değişirse (örn. manual insert)
- Veya kullanıcı seçim yapmadan submit ederse
- Her zaman dizinin ilk elemanı (hangi tip olursa) seçilir

**Çözüm:**

1. Varsayılan değer YOK - kullanıcı seçmek zorunda
2. Validation ekle - txTypeId zorunlu
3. Frontend'te seçim yapılmadıysa uyarı göster

---

### 2. **Schema Eksikliği: userId Eksik**

**Sorun:**  
`RefTxCategory` model'inde `id` field'ı eksik!

```prisma
model RefTxCategory {
  // ❌ id field'ı yok!
  txTypeId   Int      @map("tx_type_id")
  code       String   @db.VarChar(30)
  name       String   @db.VarChar(50)
  ...
}
```

**Çözüm:**

```prisma
model RefTxCategory {
  id         Int      @id @default(autoincrement()) // ✅ EKLENDİ
  txTypeId   Int      @map("tx_type_id")
  ...
}
```

---

### 3. **Validation Eksikliği**

**Sorun:**

- Transaction oluştururken txTypeId ve categoryId uyumluluğu kontrol edilmiyor
- Örneğin: GIDER tipinde ama GELIR kategorisi seçilebiliyor

**Çözüm:**
Service katmanında validation:

```typescript
// Bu metot kategori ve tip uyumluluğunu kontrol eder
async validateCategoryMatchesType(categoryId: number, txTypeId: number) {
  const category = await prisma.refTxCategory.findUnique({
    where: { id: categoryId }
  })
  if (category.txTypeId !== txTypeId) {
    throw new ValidationError('Kategori ve işlem tipi uyuşmuyor')
  }
}
```

---

### 4. **Fazlalıklar**

**Kaldırılacaklar:**

- `GoldItem` → Gereksiz (altın ayrı modül olacaksa)
- `FxRate` → Manuel eklenecek (otomatik çekilmiyorsa)
- `PortfolioSnapshot` → Daha sonra

---

### 5. **Eksikler**

**Eklenecekler:**

- `Transaction.isRecurring` → Tekrarlayan işlem mi?
- `Transaction.recurringInterval` → Tekrar aralığı
- `Transaction.notes` → İç notlar (description'dan farklı)
- `RefTxCategory.icon` → Kategori ikonu
- `RefTxCategory.color` → Kategori rengi

---

## ✅ Düzeltme Planı

### Faz 1: Schema Düzeltmeleri

- [x] RefTxCategory'ye id ekle
- [x] Transaction validation ekle
- [ ] Gereksiz modeller kaldır
- [ ] Eksik alanlar ekle

### Faz 2: Seed Data Düzeltmeleri

- [x] GELIR id:1, GIDER id:2 garantile
- [x] Kategorileri tip bazlı grupla
- [x] Renk ve icon ekle

### Faz 3: API Düzeltmeleri

- [x] Transaction create validation
- [x] Category-Type uyumluluk kontrolü
- [x] Helper fonksiyonlar

### Faz 4: Frontend Düzeltmeleri

- [x] Varsayılan seçim kaldır
- [x] Zorunlu alan validasyonu
- [x] Kullanıcı dostu hata mesajları

---

## 📊 Güncellenmiş Schema

```prisma
model RefTxType {
  id        Int      @id @default(autoincrement())
  code      String   @unique @db.VarChar(10)
  name      String   @db.VarChar(20)
  icon      String?  @db.VarChar(50)      // YENİ
  color     String?  @db.VarChar(20)      // YENİ
  active    Boolean  @default(true)
  ...
}

model RefTxCategory {
  id          Int      @id @default(autoincrement())  // ✅ EKLENDİ
  txTypeId    Int      @map("tx_type_id")
  code        String   @db.VarChar(30)
  name        String   @db.VarChar(50)
  icon        String?  @db.VarChar(50)      // YENİ
  color       String?  @db.VarChar(20)      // YENİ
  isDefault   Boolean  @default(false)      // YENİ (varsayılan kategori)
  ...
}

model Transaction {
  id              Int       @id @default(autoincrement())
  userId          Int       @map("user_id")
  txTypeId        Int       @map("tx_type_id")
  categoryId      Int       @map("category_id")
  amount          Decimal   @db.Decimal(15, 2)

  // YENİ ALANLAR
  isRecurring     Boolean   @default(false) @map("is_recurring")
  recurringType   String?   @db.VarChar(20)  // MONTHLY, WEEKLY, YEARLY
  notes           String?                     // İç notlar
  ...
}
```

---

## 🎯 Beklenen Sonuç

✅ Gelir eklerken GELIR kategorileri görünsün  
✅ Gider eklerken GIDER kategorileri görünsün  
✅ Yanlış tip-kategori kombinasyonu engellensin  
✅ Kullanıcı zorunlu alanları doldurmadan submit edemesi  
✅ Veritabanı tutarlılığı garanti edilsin

---

**Analiz Tarihi:** 10 Ekim 2025  
**Durum:** Düzeltmeler uygulanıyor...
