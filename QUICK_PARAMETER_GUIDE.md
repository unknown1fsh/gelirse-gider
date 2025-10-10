# 🎛️ PARAMETRE SİSTEMİ HIZLI REHBERİ

## 🚀 HIZLI BAŞLANGIÇ

### API Kullanımı

```bash
# Tüm parametreleri getir
GET /api/reference-data

# Sadece bankaları getir
GET /api/parameters/BANK

# Sadece altın türlerini getir
GET /api/parameters/GOLD_TYPE

# Belirli bir bankayı getir
GET /api/parameters/BANK/ZIRAAT
```

---

## 📊 PAR AMETRE GRUPLARI

| Grup               | Endpoint                    | Sayı | Kullanıldığı Sayfa    |
| ------------------ | --------------------------- | ---- | --------------------- |
| **BANK**           | `/api/parameters/BANK`      | 21   | Hesap Ekle, Kart Ekle |
| **ACCOUNT_TYPE**   | `/api/reference-data`       | 4    | Hesap Ekle            |
| **GOLD_TYPE**      | `/api/parameters/GOLD_TYPE` | 13   | Altın Ekle            |
| **GOLD_PURITY**    | `/api/reference-data`       | 5    | Altın Ekle            |
| **TX_TYPE**        | `/api/reference-data`       | 2    | İşlem Ekle            |
| **TX_CATEGORY**    | `/api/reference-data`       | ~14  | İşlem Ekle            |
| **PAYMENT_METHOD** | `/api/reference-data`       | 5    | İşlem Ekle            |
| **CURRENCY**       | `/api/reference-data`       | 4    | Tüm formlar           |

---

## 💻 FRONTEND KULLANIMI

### 1. Banka Dropdown

```tsx
const [banks, setBanks] = useState([])

useEffect(() => {
  fetch('/api/reference-data')
    .then(res => res.json())
    .then(data => setBanks(data.banks))
}, [])

<select>
  <option value={0}>Banka seçiniz (21 banka)</option>
  {banks.map(bank => (
    <option key={bank.id} value={bank.id}>
      {bank.name} - {bank.bankCode}
    </option>
  ))}
</select>
```

### 2. Altın Türü Dropdown

```tsx
<select>
  <option value="">Altın türü seçin (13 tür)</option>
  {referenceData?.goldTypes.map(type => (
    <option key={type.id} value={type.id} title={type.description}>
      {type.name}
    </option>
  ))}
</select>
```

### 3. Altın Ayarı Dropdown

```tsx
<select>
  <option value="">Ayar seçin (5 ayar)</option>
  {referenceData?.goldPurities.map(purity => (
    <option key={purity.id} value={purity.id}>
      {purity.name} ({purity.purity} ayar)
    </option>
  ))}
</select>
```

### 4. Hesap Türü Dropdown

```tsx
<select>
  <option value={0}>Hesap türü seçiniz</option>
  {referenceData?.accountTypes.map(type => (
    <option key={type.id} value={type.id}>
      {type.name}
    </option>
  ))}
</select>
```

---

## 🏦 TÜRKİYE BANKALARı (21)

**Kamu:** Ziraat, Halkbank, VakıfBank  
**Özel:** Akbank, Garanti BBVA, İş Bankası, Yapı Kredi, Denizbank, QNB Finansbank, TEB, Şekerbank, Alternatifbank, Odeabank  
**Yabancı:** ING, HSBC, Citibank  
**Katılım:** Kuveyt Türk, Albaraka Türk, Türkiye Finans, Ziraat Katılım, Vakıf Katılım

---

## 💎 ALTIN TÜRLERİ (13)

**Takılar:** Bilezik, Kolye, Küpe, Yüzük, İmam Nikahlı, Set/Takım  
**Paralar:** Cumhuriyet (Tam), Yarım, Çeyrek, Reşat, Hamit  
**Külçe:** Altın Bar  
**Diğer:** Diğer Ziynet

---

## ⚖️ ALTIN AYARLARI (5)

- **24K** - Saf Altın (24 ayar)
- **22K** - Cumhuriyet Altını (22 ayar)
- **18K** - 750 milyem (18 ayar)
- **14K** - 585 milyem (14 ayar)
- **8K** - 333 milyem (8 ayar)

---

## 📋 GÜNCELLENMİŞ SAYFALAR

| Sayfa               | Parametre Kaynağı     | Durum          |
| ------------------- | --------------------- | -------------- |
| `transactions/new`  | `/api/reference-data` | ✅ Güncellendi |
| `accounts/new`      | `/api/reference-data` | ✅ Güncellendi |
| `gold/new`          | `/api/reference-data` | ✅ Güncellendi |
| `auto-payments/new` | `/api/reference-data` | ✅ Güncellendi |

---

## ✅ AVANTAJLAR

1. **Merkezi Yönetim** - Tüm parametreler tek API'den
2. **21 Türk Bankası** - Güncel ve eksiksiz liste
3. **13 Altın Türü** - Türkiye'de yaygın altın ve ziynet
4. **5 Altın Ayarı** - Standart ayarlar
5. **Dinamik** - Hardcoded değer yok
6. **Zengin Veri** - Icon, color, metadata

---

## 🎉 SONUÇ

✅ Tüm formlar parametre sisteminden veri çekiyor  
✅ 21 Türk Bankası kullanımda  
✅ 13 Altın Türü + 5 Ayar kullanımda  
✅ Hardcoded değerler kaldırıldı  
✅ Sistem production ready!

**Şimdi parametreler veritabanından yönetilebilir! 🚀**
