#!/bin/bash

# Railway Deployment Script
# Bu script Railway platformunda deployment için kullanılır

set -e

echo "🚀 Railway deployment başlatılıyor..."

# Environment variables kontrolü
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL environment variable tanımlı değil!"
  exit 1
fi

if [ -z "$NEXTAUTH_URL" ]; then
  echo "❌ NEXTAUTH_URL environment variable tanımlı değil!"
  exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "❌ NEXTAUTH_SECRET environment variable tanımlı değil!"
  exit 1
fi

# Prisma client generate
echo "📦 Prisma client oluşturuluyor..."
npx prisma generate

# Database migrations
echo "🗄️ Database migration'ları uygulanıyor..."
npx prisma migrate deploy

# Build
echo "🏗️ Production build başlatılıyor..."
npm run build

# Database seed (opsiyonel - sadece ilk deploy'da)
if [ "$SEED_DATABASE" = "true" ]; then
  echo "🌱 Database seed işlemi başlatılıyor..."
  npm run db:seed
fi

echo "✅ Deployment tamamlandı!"
echo "🚀 Uygulama başlatılıyor..."

# Start
npm start

