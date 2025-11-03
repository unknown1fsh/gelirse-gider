# GiderSE-Gelir

Modern ve kapsamlı finansal gelir-gider yönetim platformu.

## 🚀 Özellikler

- **Gelir-Gider Yönetimi**: Günlük finansal işlemlerinizi kolayca takip edin
- **Hesap Yönetimi**: Çoklu hesap desteği (bankalar, e-cüzdanlar, kredi kartları)
- **Periyod Yönetimi**: Yıl, ay veya özel dönemlere göre finans takibi
- **Analytics & Raporlar**: Detaylı finansal analiz ve görsel raporlar
- **Yatırım Takibi**: Hisse senetleri, crypto, altın ve daha fazlası
- **Otomatik Ödemeler**: Tekrarlayan giderlerinizi otomatik takip edin
- **Export**: Excel ve PDF formatında rapor export

## 🏗️ Teknoloji Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: JWT
- **UI**: Radix UI + Tailwind CSS
- **Charts**: Recharts
- **Export**: XLSX, React-PDF
- **Deployment**: Railway

## 📋 Gereksinimler

- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

## 🛠️ Kurulum

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/your-username/giderseGelir.git
cd giderseGelir
```

### 2. Dependencies Kurun

```bash
npm install
```

### 3. Environment Variables

`.env` dosyası oluşturun:

```bash
cp scripts/railway.env.example .env
```

Dosyayı düzenleyin:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/giderse_gelir"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 4. Database Kurulumu

```bash
# Migration'ları çalıştır
npx prisma migrate dev

# Seed data yükle
npm run db:seed
```

### 5. Development Server

```bash
npm run dev
```

Tarayıcıda http://localhost:3000 adresini açın.

## 🧪 Test

```bash
# Tüm testleri çalıştır
npm test

# API testleri
npm run test:api

# Coverage
npm run test:coverage
```

## 🚢 Deployment

### Railway Deployment

Detaylı deployment rehberi için: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

### Hızlı Başlangıç

1. Railway hesabı oluşturun
2. GitHub repository'yi bağlayın
3. PostgreSQL service ekleyin
4. Environment variables'ı ayarlayın
5. Deploy!

```bash
# Railway CLI ile
railway login
railway link
railway up
```

## 📚 Dokümantasyon

- [Deployment Guide](docs/DEPLOYMENT.md) - Railway deployment
- [Production Checklist](docs/PRODUCTION_CHECKLIST.md) - Pre-deployment checklist
- [API Documentation](docs/API.md) - API endpoints
- [Architecture](docs/ARCHITECTURE.md) - System architecture
- [Database](docs/DATABASE_ANALYSIS.md) - Database schema

## 🎯 Plan Yapısı

### Free Plan

- Temel gelir-gider takibi
- 1 hesap
- Temel raporlar

### Premium Plan

- Sınırsız hesap
- Gelişmiş analitik
- Yatırım takibi
- Otomatik ödemeler
- Export özellikleri

### Enterprise Plan

- Tüm Premium özellikler
- Multi-currency
- API access
- Özel raporlar
- Priority support

## 🔒 Güvenlik

- JWT authentication
- Bcrypt password hashing
- SQL injection koruması
- XSS koruması
- HTTPS enforcement
- Security headers

## 📊 Database Schema

Detaylı şema bilgisi için: `prisma/schema.prisma`

Ana modeller:

- User & Authentication
- Account, CreditCard, EWallet
- Transaction & Categories
- Investment & Gold
- Period Management
- Auto Payments

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- GitHub Issues: https://github.com/your-username/giderseGelir/issues
- Email: support@giderse.com

## 🙏 Teşekkürler

- Next.js team
- Prisma team
- Radix UI team
- Railway team

---

**Versiyon:** 2.1.2  
**Son Güncelleme:** 2025-01-26
