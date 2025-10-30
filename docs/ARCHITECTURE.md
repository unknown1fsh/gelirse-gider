# 🏛️ GiderseGelir - Mimari Dokümantasyon

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Teknoloji Stack](#teknoloji-stack)
3. [Katmanlı Mimari](#katmanlı-mimari)
4. [Dizin Yapısı](#dizin-yapısı)
5. [Tasarım Desenleri](#tasarım-desenleri)
6. [Veri Akışı](#veri-akışı)
7. [Güvenlik](#güvenlik)

---

## 🎯 Genel Bakış

GiderseGelir, Spring Framework tarzında **katmanlı mimari** prensiplerine göre tasarlanmış modern bir Next.js uygulamasıdır. Clean Code ve SOLID prensiplerini takip eder.

### Mimari Prensipleri

- **Separation of Concerns** - Her katman tek bir sorumluluğa sahiptir
- **Dependency Injection** - Bağımlılıklar constructor üzerinden enjekte edilir
- **Clean Code** - Okunabilir, sürdürülebilir kod yapısı
- **Type Safety** - TypeScript strict mode ile tam tip güvenliği

---

## 🛠️ Teknoloji Stack

### Frontend

- **Next.js 15** - React framework (App Router)
- **React 18** - UI library
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI components
- **Recharts** - Grafik ve görselleştirme

### Backend

- **Next.js API Routes** - REST API
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Veritabanı
- **Zod** - Runtime validation
- **JWT** - Authentication

### DevOps & Tools

- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit standardizasyonu
- **Vitest** - Unit testing

---

## 🏗️ Katmanlı Mimari

Proje, Spring Framework'teki katmanlı mimariye benzer şekilde organize edilmiştir:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Next.js Pages & Components)     │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│          API Route Layer            │
│       (Next.js API Handlers)        │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│          Service Layer              │
│      (Business Logic - impl/)       │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│        Repository Layer             │
│     (Data Access - Prisma)          │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│           Database Layer            │
│          (PostgreSQL)               │
└─────────────────────────────────────┘
```

### Katmanlar

#### 1. **Presentation Layer** (`/app`, `/components`)

- Kullanıcı arayüzü
- React bileşenleri
- Client-side state management

#### 2. **API Layer** (`/app/api`)

- HTTP endpoint'ler
- Request/Response handling
- Authentication middleware

#### 3. **Service Layer** (`/server/services/impl`)

- İş mantığı
- Business rules
- Orchestration

#### 4. **Repository Layer** (`/server/repositories`)

- Veritabanı erişimi
- CRUD operasyonları
- Query building

#### 5. **Database Layer**

- PostgreSQL
- Prisma ORM
- Schema migrations

---

## 📁 Dizin Yapısı

```
giderseGelir/
│
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard layout group
│   ├── (transactions)/          # Transactions layout group
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── transactions/       # Transaction endpoints
│   │   └── ...
│   └── globals.css             # Global styles
│
├── server/                      # Backend katmanlı mimari
│   ├── entities/               # Domain models
│   │   ├── BaseEntity.ts
│   │   ├── UserEntity.ts
│   │   └── TransactionEntity.ts
│   │
│   ├── dto/                    # Data Transfer Objects
│   │   ├── BaseDTO.ts
│   │   ├── UserDTO.ts
│   │   └── TransactionDTO.ts
│   │
│   ├── mappers/                # Entity <-> DTO mappers
│   │   ├── UserMapper.ts
│   │   └── TransactionMapper.ts
│   │
│   ├── repositories/           # Data access layer
│   │   ├── BaseRepository.ts
│   │   ├── UserRepository.ts
│   │   └── TransactionRepository.ts
│   │
│   ├── services/               # Business logic layer
│   │   ├── BaseService.ts
│   │   └── impl/
│   │       ├── UserService.ts
│   │       ├── TransactionService.ts
│   │       ├── AuthService.ts
│   │       └── SubscriptionService.ts
│   │
│   ├── specs/                  # Specification Pattern
│   │   ├── QueryBuilder.ts
│   │   ├── Specification.ts
│   │   ├── UserSpecifications.ts
│   │   └── TransactionSpecifications.ts
│   │
│   ├── enums/                  # Enumerations
│   │   ├── UserRole.ts
│   │   ├── SubscriptionStatus.ts
│   │   └── PlanId.ts
│   │
│   ├── errors/                 # Error handling
│   │   ├── BaseError.ts
│   │   ├── HttpError.ts
│   │   ├── BusinessError.ts
│   │   └── ExceptionMapper.ts
│   │
│   ├── clients/                # External service clients
│   │   ├── ClientConfig.ts
│   │   └── BaseHttpClient.ts
│   │
│   └── utils/                  # Utilities
│       ├── Logger.ts
│       ├── Validator.ts
│       └── DateHelper.ts
│
├── components/                  # React components
│   ├── ui/                     # UI components
│   └── ...
│
├── lib/                        # Shared libraries
│   ├── prisma.ts              # Prisma client
│   ├── auth-refactored.ts     # Auth utilities
│   ├── validators.ts          # Zod schemas
│   └── utils.ts               # Helper functions
│
├── prisma/                     # Prisma ORM
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md        # This file
│   └── API.md                 # API documentation
│
└── postman/                    # API testing
    ├── collection.json        # Postman collection
    └── environment.json       # Environment variables
```

---

## 🎨 Tasarım Desenleri

### 1. **Repository Pattern**

```typescript
// BaseRepository - Generic CRUD operasyonları
abstract class BaseRepository<T> {
  abstract findById(id: number): Promise<T | null>
  abstract findAll(): Promise<T[]>
  abstract create(data: Partial<T>): Promise<T>
  abstract update(id: number, data: Partial<T>): Promise<T>
  abstract delete(id: number): Promise<T>
}

// UserRepository - Kullanıcı specific operasyonlar
class UserRepository extends BaseRepository<User> {
  async findByEmail(email: string): Promise<User | null>
  async findByIdWithSubscriptions(id: number)
}
```

### 2. **Service Pattern**

```typescript
// Service katmanı iş mantığını kapsüller
class TransactionService {
  constructor(private prisma: PrismaClient) {
    this.transactionRepository = new TransactionRepository(prisma)
  }

  async create(data: CreateTransactionDTO) {
    // Business logic
    // Validation
    // Repository call
  }
}
```

### 3. **Specification Pattern**

```typescript
// Dinamik query building
const query = new QueryBuilder<Transaction>()
  .where('userId', userId)
  .range('transactionDate', startDate, endDate)
  .greaterThan('amount', 100)
  .sortDesc('transactionDate')
  .paginate(1, 20)
  .build()

// Veya Specification ile
const spec = new TransactionByUserSpecification(userId)
  .and(new TransactionDateRangeSpecification(startDate, endDate))
  .and(new TransactionMinAmountSpecification(100))

const prismaWhere = spec.toPrismaWhere()
```

### 4. **Mapper Pattern**

```typescript
// Entity <-> DTO dönüşümleri
class UserMapper {
  static toEntity(prismaUser: User): UserEntity
  static toDTO(entity: UserEntity, plan: string): UserDTO
  static prismaToDTO(prismaUser: User): UserDTO
}
```

### 5. **Exception Mapper Pattern**

```typescript
// Merkezi hata yönetimi
class ExceptionMapper {
  static toHttpResponse(error: unknown): NextResponse {
    if (error instanceof BaseError) return handleBaseError(error)
    if (error instanceof ZodError) return handleZodError(error)
    // ...
  }
}

// Async handler wrapper
const handler = ExceptionMapper.asyncHandler(async req => {
  // Hatalar otomatik yakalanır ve dönüştürülür
})
```

---

## 🔄 Veri Akışı

### Transaction Oluşturma Akışı

```
1. Client (React)
   ↓ POST /api/transactions
2. API Route Handler
   ↓ validate request
3. TransactionService
   ↓ business logic (limit check)
4. TransactionRepository
   ↓ Prisma query
5. PostgreSQL
   ↓ created record
6. TransactionMapper
   ↓ Entity -> DTO
7. API Response
   ↓ JSON
8. Client (React)
```

### Authentication Akışı

```
1. Client sends credentials
   ↓ POST /api/auth/login
2. AuthService.login()
   ↓ validate credentials
3. UserRepository.findByEmail()
   ↓ fetch user
4. bcrypt.compare()
   ↓ verify password
5. jwt.sign()
   ↓ generate token
6. Create UserSession
   ↓ save to DB
7. Return { user, session }
   ↓ set cookie
8. Client authenticated
```

---

## 🔐 Güvenlik

### Authentication & Authorization

- **JWT Tokens** - Stateless authentication
- **HttpOnly Cookies** - XSS koruması
- **Secure Flag** - Production'da HTTPS zorunlu
- **SameSite** - CSRF koruması

### Password Security

- **bcrypt** - 12 rounds hashing
- **Minimum 8 karakter** - Password policy
- **Salt** - Her şifre unique salt ile

### Database Security

- **Prisma ORM** - SQL injection koruması
- **Prepared Statements** - Parametreli sorgular
- **Connection Pooling** - Max 5 connection

### API Security

- **Rate Limiting** - TooManyRequestsError
- **Input Validation** - Zod schemas
- **Error Masking** - Production'da detay gizleme

### Environment Variables

```bash
# .env (GIT'e commit edilmez!)
DATABASE_URL="postgresql://..."
JWT_SECRET="minimum-32-characters"
NODE_ENV="production"
```

---

## 📊 Veritabanı Şeması

### Ana Tablolar

- **user** - Kullanıcılar
- **user_session** - Aktif oturumlar
- **user_subscription** - Abonelikler
- **account** - Banka hesapları
- **credit_card** - Kredi kartları
- **transaction** - İşlemler
- **auto_payment** - Otomatik ödemeler
- **gold_item** - Altın eşyaları

### Referans Tabloları

- **ref_currency** - Para birimleri
- **ref_account_type** - Hesap tipleri
- **ref_tx_type** - İşlem tipleri (Gelir/Gider)
- **ref_tx_category** - İşlem kategorileri
- **ref_payment_method** - Ödeme yöntemleri
- **ref_gold_type** - Altın tipleri
- **ref_gold_purity** - Altın ayarları
- **ref_bank** - Bankalar

---

## 🚀 Performans Optimizasyonları

### Database

- **Indexing** - Primary keys, unique constraints, foreign keys
- **Connection Pooling** - Max 5 concurrent connections
- **Query Optimization** - Include ile eager loading

### API

- **Response Caching** - Referans veriler için
- **Pagination** - Büyük data setleri için
- **Lazy Loading** - İlişkili veriler için

### Frontend

- **Code Splitting** - Next.js automatic
- **Image Optimization** - Next/Image
- **Memoization** - React.memo, useMemo

---

## 🧪 Test Stratejisi

### Unit Tests

- Service layer tests
- Repository tests
- Mapper tests
- Utility tests

### Integration Tests

- API endpoint tests
- Database integration
- Auth flow tests

### E2E Tests

- User scenarios
- Critical paths
- Payment flows

---

## 📝 Geliştirme Kuralları

### Kod Standartları

- TypeScript strict mode
- ESLint rules
- Prettier formatting
- Conventional commits

### Naming Conventions

- **PascalCase** - Classes, Types, Interfaces
- **camelCase** - Functions, variables
- **UPPER_SNAKE_CASE** - Constants, Enums
- **kebab-case** - Files, folders

### Commit Format

```
feat: Add transaction filtering
fix: Resolve authentication bug
docs: Update architecture docs
refactor: Clean up service layer
test: Add user service tests
```

---

## 🔄 CI/CD Pipeline

### Development

1. Code commit
2. Husky pre-commit hook
3. Lint & Format check
4. Type check
5. Unit tests

### Production

1. Build Next.js app
2. Run all tests
3. Database migration
4. Deploy to server
5. Health check

---

## 📚 Kaynaklar

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

**Son Güncelleme:** 10 Ekim 2025  
**Versiyon:** 2.0.0  
**Mimari:** Katmanlı (Layered Architecture)
