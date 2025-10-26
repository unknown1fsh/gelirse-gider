# Production Deployment Checklist

Bu checklist Railway'e production deployment yaparken takip edilmesi gereken adımları içerir.

## Pre-Deployment

### Code Review

- [ ] Son kod değişiklikleri review edildi
- [ ] Test'ler başarılı
- [ ] Linter hataları temizlendi
- [ ] TypeScript compile başarılı
- [ ] Git history temiz (sensitive data yok)

### Environment Preparation

- [ ] Railway hesabı oluşturuldu
- [ ] GitHub repository bağlandı
- [ ] Branch stratejisi belirlendi (master/main)
- [ ] Railway projesi oluşturuldu

### Database Setup

- [ ] PostgreSQL/MySQL service eklendi
- [ ] Database URL alındı
- [ ] Connection test edildi
- [ ] Migration history temiz

### Configuration

- [ ] `railway.json` oluşturuldu
- [ ] `next.config.js` production için optimize edildi
- [ ] `package.json` scriptleri güncellendi
- [ ] Environment variables listesi hazır

## Deployment

### Build Configuration

- [ ] Build command doğrulu: `npm run build:railway`
- [ ] Start command doğrulu: `npm start`
- [ ] Health check endpoint hazır (`/api/health`)
- [ ] Port configuration (Railway otomatik)

### Environment Variables

- [ ] `DATABASE_URL` ayarlandı (otomatik)
- [ ] `NEXTAUTH_URL` ayarlandı (production URL)
- [ ] `NEXTAUTH_SECRET` oluşturuldu (güçlü secret)
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_APP_URL` ayarlandı
- [ ] Opsiyonel API keys eklendi

### Demo Kullanıcıları

- [ ] Demo seed script'leri kaldırıldı
- [ ] Demo API endpoint'leri kaldırıldı
- [ ] Login sayfasından demo bilgileri kaldırıldı
- [ ] Production seed sadece referans data içeriyor

## Database Operations

### Initial Setup

- [ ] Migration'lar çalıştırıldı: `prisma migrate deploy`
- [ ] Seed data yüklendi: `npm run db:seed`
- [ ] Reference tables doğrulandı
- [ ] Connection pooling test edildi

### Schema Verification

- [ ] Tüm tablolar oluşturuldu
- [ ] Indexes eklendi
- [ ] Foreign key constraints aktif
- [ ] Unique constraints aktif

## Build ve Deploy

### Build Process

- [ ] Build logs temiz (error yok)
- [ ] Build süresi makul (<5 dakika)
- [ ] Disk kullanımı kontrol edildi
- [ ] Dependencies güncel

### Deployment

- [ ] Railway otomatik deploy başladı
- [ ] Deployment başarılı
- [ ] Uygulama başladı ve çalışıyor
- [ ] Health check başarılı
- [ ] URL erişilebilir

## Post-Deployment

### Smoke Tests

- [ ] Ana sayfa yükleniyor (/landing)
- [ ] Login sayfası açılıyor (/auth/login)
- [ ] Register sayfası açılıyor (/auth/register)
- [ ] API endpoint'leri yanıt veriyor (/api/health)
- [ ] Static assets yükleniyor
- [ ] HTTPS aktif

### Functional Tests

- [ ] Yeni kullanıcı kaydı başarılı
- [ ] Login başarılı
- [ ] Dashboard yükleniyor
- [ ] Hesap oluşturma çalışıyor
- [ ] Transaction ekleme çalışıyor
- [ ] Period oluşturma çalışıyor

### Plan Bazlı Testler

- [ ] Free plan özellikleri çalışıyor
- [ ] Premium plan özellikleri çalışıyor
- [ ] Enterprise plan özellikleri çalışıyor
- [ ] Plan upgrade/downgrade çalışıyor

### Performance Tests

- [ ] Sayfa yükleme <3 saniye
- [ ] API response <500ms
- [ ] Database queries optimize
- [ ] Image optimization çalışıyor
- [ ] Caching çalışıyor

### Security Tests

- [ ] HTTPS enforced
- [ ] Security headers aktif
- [ ] CORS doğru yapılandırıldı
- [ ] SQL injection koruması
- [ ] XSS koruması
- [ ] JWT güvenliği
- [ ] Password hashing (bcrypt)
- [ ] Rate limiting (opsiyonel)

## Monitoring Setup

### Railway Monitoring

- [ ] CPU kullanımı normal
- [ ] Memory kullanımı normal
- [ ] Disk kullanımı normal
- [ ] Logs görünüyor
- [ ] Metrics toplanıyor

### Application Monitoring

- [ ] Error tracking (Sentry/LogRocket) kuruldu
- [ ] Performance monitoring aktif
- [ ] User activity tracking
- [ ] API request logs

## Documentation

### Developer Docs

- [ ] README.md güncel
- [ ] DEPLOYMENT.md oluşturuldu
- [ ] API.md güncel
- [ ] Architecture.md güncel

### Operations Docs

- [ ] Backup prosedürü dokümante edildi
- [ ] Rollback prosedürü hazır
- [ ] Scaling stratejisi dokümante edildi
- [ ] Emergency contacts

## Rollback Plan

### Preparation

- [ ] Önceki deployment ID not edildi
- [ ] Database backup alındı
- [ ] Environment variables backup'ı alındı
- [ ] Rollback scripti hazır

### If Needed

- [ ] Railway'de previous deployment seçilir
- [ ] Redeploy yapılır
- [ ] Health check tekrar çalıştırılır
- [ ] Database state kontrol edilir

## Post-Production

### Monitoring

- [ ] İlk 24 saat logs izleniyor
- [ ] Error rate normal
- [ ] Response time normal
- [ ] User signup'lar başarılı

### Performance

- [ ] Query performance optimize edildi
- [ ] Caching stratejisi aktif
- [ ] CDN (opsiyonel) kuruldu
- [ ] Image optimization aktif

### User Onboarding

- [ ] Email verification çalışıyor
- [ ] Welcome flow test edildi
- [ ] Onboarding UX test edildi
- [ ] Support channels aktif

## Maintenance Plan

### Daily

- [ ] Log monitoring
- [ ] Error tracking
- [ ] Resource usage check

### Weekly

- [ ] Performance metrics review
- [ ] User feedback review
- [ ] Security alerts check

### Monthly

- [ ] Dependency updates
- [ ] Security patches
- [ ] Database optimization
- [ ] Backups verification

## Success Criteria

- ✅ Zero-downtime deployment
- ✅ Tüm test'ler geçti
- ✅ Production URL erişilebilir
- ✅ Monitoring aktif
- ✅ Documentation tamamlandı
- ✅ Team onaylandı

## Notes

- Deployment süresi: ~15-20 dakika
- Rollback süresi: ~5 dakika
- İlk production URL: https://your-app.railway.app
- Database backup: Otomatik (Railway)
- SSL: Otomatik (Railway)

---

**Son Güncelleme:** 2025-01-XX
**Versiyon:** 2.1.1
**Platform:** Railway
**Database:** PostgreSQL
