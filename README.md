# 💰 GelirseGider - Kişisel Finans Yönetim Sistemi

Modern, katmanlı mimari ile geliştirilmiş Next.js tabanlı kişisel finans yönetim uygulaması.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-336791)](https://www.postgresql.org/)

---

## 🌟 Özellikler

### 💳 Finans Yönetimi

- ✅ Gelir/Gider takibi
- ✅ Banka hesapları yönetimi
- ✅ Kredi kartı takibi
- ✅ Otomatik ödemeler
- ✅ Altın portföyü

### 📊 Analiz & Raporlama

- ✅ Nakit akışı analizi
- ✅ Kategori bazlı raporlar
- ✅ Trend analizi
- ✅ Excel/PDF export
- ✅ Grafik ve görselleştirme

### 🔐 Güvenlik

- ✅ JWT authentication
- ✅ Bcrypt password hashing
- ✅ Session yönetimi
- ✅ Role-based access control

### 📱 Abonelik Modeli

- ✅ Free plan (50 işlem/ay)
- ✅ Premium plan (sınırsız)
- ✅ Enterprise plan (çoklu kullanıcı)

---

## 🏗️ Mimari

Spring Framework tarzında **katmanlı mimari** kullanılmıştır:

```
Presentation Layer (Next.js Pages)
        ↓
API Layer (Route Handlers)
        ↓
Service Layer (Business Logic)
        ↓
Repository Layer (Data Access)
        ↓
Database Layer (PostgreSQL)
```

### Dizin Yapısı

```
/server
  /entities      → Domain modelleri
  /dto          → Data Transfer Objects
  /mappers      → Entity ↔ DTO dönüşümleri
  /repositories → Veritabanı erişimi
  /services     → İş mantığı
  /specs        → Specification pattern
  /enums        → Enum tanımları
  /errors       → Hata yönetimi
  /clients      → Dış servis client'ları
  /utils        → Yardımcı fonksiyonlar
```

Detaylı mimari dokümantasyon: [ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 🚀 Kurulum

### Gereksinimler

- Node.js 20+
- PostgreSQL 14+
- npm veya yarn

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/yourusername/gelirse-gider.git
cd gelirse-gider
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Environment Variables

`.env.local` dosyası oluşturun:

```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/gelirse_gider?schema=public&connection_limit=5"

# JWT
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"

# Node Environment
NODE_ENV="development"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Session
SESSION_DURATION_DAYS=30
```

### 4. Veritabanını Hazırlayın

```bash
# Prisma client oluştur
npx prisma generate

# Veritabanı şemasını push et
npx prisma db push

# Seed data ekle (opsiyonel)
npx tsx prisma/seed.ts
```

### 5. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

---

## 📜 Kullanılabilir Script'ler

```bash
# Geliştirme
npm run dev              # Geliştirme sunucusunu başlat
npm run dev:db           # Veritabanı migration + seed

# Build & Production
npm run build            # Production build
npm run start            # Production sunucusu

# Kod Kalitesi
npm run typecheck        # TypeScript kontrolü
npm run lint             # ESLint kontrolü
npm run lint:check       # Lint (fix olmadan)
npm run format           # Prettier formatla
npm run format:check     # Format kontrolü

# Test
npm run test             # Unit testler
npm run test:watch       # Watch mode
npm run e2e              # E2E testler

# Full Validation
npm run validate         # Tüm kontroller (type + lint + format + test)
```

---

## 🧪 Testing

### Unit Tests (Vitest)

```bash
npm run test
```

### E2E Tests (Playwright)

```bash
npm run e2e
```

---

## 📡 API Dokümantasyonu

API endpoint'leri için detaylı dokümantasyon: [API.md](docs/API.md)

### Postman Collection

```bash
# Postman collection'ı import edin
postman/collection.json
postman/environment.json
```

Detaylar: [Postman README](postman/README.md)

---

## 🗄️ Veritabanı Şeması

### Ana Tablolar

- `user` - Kullanıcılar
- `user_session` - Oturumlar
- `user_subscription` - Abonelikler
- `account` - Banka hesapları
- `credit_card` - Kredi kartları
- `transaction` - İşlemler
- `auto_payment` - Otomatik ödemeler
- `gold_item` - Altın portföyü

### Referans Tabloları

- `ref_currency` - Para birimleri
- `ref_bank` - Bankalar
- `ref_tx_type` - İşlem tipleri
- `ref_tx_category` - Kategoriler
- `ref_payment_method` - Ödeme yöntemleri

Schema dosyası: [prisma/schema.prisma](prisma/schema.prisma)

---

## 🎨 Teknoloji Stack

### Frontend

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Recharts** - Charts

### Backend

- **Next.js API Routes** - REST API
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **Zod** - Validation
- **JWT** - Authentication

### DevOps

- **ESLint** - Linting
- **Prettier** - Formatting
- **Husky** - Git hooks
- **Commitlint** - Commit standards
- **Vitest** - Testing

---

## 📋 Proje Yapısı

```
gelirse-gider/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── (dashboard)/    # Dashboard pages
│   └── ...
├── server/             # Backend katmanlı mimari
│   ├── entities/       # Domain models
│   ├── dto/           # DTOs
│   ├── repositories/  # Data access
│   ├── services/      # Business logic
│   └── ...
├── components/         # React components
├── lib/               # Shared utilities
├── prisma/            # Database schema
├── docs/              # Documentation
└── postman/           # API collection
```

---

## 🔐 Güvenlik

- ✅ JWT token authentication
- ✅ HttpOnly secure cookies
- ✅ Bcrypt password hashing (12 rounds)
- ✅ SQL injection koruması (Prisma)
- ✅ XSS koruması
- ✅ CSRF koruması (SameSite)
- ✅ Rate limiting
- ✅ Input validation (Zod)

---

## 🌍 Environment Variables

| Variable                | Açıklama                             | Default                   |
| ----------------------- | ------------------------------------ | ------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string         | -                         |
| `JWT_SECRET`            | JWT secret key (min 32 char)         | -                         |
| `NODE_ENV`              | Environment (development/production) | development               |
| `NEXT_PUBLIC_API_URL`   | API base URL                         | http://localhost:3000/api |
| `SESSION_DURATION_DAYS` | Session süresi (gün)                 | 30                        |

---

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Commit Formatı (Conventional Commits)

```
feat: Yeni özellik
fix: Hata düzeltme
docs: Dokümantasyon
style: Kod formatı
refactor: Refactoring
test: Test ekleme
chore: Diğer değişiklikler
```

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👨‍💻 Geliştirici

**GelirseGider Ekibi**

- Website: https://gelirse-gider.com
- Email: info@gelirse-gider.com

---

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

## 📚 Dokümantasyon

- [Mimari Dokümantasyon](docs/ARCHITECTURE.md)
- [API Dokümantasyon](docs/API.md)
- [Postman Collection](postman/README.md)
- [Refactor Raporu](REFACTOR_REPORT.md)

---

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**
