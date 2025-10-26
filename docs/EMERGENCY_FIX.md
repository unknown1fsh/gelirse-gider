# 🔴 ACİL ÇÖZÜM: Railway Port Ayarı

## Sorun

- Railway Port 3000 bekliyor
- Next.js 8080'de çalışıyor
- Port uyumsuzluğu 502 Bad Gateway yapıyor

## Çözüm: Railway Dashboard'da Manuel Düzeltme

### Adım 1: Settings'e Git

Railway dashboard → Your Service → **Settings**

### Adım 2: Networking'i Aç

**Networking** sekmesine tıkla

### Adım 3: Port'u Değiştir

**Public Networking** bölümünde:

- Şu anki: `Port 3000`
- **Değiştir:** `Port 8080`

Veya manuel olarak:

1. "Edit" ikonuna tıkla
2. Port: `8080`
3. Save

### Adım 4: Redeploy

Settings → **Redeploy** butonuna bas

---

## Alternatif: Railway.json Düzelt

Bu dosya zaten commit edildi ama push edilemedi (PowerShell hatası).

**Manuel commit:**

```bash
git add railway.json
git commit -m "fix: Railway port to 3000"
git push origin master
```

**Veya Railway dashboard'dan:**

- Settings → Deploy
- Start Command: `npx prisma migrate deploy && node .next/standalone/server.js`
- Port env var otomatik kullanılır

---

## Son Kontrol

Deploy tamamlandıktan sonra:

```bash
curl https://giderse-gelir.up.railway.app/api/health
```

**Beklenen:** `{"status":"ok",...}`

**Hala 502:** Railway logs'u kontrol et
