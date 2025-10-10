import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script tüm API endpoint'lerini Enterprise Premium kullanıcı ile test eder.
async function main() {
  console.log('🧪 TÜM API ENDPOINT TESTLERİ (ENTERPRISE PREMIUM KULLANICI)\n')
  console.log('='.repeat(100))
  console.log()

  const baseUrl = 'http://localhost:3000/api'
  let passedTests = 0
  let failedTests = 0

  // Enterprise Premium test kullanıcısı oluştur
  console.log('1️⃣  Enterprise Premium test kullanıcısı oluşturuluyor...')

  const testEmail = `test-enterprise-premium-${Date.now()}@test.com`
  const testPassword = 'EnterprisePremium123456'
  let authToken = ''

  // Eski enterprise premium test kullanıcılarını temizle
  await prisma.user.deleteMany({
    where: {
      email: {
        startsWith: 'test-enterprise-premium-',
      },
    },
  })

  // Register
  const registerRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Enterprise Premium Test User',
      email: testEmail,
      password: testPassword,
    }),
  })

  if (!registerRes.ok) {
    console.error('   ❌ Register başarısız')
    process.exit(1)
  }

  console.log('   ✅ Register başarılı (Enterprise Premium plan)')

  // Kullanıcının planını ENTERPRISE_PREMIUM olarak ayarla
  const user = await prisma.user.findUnique({
    where: { email: testEmail },
  })

  if (!user) {
    console.error('   ❌ Kullanıcı bulunamadı')
    process.exit(1)
  }

  // Mevcut subscription'ı güncelle veya yeni oluştur
  await prisma.userSubscription.deleteMany({
    where: { userId: user.id },
  })

  await prisma.userSubscription.create({
    data: {
      userId: user.id,
      planId: 'enterprise_premium',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 yıl
      amount: 0, // Test için 0
      currency: 'TRY',
    },
  })

  console.log('   ✅ Plan enterprise_premium olarak ayarlandı')

  // Login
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  })

  if (!loginRes.ok) {
    console.error('   ❌ Login başarısız')
    process.exit(1)
  }

  const loginData = await loginRes.json()
  authToken = loginData.session.token
  console.log('   ✅ Login başarılı (Enterprise Premium token alındı)')
  console.log()

  // Test edilecek endpoint'ler
  const endpoints = [
    { path: '/auth/me', method: 'GET' },
    { path: '/reference-data', method: 'GET' },
    { path: '/accounts', method: 'GET' },
    { path: '/accounts/bank', method: 'GET' },
    { path: '/cards', method: 'GET' },
    { path: '/transactions', method: 'GET' },
    { path: '/dashboard', method: 'GET' },
    { path: '/analysis', method: 'GET' },
    { path: '/analysis/cashflow', method: 'GET' },
    { path: '/analysis/categories', method: 'GET' },
    { path: '/analysis/trends', method: 'GET' },
    { path: '/subscription/status', method: 'GET' },
    { path: '/subscription/plans', method: 'GET' },
    { path: '/gold', method: 'GET' },
    { path: '/investments', method: 'GET' },
    { path: '/auto-payments', method: 'GET' },
  ]

  console.log("2️⃣  Tüm endpoint'leri test ediliyor (Enterprise Premium token ile)...\n")

  for (const { path, method } of endpoints) {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          Cookie: `auth-token=${authToken}`,
        },
      })

      if (res.ok) {
        console.log(`   ✅ ${method} ${path} (${res.status})`)
        passedTests++
      } else {
        console.log(`   ❌ ${method} ${path} (${res.status})`)
        failedTests++
      }
    } catch (error) {
      console.log(`   ❌ ${method} ${path} (error)`)
      failedTests++
    }
  }

  console.log()
  console.log('='.repeat(100))
  console.log()
  console.log('📊 ENTERPRISE PREMIUM KULLANICI TEST SONUÇLARI:\n')
  console.log(`   ✅ Başarılı: ${passedTests}`)
  console.log(`   ❌ Başarısız: ${failedTests}`)
  console.log(`   📦 Toplam: ${passedTests + failedTests}`)
  console.log(
    `   📈 Başarı Oranı: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`
  )
  console.log()
  console.log('✅ TEST TAMAMLANDI!\n')

  if (failedTests === 0) {
    console.log("🎉 TÜM ENDPOINT'LER ÇALIŞIYOR!\n")
  } else {
    console.log(`⚠️  ${failedTests} endpoint'te sorun var.\n`)
  }

  await prisma.$disconnect()
}

main().catch(console.error)
