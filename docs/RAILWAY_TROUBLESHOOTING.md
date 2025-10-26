# Railway Troubleshooting Guide

## 🔴 HIZLI ÇÖZÜM: 502 Bad Gateway

Railway dashboard → Project → Variables sekmesine gidin ve şunları ekleyin:

```bash
NEXTAUTH_URL=https://giderse-gelir.up.railway.app
NEXTAUTH_SECRET=your-32-character-secret-here-make-it-very-secure
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://giderse-gelir.up.railway.app
```

NEXTAUTH_SECRET oluşturmak için:

```bash
npm run generate:secret
```

**Sonra:** Deploy otomatik olarak tekrar başlayacak.

---

## 502 Bad Gateway Hatası Çözümü

### 1. Railway Dashboard'da Logları Kontrol

Railway dashboard → Your Project → Deployments → Latest deployment → View logs

**Kontrol edilecekler:**

- Build başarılı mı?
- Uygulama başlıyor mu?
- Environment variables doğru mu?
- Port ayarı doğru mu?

### 2. Common Issues ve Çözümleri

#### Issue 1: Environment Variables Eksik

**Belirti:** `DATABASE_URL` veya `NEXTAUTH_SECRET` bulunamıyor

**Çözüm:**
Railway dashboard → Variables sekmesinde:

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://giderse-gelir.up.railway.app
NEXTAUTH_SECRET=<32-karakter-secret>
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://giderse-gelir.up.railway.app
```

#### Issue 2: Migration Hatası

**Belirti:** Log'larda "migration failed" hatası

**Çözüm:**
Railway dashboard → Connect → Shell aç:

```bash
npx prisma migrate deploy
```

#### Issue 3: Port Ayarı

**Belirti:** Uygulama başlamıyor

**Çözüm:**
Railway otomatik olarak PORT environment variable'ı sağlar. Kodda kullanılmalı:

```typescript
// next.config.js veya server start'ta
const port = process.env.PORT || 3000
```

#### Issue 4: Database Connection

**Belirti:** Database bağlantı hatası

**Çözüm:**

1. PostgreSQL service ekli mi kontrol et
2. DATABASE_URL doğru mu kontrol et
3. Whitelist kontrolü yap (Railway otomatik handling)

### 3. Manuel Test Adımları

#### Step 1: Build Kontrolü

```bash
# Railway dashboard logs'da görünmeli:
✓ Build successful
✓ Prisma Client generated
✓ Next.js build completed
```

#### Step 2: Health Check

```bash
# Eğer uygulama başladıysa, bu endpoint çalışmalı:
curl https://giderse-gelir.up.railway.app/api/health
```

Response:

```json
{ "status": "ok", "timestamp": "...", "database": "connected" }
```

#### Step 3: Database Migration

```bash
# Railway Connect shell:
npx prisma migrate deploy
npm run db:seed
```

### 4. Emergency Reset

Eğer hiçbir şey çalışmıyorsa:

1. Railway dashboard → Project Settings → Delete Project
2. Yeni proje oluştur
3. PostgreSQL ekle
4. Environment variables ekle
5. GitHub repo'yu bağla
6. Deploy başlat

### 5. Debug Checklist

- [ ] PostgreSQL service added?
- [ ] DATABASE_URL environment variable set?
- [ ] NEXTAUTH_SECRET 32 characters?
- [ ] NEXTAUTH_URL matches Railway URL?
- [ ] NODE_ENV=production?
- [ ] Build successful in logs?
- [ ] Application started in logs?
- [ ] Health check endpoint working?

### 6. Logs Komutları

Railway CLI ile:

```bash
railway login
railway link
railway logs
railway logs --deployment <deployment-id>
railway shell  # Interactive shell
```

### 7. Health Check Endpoint

Eğer uygulama başladıysa bu çalışmalı:

```bash
GET https://giderse-gelir.up.railway.app/api/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-01-26T...",
  "database": "connected"
}
```

Eğer "disconnected" dönerse, DATABASE_URL yanlış veya database erişilemiyor.

### 8. Common Error Messages

| Error                    | Meaning         | Solution                           |
| ------------------------ | --------------- | ---------------------------------- |
| 502 Bad Gateway          | App not started | Check logs, environment variables  |
| Cannot find DATABASE_URL | Env var missing | Add DATABASE_URL in Railway        |
| Migration failed         | DB schema issue | Run `npx prisma migrate deploy`    |
| Port in use              | Port conflict   | Railway handles this automatically |

### 9. Get Help

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- Project GitHub Issues
