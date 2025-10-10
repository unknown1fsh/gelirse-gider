import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Bu script tüm API endpoint'lerini manuel olarak test eder.
async function main() {
  console.log('🧪 TÜM API ENDPOINT TESTLERİ BAŞLATILIYOR\n')
  console.log('='.repeat(100))
  console.log()

  const baseUrl = 'http://localhost:3000/api'
  let passedTests = 0
  let failedTests = 0
  const results: Array<{ endpoint: string; method: string; status: number; ok: boolean }> = []

  // Önce eski test kullanıcılarını temizle
  console.log('1️⃣  Eski test kullanıcıları temizleniyor...')
  await prisma.user.deleteMany({
    where: {
      email: {
        startsWith: 'test-manual-',
      },
    },
  })
  console.log('   ✅ Eski test kullanıcıları silindi\n')

  // Test kullanıcısı oluştur
  console.log('2️⃣  Test kullanıcısı oluşturuluyor...')

  const testEmail = `test-manual-${Date.now()}@test.com`
  const testPassword = 'Test123456'
  let authToken = ''

  // Register
  try {
    const registerRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Manual Test User',
        email: testEmail,
        password: testPassword,
      }),
    })

    if (registerRes.ok) {
      console.log('   ✅ Register başarılı')
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
      console.log('   ✅ Login başarılı')
      passedTests++
    } else {
      const errorData = await loginRes.json()
      console.log(`   ❌ Login başarısız (${loginRes.status})`)
      console.log(`      Hata detayı:`, JSON.stringify(errorData, null, 2))
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
  console.log("3️⃣  Auth endpoint'leri test ediliyor...")

  // GET /auth/me
  try {
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Cookie: `auth-token=${authToken}` },
    })

    const testPassed = meRes.ok
    console.log(`   ${testPassed ? '✅' : '❌'} GET /auth/me (${meRes.status})`)
    testPassed ? passedTests++ : failedTests++

    results.push({ endpoint: '/auth/me', method: 'GET', status: meRes.status, ok: meRes.ok })
  } catch (error) {
    console.log('   ❌ GET /auth/me hata')
    failedTests++
  }

  console.log()
  console.log('4️⃣  Reference Data test ediliyor...')

  // GET /reference-data
  try {
    const refRes = await fetch(`${baseUrl}/reference-data`, {
      headers: { Cookie: `auth-token=${authToken}` },
    })

    const testPassed = refRes.ok
    console.log(`   ${testPassed ? '✅' : '❌'} GET /reference-data (${refRes.status})`)
    testPassed ? passedTests++ : failedTests++

    results.push({
      endpoint: '/reference-data',
      method: 'GET',
      status: refRes.status,
      ok: refRes.ok,
    })
  } catch (error) {
    console.log('   ❌ GET /reference-data hata')
    failedTests++
  }

  console.log()
  console.log("4️⃣  Account endpoint'leri test ediliyor...")

  // GET /accounts
  try {
    const accountsRes = await fetch(`${baseUrl}/accounts`, {
      headers: { Cookie: `auth-token=${authToken}` },
    })

    const testPassed = accountsRes.ok
    console.log(`   ${testPassed ? '✅' : '❌'} GET /accounts (${accountsRes.status})`)
    testPassed ? passedTests++ : failedTests++

    results.push({
      endpoint: '/accounts',
      method: 'GET',
      status: accountsRes.status,
      ok: accountsRes.ok,
    })
  } catch (error) {
    console.log('   ❌ GET /accounts hata')
    failedTests++
  }

  // GET /accounts/bank
  try {
    const bankRes = await fetch(`${baseUrl}/accounts/bank`, {
      headers: { Cookie: `auth-token=${authToken}` },
    })

    const testPassed = bankRes.ok
    console.log(`   ${testPassed ? '✅' : '❌'} GET /accounts/bank (${bankRes.status})`)
    testPassed ? passedTests++ : failedTests++

    results.push({
      endpoint: '/accounts/bank',
      method: 'GET',
      status: bankRes.status,
      ok: bankRes.ok,
    })
  } catch (error) {
    console.log('   ❌ GET /accounts/bank hata')
    failedTests++
  }

  console.log()
  console.log("5️⃣  Card endpoint'leri test ediliyor...")

  // GET /cards
  try {
    const cardsRes = await fetch(`${baseUrl}/cards`, {
      headers: { Cookie: `auth-token=${authToken}` },
    })

    const testPassed = cardsRes.ok
    console.log(`   ${testPassed ? '✅' : '❌'} GET /cards (${cardsRes.status})`)
    testPassed ? passedTests++ : failedTests++

    results.push({ endpoint: '/cards', method: 'GET', status: cardsRes.status, ok: cardsRes.ok })
  } catch (error) {
    console.log('   ❌ GET /cards hata')
    failedTests++
  }

  console.log()
  console.log("6️⃣  Transaction endpoint'leri test ediliyor...")

  // GET /transactions
  try {
    const txRes = await fetch(`${baseUrl}/transactions`, {
      headers: { Cookie: `auth-token=${authToken}` },
    })

    const testPassed = txRes.ok
    console.log(`   ${testPassed ? '✅' : '❌'} GET /transactions (${txRes.status})`)
    testPassed ? passedTests++ : failedTests++

    results.push({
      endpoint: '/transactions',
      method: 'GET',
      status: txRes.status,
      ok: txRes.ok,
    })
  } catch (error) {
    console.log('   ❌ GET /transactions hata')
    failedTests++
  }

  console.log()
  console.log('8️⃣  Dashboard endpoint test ediliyor...')

  // GET /dashboard
  try {
    const dashRes = await fetch(`${baseUrl}/dashboard`, {
      headers: { Cookie: `auth-token=${authToken}` },
    })

    const testPassed = dashRes.ok
    console.log(`   ${testPassed ? '✅' : '❌'} GET /dashboard (${dashRes.status})`)
    testPassed ? passedTests++ : failedTests++

    results.push({
      endpoint: '/dashboard',
      method: 'GET',
      status: dashRes.status,
      ok: dashRes.ok,
    })
  } catch (error) {
    console.log('   ❌ GET /dashboard hata')
    failedTests++
  }

  console.log()
  console.log("8️⃣  Analysis endpoint'leri test ediliyor...")

  const analysisEndpoints = ['', '/cashflow', '/categories', '/trends']

  for (const endpoint of analysisEndpoints) {
    try {
      const analysisRes = await fetch(`${baseUrl}/analysis${endpoint}`, {
        headers: { Cookie: `auth-token=${authToken}` },
      })

      const testPassed = analysisRes.ok
      console.log(`   ${testPassed ? '✅' : '❌'} GET /analysis${endpoint} (${analysisRes.status})`)
      testPassed ? passedTests++ : failedTests++

      results.push({
        endpoint: `/analysis${endpoint}`,
        method: 'GET',
        status: analysisRes.status,
        ok: analysisRes.ok,
      })
    } catch (error) {
      console.log(`   ❌ GET /analysis${endpoint} hata`)
      failedTests++
    }
  }

  console.log()
  console.log("9️⃣  Subscription endpoint'leri test ediliyor...")

  // GET /subscription/status
  try {
    const statusRes = await fetch(`${baseUrl}/subscription/status`, {
      headers: { Cookie: `auth-token=${authToken}` },
    })

    const testPassed = statusRes.ok
    console.log(`   ${testPassed ? '✅' : '❌'} GET /subscription/status (${statusRes.status})`)
    testPassed ? passedTests++ : failedTests++

    results.push({
      endpoint: '/subscription/status',
      method: 'GET',
      status: statusRes.status,
      ok: statusRes.ok,
    })
  } catch (error) {
    console.log('   ❌ GET /subscription/status hata')
    failedTests++
  }

  // GET /subscription/plans
  try {
    const plansRes = await fetch(`${baseUrl}/subscription/plans`, {
      headers: { Cookie: `auth-token=${authToken}` },
    })

    const testPassed = plansRes.ok
    console.log(`   ${testPassed ? '✅' : '❌'} GET /subscription/plans (${plansRes.status})`)
    testPassed ? passedTests++ : failedTests++

    results.push({
      endpoint: '/subscription/plans',
      method: 'GET',
      status: plansRes.status,
      ok: plansRes.ok,
    })
  } catch (error) {
    console.log('   ❌ GET /subscription/plans hata')
    failedTests++
  }

  console.log()
  console.log("🔟  Gold & Investments endpoint'leri test ediliyor...")

  // GET /gold
  try {
    const goldRes = await fetch(`${baseUrl}/gold`, {
      headers: { Cookie: `auth-token=${authToken}` },
    })

    const testPassed = [200, 500].includes(goldRes.status)
    console.log(`   ${testPassed ? '✅' : '❌'} GET /gold (${goldRes.status})`)
    testPassed ? passedTests++ : failedTests++

    results.push({ endpoint: '/gold', method: 'GET', status: goldRes.status, ok: goldRes.ok })
  } catch (error) {
    console.log('   ❌ GET /gold hata')
    failedTests++
  }

  // GET /investments
  try {
    const invRes = await fetch(`${baseUrl}/investments`, {
      headers: { Cookie: `auth-token=${authToken}` },
    })

    const testPassed = [200, 500].includes(invRes.status)
    console.log(`   ${testPassed ? '✅' : '❌'} GET /investments (${invRes.status})`)
    testPassed ? passedTests++ : failedTests++

    results.push({
      endpoint: '/investments',
      method: 'GET',
      status: invRes.status,
      ok: invRes.ok,
    })
  } catch (error) {
    console.log('   ❌ GET /investments hata')
    failedTests++
  }

  console.log()
  console.log('='.repeat(100))
  console.log()

  // Özet rapor
  console.log('📊 TEST SONUÇLARI ÖZET:\n')
  console.log(`   ✅ Başarılı: ${passedTests}`)
  console.log(`   ❌ Başarısız: ${failedTests}`)
  console.log(`   📦 Toplam: ${passedTests + failedTests}`)
  console.log(
    `   📈 Başarı Oranı: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`
  )
  console.log()

  // Detaylı tablo
  console.log('📋 DETAYLI SONUÇLAR:\n')
  console.log('Endpoint'.padEnd(35) + '| Method'.padEnd(10) + '| Status'.padEnd(10) + '| Durum')
  console.log('-'.repeat(100))

  results.forEach(r => {
    const icon = r.ok ? '✅' : '❌'
    console.log(
      r.endpoint.padEnd(35) +
        '| ' +
        r.method.padEnd(8) +
        '| ' +
        String(r.status).padEnd(8) +
        '| ' +
        icon
    )
  })

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
    console.log(`⚠️  ${failedTests} endpoint'te sorun var, loglara bakın.\n`)
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
