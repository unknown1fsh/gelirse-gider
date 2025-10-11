# Period System Migration Guide

Bu migration, dönem bazlı sistem için gerekli tüm değişiklikleri içerir.

## Migration İçeriği

1. **Period Tablosu** - Yeni dönem yönetimi tablosu
2. **PeriodClosing Tablosu** - Dönem kapanış bilgileri
3. **PeriodTransfer Tablosu** - Dönemler arası transferler
4. **UserSession Güncelleme** - activePeriodId alanı eklendi
5. **Mevcut Tablolara periodId Ekleme** - Account, CreditCard, EWallet, Transaction, AutoPayment, GoldItem, Investment

## Migration Çalıştırma

```bash
# Migration oluştur ve uygula
npx prisma migrate dev --name add_period_system

# Prisma client'ı güncelle
npx prisma generate
```

## Post-Migration Script

Migration sonrası tüm mevcut kullanıcılar için varsayılan dönem oluşturulmalıdır:

```bash
# Mevcut verileri migration et
npm run migrate:periods
```

## Manuel Migration Adımları (Eğer gerekirse)

Eğer otomatik migration sorun yaşarsa:

1. Önce Period tablosunu oluştur
2. Her kullanıcı için varsayılan dönem oluştur (ALL_TIME)
3. Mevcut tablolara periodId alanını ekle
4. Tüm mevcut kayıtları varsayılan döneme ata
5. periodId'yi NOT NULL yap

## Rollback

Eğer geri almak gerekirse:

```bash
npx prisma migrate resolve --rolled-back add_period_system
```
