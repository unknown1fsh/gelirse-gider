# GelirSE-Gider

Modern kişisel finans yönetim platformu

## Özellikler

- 📊 Dashboard ile anlık finansal durum
- 💰 Gelir ve gider takibi
- 🏦 Banka hesap yönetimi
- 💳 Kredi kartı limit takibi
- ⚡ Otomatik ödeme yönetimi
- 🥇 Altın ve döviz yatırım takibi
- 📈 Analiz ve raporlar
- 📄 PDF/Excel export

## Teknolojiler

- Next.js 15 (App Router)
- PostgreSQL + Prisma
- Tailwind CSS + shadcn/ui
- TypeScript
- React Hook Form + Zod

## Kurulum

### 1. Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

### 2. Proje Kurulumu

```bash
# Projeyi klonlayın
git clone https://github.com/unknown1fsh/gelirse-gider.git
cd gelirse-gider

# Bağımlılıkları yükleyin
npm install

# Ortam değişkenlerini ayarlayın
cp env.example .env.local
# .env.local dosyasını düzenleyip DATABASE_URL'i PostgreSQL bağlantı bilgilerinizle güncelleyin
```

### 3. Veritabanı Kurulumu

```bash
# PostgreSQL veritabanını oluşturun
createdb gelirse_gider

# Veritabanı şemasını oluşturun
npm run dev:db
```

### 4. Uygulamayı Başlatın

```bash
# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Kullanım

### İlk Kurulum Sonrası

1. Dashboard'a gidin: http://localhost:3000/dashboard
2. Demo veriler otomatik olarak yüklenir
3. Yeni işlem eklemek için "İşlemler" menüsünü kullanın

### Temel Özellikler

- **Dashboard**: Finansal durumunuzun genel görünümü
- **İşlemler**: Gelir ve gider işlemlerini ekleyin
- **Hesaplar**: Banka hesaplarınızı yönetin
- **Kredi Kartları**: Kart limitlerinizi takip edin
- **Otomatik Ödemeler**: Düzenli ödemelerinizi otomatikleştirin
- **Altın ve Ziynet**: Altın yatırımlarınızı takip edin
- **Analiz**: Finansal raporlarınızı görüntüleyin

## Veritabanı Şeması

Uygulama DB-first yaklaşımıyla tasarlanmıştır:

- **Referans Tablolar**: Para birimleri, bankalar, kategoriler, ödeme yöntemleri
- **Ana Tablolar**: Hesaplar, kredi kartları, işlemler, otomatik ödemeler
- **Fonksiyonlar**: Döviz dönüşümü, altın değerleme, portföy hesaplama
- **View'lar**: KPI'lar, yaklaşan ödemeler, kategori dağılımları

## API Endpoints

- `GET /api/dashboard` - Dashboard verileri
- `GET /api/transactions` - İşlem listesi
- `POST /api/transactions` - Yeni işlem ekleme
- `GET /api/accounts` - Hesap listesi
- `GET /api/cards` - Kredi kartı listesi
- `GET /api/reference-data` - Referans verileri

## Geliştirme

```bash
# Linting
npm run lint

# Formatting
npm run format

# Testing
npm run test

# E2E Testing
npm run e2e
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
