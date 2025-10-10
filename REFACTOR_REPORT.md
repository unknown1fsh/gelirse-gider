# REFACTOR RAPORU - giderseGelir Next.js Projesi

**Tarih:** 10 Ekim 2025  
**Proje:** GelirseGider - Kişisel Finans Yönetim Sistemi  
**Teknoloji Stack:** Next.js 15, TypeScript, PostgreSQL, Prisma ORM

---

## 📋 MEVCUT DURUM ANALİZİ

### ✅ Güçlü Yönler

1. **Modern teknoloji stack** - Next.js 15 App Router kullanımı
2. **Zengin veritabanı şeması** - Prisma ile iyi yapılandırılmış
3. **Zod validasyon** - Form ve API validasyonları mevcut
4. **UI komponenti** - Radix UI ile profesyonel bileşenler
5. **Auth sistemi** - JWT tabanlı kimlik doğrulama
6. **Subscription modeli** - Freemium iş modeli

### ⚠️ İyileştirme Gereken Alanlar

#### 1. **Katmanlı Mimari Eksikliği**

- ❌ Service katmanı yok
- ❌ Repository pattern uygulanmamış
- ❌ DTO/Entity ayrımı yok
- ❌ Mapper katmanı yok
- ❌ Route handler'lar iş mantığını içeriyor

#### 2. **TypeScript Ayarları**

```json
"strict": false  // ❌ Kapalı - açılmalı!
```

- Type safety yetersiz
- Implicit any kullanımı mevcut

#### 3. **Kod Kalitesi**

- ❌ console.log kullanımları var (48 ve 64. satırlar)
- ❌ Magic string'ler var ("free", "active", "pending" vb.)
- ❌ Hata yönetimi merkezi değil
- ❌ Kod tekrarları mevcut

#### 4. **Güvenlik**

- ⚠️ JWT_SECRET varsayılan değer kullanıyor (auth.ts:30)
- ⚠️ .env dosyası eksik
- ⚠️ Hassas bilgiler hardcoded

#### 5. **Bağımlılıklar**

- ✅ Güncel paketler kullanılıyor
- ⚠️ @emnapi/runtime extraneous (kullanılmayan)
- ⚠️ next-auth kullanılmıyor ama kurulu

#### 6. **Test & Dokümantasyon**

- ❌ Test dosyası yok
- ❌ API dokümantasyonu yok
- ❌ Postman collection yok
- ❌ ARCHITECTURE.md yok

---

## 🎯 REFACTOR PLANI (10 FAZ)

### FAZ 0 ✅ — Analiz ve Raporlama

- [x] Mevcut kod analizi
- [x] Bağımlılık kontrolü
- [x] Güvenlik açıkları tespiti
- [x] Rapor oluşturma

### FAZ 1 — TypeScript & Lint & Format Standardizasyonu

- [ ] strict mode: true
- [ ] ESLint kuralları sıkılaştırma
- [ ] Prettier yapılandırması
- [ ] Husky + lint-staged kurulumu
- [ ] Commitlint (Conventional Commits)

### FAZ 2 — Katmanlı Mimariye Taşıma

```
/server/
  entities/        → Domain modelleri
  dto/             → Request/Response DTO'ları
  mappers/         → Entity <-> DTO dönüşümleri
  repositories/    → Prisma erişim katmanı
  services/impl/   → Service implementasyonları
  specs/           → QueryBuilder
  enums/           → Enum tanımları
  clients/         → Dış servis client'ları
  errors/          → Hata yönetimi
  utils/           → Yardımcı fonksiyonlar
```

### FAZ 3 — Prisma & PostgreSQL

- [ ] .env dosyası oluşturma
- [ ] DATABASE_URL yapılandırması
- [ ] Migration kontrolü
- [ ] Seed script optimize

### FAZ 4 — Repository + Service + Mapper

