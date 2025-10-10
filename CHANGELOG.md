# Changelog

Tüm önemli değişiklikler bu dosyada belgelenecektir.

Format [Keep a Changelog](https://keepachangelog.com/tr/1.0.0/) standardına dayanır ve bu proje [Semantic Versioning](https://semver.org/lang/tr/) kullanır.

## [2.1.0] - 2025-10-10

### 🐛 Düzeltmeler

#### Gelir/Gider Karışıklığı Sorunu ✅

- **SORUN:** Gelir eklerken GIDER olarak kaydediliyordu
- **NEDEN:** Frontend'te varsayılan olarak `txTypes[0].id` seçiliyordu
- **ÇÖZÜM:**
  - Frontend'te varsayılan seçim kaldırıldı
  - Kullanıcı zorunlu olarak tip seçecek
  - Submit öncesi validation eklendi
  - Backend'te kategori-tip uyumluluk kontrolü eklendi

### ✨ Eklenenler

#### Schema Güncellemeleri

- `RefTxType.icon` (VARCHAR 50) - İşlem tipi ikonu
- `RefTxType.color` (VARCHAR 20) - İşlem tipi rengi
- `RefTxCategory.icon` (VARCHAR 50) - Kategori ikonu
- `RefTxCategory.color` (VARCHAR 20) - Kategori rengi
- `RefTxCategory.isDefault` (BOOLEAN) - Varsayılan kategori flag
- `Transaction.notes` (TEXT) - İç notlar
- `Transaction.isRecurring` (BOOLEAN) - Tekrarlayan işlem flag
- `Transaction.recurringType` (VARCHAR 20) - Tekrar aralığı

#### Yeni Servisler

- `TransactionValidationService` - İşlem validasyonları
  - `validateCategoryMatchesType()` - Kategori-tip uyumluluk
  - `validateTransactionTypeIsActive()` - Tip aktiflik kontrolü
  - `validateCategoryIsActive()` - Kategori aktiflik kontrolü
  - `validateAccountOrCreditCard()` - Hesap/kart kontrolü
  - `validateAmount()` - Tutar kontrolü
  - `validateTransactionDate()` - Tarih kontrolü
  - `validateTransaction()` - Tüm validasyonlar

#### Yeni Utilities

- `TransactionHelper` - İşlem yardımcı fonksiyonları
  - `isIncome()` - Gelir kontrolü
  - `isExpense()` - Gider kontrolü
  - `getSignedAmount()` - İşaretli tutar
  - `getTypeColor()` - Tip rengi
  - `getTypeIcon()` - Tip ikonu
  - `groupByType()` - Gelir/gider gruplama
  - `calculateTotalIncome()` - Toplam gelir
  - `calculateTotalExpense()` - Toplam gider
  - `calculateNetBalance()` - Net bakiye

#### Yeni Enum

- `RecurringType` - Tekrar aralıkları (DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY)

### 🔧 Değiştirileler

#### Frontend

- `app/(transactions)/transactions/new/page.tsx`
  - Varsayılan `txTypeId` seçimi kaldırıldı
  - Submit öncesi 4 zorunlu alan kontrolü eklendi
  - Kullanıcı dostu hata mesajları

#### Backend

- `app/api/transactions/route.ts`
  - `ExceptionMapper.asyncHandler` ile wrap edildi
  - `TransactionService` kullanımına geçildi
  - Merkezi hata yönetimi aktif

- `server/services/impl/TransactionService.ts`
  - `TransactionValidationService` entegre edildi
  - `create()` metodunda tüm validasyonlar çalıştırılıyor

#### Database

- Seed data güncellendi
  - GELIR: icon="TrendingUp", color="#10b981"
  - GIDER: icon="TrendingDown", color="#ef4444"

### 📚 Dokümantasyon

- `docs/DATABASE_ANALYSIS.md` - Veritabanı analiz raporu
- `docs/DATABASE_FIX_SUMMARY.md` - Detaylı düzeltme özeti
- `DATABASE_FIXED.md` - Hızlı referans
- `QUICK_START.md` - Hızlı başlangıç rehberi

---

## [2.0.0] - 2025-10-10

### ✨ Eklenenler

#### Katmanlı Mimari

- Spring Framework tarzı katmanlı mimari yapısı
- `/server` klasörü altında organize edilmiş backend katmanları
- Entity, DTO, Mapper, Repository, Service katmanları
- Specification Pattern ile dinamik sorgu builder
- BaseError ve ExceptionMapper ile merkezi hata yönetimi

#### Entities & DTOs

- `BaseEntity` - Tüm entity'ler için temel sınıf
- `UserEntity`, `TransactionEntity` - Domain modelleri
- `BaseDTO` - Tüm DTO'lar için temel sınıf
- `UserDTO`, `TransactionDTO`, `CreateTransactionDTO` - Veri transfer objeleri

#### Repositories

- `BaseRepository<T>` - Generic CRUD operasyonları
- `UserRepository` - Kullanıcı veri erişimi
- `TransactionRepository` - İşlem veri erişimi

#### Services

- `BaseService<T>` - Generic iş mantığı
- `UserService` - Kullanıcı iş mantığı
- `TransactionService` - İşlem iş mantığı
- `AuthService` - Kimlik doğrulama servisi
- `SubscriptionService` - Abonelik yönetimi

#### Specifications

- `QueryBuilder<T>` - Fluent API ile dinamik sorgu oluşturma
- `BaseSpecification<T>` - Specification pattern implementasyonu
- `UserSpecifications` - Kullanıcı filtreleme spec'leri
- `TransactionSpecifications` - İşlem filtreleme spec'leri

#### Error Management

- `BaseError` - Temel hata sınıfı
- `HttpError` - HTTP hata tipleri (400, 401, 403, 404, 409, 422, 500)
- `BusinessError` - İş mantığı hataları
- `ExceptionMapper` - Merkezi hata dönüştürücü

#### Utils & Clients

- `Logger` - Merkezi loglama
- `Validator` - Validasyon utilities
- `DateHelper` - Tarih işlemleri
- `ClientConfig` - Dış servis yapılandırması
- `BaseHttpClient` - Retry mekanizmalı HTTP client

#### Enums

- `UserRole` - Kullanıcı rolleri
- `SubscriptionStatus` - Abonelik durumları
- `PlanId` - Plan tipleri

### 🔧 Değiştirileler

#### TypeScript & Tooling

- TypeScript strict mode aktif edildi
- ESLint kuralları sıkılaştırıldı
- Prettier yapılandırması eklendi
- Husky + lint-staged entegrasyonu
- Commitlint (Conventional Commits) eklendi

#### Authentication

- `lib/auth.ts` refactor edildi → `lib/auth-refactored.ts`
- JWT secret environment variable'a taşındı
- Session yönetimi iyileştirildi
- AuthService ile katmanlı yapıya geçildi

#### Database

- PostgreSQL bağlantı yapılandırması güncellendi
- Connection pooling eklendi (max 5)
- Prisma schema optimize edildi

### 📚 Dokümantasyon

- `ARCHITECTURE.md` - Detaylı mimari dokümantasyon
- `API.md` - API endpoint dokümantasyonu
- `README.md` - Güncellenmiş proje README
- `REFACTOR_REPORT.md` - Refactor süreci raporu
- `postman/README.md` - Postman collection rehberi
- `CHANGELOG.md` - Bu dosya

### 🗑️ Kaldırılanlar

- `next-auth` paketi kaldırıldı (custom auth kullanılıyor)
- `@emnapi/runtime` extraneous paketi kaldırıldı
- Eski `eslint.config.js` kaldırıldı (.eslintrc.json ile değiştirildi)

### 🔒 Güvenlik

- JWT_SECRET environment variable zorunlu hale getirildi
- Bcrypt rounds 12'ye ayarlandı
- Password hash güvenliği artırıldı
- Input sanitization iyileştirildi

### 🧪 Testing & Postman

- Postman collection eklendi (`postman/collection.json`)
- Environment dosyası eklendi (`postman/environment.json`)
- Vitest yapılandırması güncellendi
- Test infrastructure hazır

### 📦 Bağımlılıklar

#### Eklenenler

- `@commitlint/cli` ^18.4.3
- `@commitlint/config-conventional` ^18.4.3
- `eslint-config-prettier` ^9.1.0
- `husky` ^8.0.3
- `lint-staged` ^15.2.0
- `supertest` ^6.3.3

#### Kaldırılanlar

- `next-auth` (custom auth kullanılıyor)
- `@emnapi/runtime` (extraneous)

---

## [1.0.0] - 2024-XX-XX

### ✨ Eklenenler

- İlk versiyon
- Next.js 15 App Router
- Prisma ORM
- PostgreSQL veritabanı
- Temel CRUD operasyonları
- JWT Authentication
- Freemium iş modeli

---

## Versiyon Notasyonu

Format: MAJOR.MINOR.PATCH

- **MAJOR** - Uyumsuz API değişiklikleri
- **MINOR** - Geriye uyumlu yeni özellikler
- **PATCH** - Geriye uyumlu hata düzeltmeleri

Ek etiketler:

- `alpha` - Geliştirme aşaması
- `beta` - Test aşaması
- `rc` - Release candidate
