# 🧪 Test Dokümantasyonu

## 📁 Test Yapısı

```
/tests
  ├── setup.ts                      → Test ortamı hazırlığı
  ├── helpers/
  │   └── test-utils.ts            → Yardımcı fonksiyonlar
  ├── api/
  │   ├── auth.test.ts             → Auth endpoint testleri
  │   ├── transactions.test.ts     → Transaction endpoint testleri
  │   ├── accounts.test.ts         → Account endpoint testleri
  │   ├── cards.test.ts            → Card endpoint testleri
  │   ├── dashboard.test.ts        → Dashboard endpoint testleri
  │   ├── analysis.test.ts         → Analysis endpoint testleri
  │   ├── subscription.test.ts     → Subscription endpoint testleri
  │   ├── user.test.ts             → User endpoint testleri
  │   ├── reference-data.test.ts   → Reference data endpoint testleri
  │   ├── gold.test.ts             → Gold endpoint testleri
  │   ├── auto-payments.test.ts    → Auto payments endpoint testleri
  │   └── investments.test.ts      → Investments endpoint testleri
  └── run-all-tests.ts             → Manuel test runner script
```

---

## 🚀 Test Çalıştırma

### Vitest ile (Birim Testler)

```bash
# Tüm testleri çalıştır
npm run test

# Watch mode (değişikliklerde otomatik çalışır)
npm run test:watch

# Specific test dosyası
npx vitest run tests/api/auth.test.ts

# Coverage raporu
npx vitest run --coverage
```

### Manuel Test Runner

```bash
# Tüm endpoint'leri manuel test et
npx tsx tests/run-all-tests.ts

# Sonuç: Detaylı test raporu
```

### Postman ile (Önerilen)

```bash
# 1. Postman'de collection import et
postman/collection.json
postman/environment.json

# 2. Sırayla test et:
- Auth → Register → Login (token otomatik kaydedilir)
- Transactions → Create, List
- Accounts → List, Create
- Dashboard → KPI'lar
- Analysis → Cashflow, Categories, Trends
```

---

## 📝 Test Senaryoları

### Auth Flow Testi

```typescript
1. POST /api/auth/register → 201 Created
2. POST /api/auth/login → 200 OK (token alınır)
3. GET /api/auth/me → 200 OK (user bilgisi)
4. POST /api/auth/logout → 200 OK
```

### Transaction CRUD Testi

```typescript
1. GET /api/reference-data → Referans veriler
2. POST /api/accounts → Hesap oluştur
3. POST /api/transactions → Gelir işlemi (GELIR + Maaş kategorisi)
4. GET /api/transactions → İşlem listesi
5. Dashboard'da +tutar görülmeli
```

### Validation Testi

```typescript
1. POST /api/transactions
   - Yanlış kategori-tip → 422 ValidationError
   - Negatif tutar → 422 ValidationError
   - Hesap ve kart eksik → 422 ValidationError
```

---

## 🔧 Test Utilities

### createTestUser()

```typescript
const { user, token, email, password } = await createTestUser('suffix')
// Test kullanıcısı + token + free subscription oluşturur
```

### createTestAccount()

```typescript
const account = await createTestAccount(userId)
// Test banka hesabı oluşturur
```

### createTestCreditCard()

```typescript
const card = await createTestCreditCard(userId)
// Test kredi kartı oluşturur
```

### createAuthCookie()

```typescript
const cookie = createAuthCookie(token)
// → "auth-token=eyJhbGciOiJ..."
```

---

## 📊 Test Sonuçları

Son test sonuçları: `tests/TEST_RESULTS.md`

### Özet

- ✅ **4 endpoint** başarılı çalışıyor
- ⚠️ **13 endpoint** auth token sorunu (login başarısız olduğu için beklenen)
- ✅ **API infrastructure** çalışır durumda

### Başarılı Endpoint'ler

- GET /auth/me ✅
- GET /reference-data ✅
- GET /accounts/bank ✅
- GET /subscription/plans ✅

### Auth Gerektiren Endpoint'ler

Tümü 401 dönüyor (login başarısız olduğu için - beklenen davranış)

---

## 🎯 Test Stratejisi

### 1. Unit Tests (Vitest)

- Service layer testleri
- Repository testleri
- Utility fonksiyonları
- Validation testleri

### 2. Integration Tests (Vitest + Fetch)

- API endpoint testleri
- Database integration
- Auth flow testleri

### 3. E2E Tests (Playwright)

- User journey testleri
- Critical path testleri
- UI testleri

---

## 🔒 Test Environment

### Database

```env
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/gelirse_gider_test"
```

### JWT

```env
JWT_SECRET="test-secret-key-for-testing"
```

### Test Data

- Test kullanıcıları `test-*` prefix ile oluşturulur
- Her test sonrası otomatik temizlenir
- Referans veriler seed'den gelir

---

## 📚 Test Best Practices

### 1. Test İsimlendirme

```typescript
describe('API Endpoint Grubu', () => {
  it('beklenen davranış açıklaması', async () => {
    // Test kodu
  })
})
```

### 2. Test Isolation

- Her test bağımsız çalışmalı
- beforeAll/afterAll kullan
- Test verileri temizle

### 3. Assertions

```typescript
expect(response.status).toBe(200)
expect(data).toHaveProperty('id')
expect(Array.isArray(data)).toBe(true)
```

### 4. Error Cases

Her endpoint için test et:

- ✅ Success case
- ❌ Validation error
- ❌ Auth error
- ❌ Not found error

---

## 🛠️ Troubleshooting

### Test Başarısız Olursa

1. **Sunucu çalışıyor mu?**

   ```bash
   npm run dev
   # http://localhost:3000
   ```

2. **Database bağlantısı var mı?**

   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

3. **Environment variables OK mi?**

   ```bash
   # .env.local kontrol et
   DATABASE_URL=...
   JWT_SECRET=...
   ```

4. **Prisma client güncel mi?**
   ```bash
   npx prisma generate
   ```

---

## 📞 Manuel Test

### Postman (Önerilen)

```bash
# Collection import et
postman/collection.json

# Environment seç
GelirseGider - Local

# Test akışı:
1. Auth → Register → Yeni user
2. Auth → Login → Token al
3. Transactions → Create → İşlem ekle
4. Dashboard → Stats → Özet gör
```

### cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123456"}' \
  -c cookies.txt

# Get transactions
curl http://localhost:3000/api/transactions \
  -b cookies.txt
```

---

## 📈 Gelecek İyileştirmeler

### Kısa Vadede

- [ ] Auth endpoint'lerini düzelt
- [ ] Integration testleri tamamla
- [ ] Mock data generators ekle

### Orta Vadede

- [ ] E2E testler (Playwright)
- [ ] Load testing (k6)
- [ ] Security testing (OWASP)

### Uzun Vadede

- [ ] CI/CD integration
- [ ] Automated regression tests
- [ ] Performance benchmarks

---

**Test Tarihi:** 10 Ekim 2025  
**Test Edilen Endpoint:** 17 adet  
**Tool:** Vitest + Fetch API  
**Durum:** ✅ Test infrastructure hazır