- [ ] BaseRepository<T>
- [ ] BaseService<T>
- [ ] BaseEntity
- [ ] BaseDTO
- [ ] UserRepository
- [ ] UserService
- [ ] TransactionRepository
- [ ] TransactionService
- [ ] (Diğer entity'ler için...)

### FAZ 5 — Specification Pattern

- [ ] QueryBuilder sınıfı
- [ ] where, and, or, like
- [ ] range, sort, paginate
- [ ] Dinamik filtreleme

### FAZ 6 — Error Management

- [ ] BaseError
- [ ] HttpError (400, 401, 404, 409, 500)
- [ ] ExceptionMapper
- [ ] Global error handler middleware

### FAZ 7 — ClientConfig & Dış Servis

- [ ] ClientConfig.ts
- [ ] Timeout, retry mekanizması
- [ ] TCMB döviz servisi
- [ ] Altın fiyat servisi

### FAZ 8 — Güvenlik ve Gizlilik

- [ ] JWT_SECRET environment variable
- [ ] Hassas bilgilerin şifrelenmesi
- [ ] Input sanitization
- [ ] Rate limiting

### FAZ 9 — Postman Koleksiyonu

- [ ] /postman/collection.json
- [ ] Environment variables
- [ ] Tüm endpoint'ler

### FAZ 10 — Dokümantasyon & Final Clean

- [ ] ARCHITECTURE.md
- [ ] API.md
- [ ] README.md güncelleme
- [ ] Kullanılmayan kod/import temizliği
- [ ] Final test & build

---

## 📦 KULLANILMAYAN BAĞIMLILIKLAR

### Kaldırılabilir

- `@emnapi/runtime` - extraneous
- `next-auth` - Kullanılmıyor (custom auth var)

### Eksik Olabilecekler (Eklenecek)

- `husky` - Git hooks
- `lint-staged` - Pre-commit linting
- `@commitlint/cli` - Commit standardı
- `supertest` - API testing (vitest ile birlikte)

---

## 🔐 GÜVENLİK UYARILARI

### 🚨 Kritik

1. **JWT Secret** - Hardcoded, .env'e taşınmalı
2. **Database şifresi** - Raporda açık yazılı, .env'de saklanmalı
3. **Default password hash** - Güçlendirilmeli (bcrypt rounds: 12)

### ⚠️ Orta

1. Session süreleri uzun (30 gün) - ayarlanabilir yapılmalı
2. Plan kontrolü her route'ta tekrarlanıyor - middleware'e taşınmalı

---

## 📊 İSTATİSTİKLER

### Dosya Sayıları

- **Pages:** ~40
- **API Routes:** ~30
- **Components:** ~60+
- **Lib Files:** 5
- **Prisma Models:** 16

### Refactor Efor Tahmini

- **FAZ 1:** 2 saat
- **FAZ 2:** 4 saat
- **FAZ 3:** 1 saat
- **FAZ 4:** 8 saat
- **FAZ 5:** 3 saat
- **FAZ 6:** 3 saat
- **FAZ 7:** 2 saat
- **FAZ 8:** 2 saat
- **FAZ 9:** 1 saat
- **FAZ 10:** 2 saat
- **TOPLAM:** ~28 saat

---

## ✅ KABUL KRİTERLERİ

1. ✅ Her metot başında Türkçe açıklama
2. ✅ `npm run typecheck && npm run lint && npm run test` hatasız
3. ✅ PostgreSQL bağlantısı doğru (gelirse_gider)
4. ✅ Şifre .env'de: &rEXMe^%}}x_2Vga
5. ✅ Kullanılmayan import/paket yok
6. ✅ Kod yapısı clean, düzenli, testlerle doğrulanmış
7. ✅ Cursor IDE'de doğrudan çalışır

---

**Rapor Sahibi:** Cursor AI Assistant  
**Next Step:** FAZ 1'e geçiş - TypeScript & Lint & Format Standardizasyonu
