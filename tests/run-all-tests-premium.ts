import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script tüm API endpoint'lerini PREMIUM kullanıcı ile test eder.
async function main() {
  console.log('🧪 TÜM API ENDPOINT TESTLERİ (PREMIUM KULLANICI)\n')
  console.log('='.repeat(100))
  console.log()

  const baseUrl = 'http://localhost:3000/api'
  let passedTests = 0
  let failedTests = 0
  const results: Array<{ endpoint: string; method: string; status: number; ok: boolean }> = []

  // Premium test kullanıcısı oluştur
  console.log('1️⃣  Premium test kullanıcısı oluşturuluyor...')

  const testEmail = `test-premium-${Date.now()}@test.com`
  const testPassword = 'Test123456'
  let authToken = ''

  // Register
  try {
    const registerRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Premium Test User',
        email: testEmail,
        password: testPassword,
        plan: 'premium', // ✅ PREMIUM PLAN
      }),
    })

    if (registerRes.ok) {
      const registerData = await registerRes.json()
      console.log('   ✅ Register başarılı (Premium plan)')

      // Plan'ı premium yap
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      })

      if (user) {
        // Mevcut free subscription'ı iptal et
        await prisma.userSubscription.updateMany({
          where: {
            userId: user.id,
            status: 'active',
          },
          data: {
            status: 'cancelled',
          },
        })

        // Premium subscription oluştur
        await prisma.userSubscription.create({
          data: {
            userId: user.id,
            planId: 'premium',
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            amount: 99,
            currency: 'TRY',
          },
        })

        console.log('   ✅ Plan premium olarak ayarlandı')
      }

      passedTests++
    } else {
      console.log(`   ❌ Register başarısız (${registerRes.status})`)
      failedTests++
    }

    results.push({
      endpoint: '/auth/register',
      method: 'POST',
      status: registerRes.status,
      ok: registerRes.ok,
    })
  } catch (error) {
    console.log('   ❌ Register hata:', error)
    failedTests++
  }

  // Login
  try {
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    })

    if (loginRes.ok) {
      const loginData = await loginRes.json()
      authToken = loginData.session.token
      console.log('   ✅ Login başarılı (Premium token alındı)')
      passedTests++
    } else {
      console.log(`   ❌ Login başarısız (${loginRes.status})`)
      failedTests++
    }

    results.push({
      endpoint: '/auth/login',
      method: 'POST',
      status: loginRes.status,
      ok: loginRes.ok,
    })
  } catch (error) {
    console.log('   ❌ Login hata:', error)
    failedTests++
  }

  console.log()

  // Tüm endpoint'leri test et
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

  console.log("2️⃣  Tüm endpoint'leri test ediliyor (Premium token ile)...\n")

  for (const { path, method } of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          Cookie: `auth-token=${authToken}`,
        },
      })

      const testPassed = response.ok
      const icon = testPassed ? '✅' : '❌'
      console.log(`   ${icon} ${method} ${path} (${response.status})`)

      testPassed ? passedTests++ : failedTests++

      results.push({
        endpoint: path,
        method,
        status: response.status,
        ok: testPassed,
      })
    } catch (error) {
      console.log(`   ❌ ${method} ${path} hata`)
      failedTests++
    }
  }

  console.log()
  console.log('='.repeat(100))
  console.log()

  // Özet rapor
  console.log('📊 PREMIUM KULLANICI TEST SONUÇLARI:\n')
  console.log(`   ✅ Başarılı: ${passedTests}`)
  console.log(`   ❌ Başarısız: ${failedTests}`)
  console.log(`   📦 Toplam: ${passedTests + failedTests}`)
  console.log(
    `   📈 Başarı Oranı: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`
  )
  console.log()

  // Başarısız olanları listele
  const failed = results.filter(r => !r.ok)
  if (failed.length > 0) {
    console.log("⚠️  BAŞARISIZ ENDPOINT'LER:\n")
    failed.forEach(r => {
      console.log(`   ❌ ${r.method} ${r.endpoint} → HTTP ${r.status}`)
    })
    console.log()
  }

  // Temizlik
  await prisma.user.deleteMany({
    where: { email: testEmail },
  })

  console.log('✅ TEST TAMAMLANDI!\n')

  if (failedTests === 0) {
    console.log("🎉 TÜM ENDPOINT'LER ÇALIŞIYOR!\n")
  } else {
    console.log(`⚠️  ${failedTests} endpoint'te sorun var.\n`)
  }
}

main()
  .catch(e => {
    console.error('❌ Test hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
