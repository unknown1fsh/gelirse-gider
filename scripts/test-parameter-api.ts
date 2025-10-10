// Bu script parametre API'sini test eder
async function testAPI() {
  const baseUrl = 'http://localhost:3000/api'

  console.log('🧪 Parametre API Test Ediliyor...\n')

  try {
    // 1. Tüm parametreleri getir
    console.log('1️⃣  Tüm parametreleri getiriliyor...')
    const allRes = await fetch(`${baseUrl}/parameters`)
    if (allRes.ok) {
      const data = await allRes.json()
      console.log(`   ✅ Toplam ${data.count} parametre bulundu`)
    } else {
      console.log(`   ❌ Hata: ${allRes.status}`)
    }

    // 2. Gruplu parametreleri getir
    console.log('\n2️⃣  Gruplu parametreleri getiriliyor...')
    const groupedRes = await fetch(`${baseUrl}/parameters?grouped=true`)
    if (groupedRes.ok) {
      const data = await groupedRes.json()
      console.log(`   ✅ ${data.count} grup bulundu`)
      data.data.forEach((group: any) => {
        console.log(`      📁 ${group.groupName}: ${group.count} parametre`)
      })
    } else {
      console.log(`   ❌ Hata: ${groupedRes.status}`)
    }

    // 3. Sadece bankaları getir
    console.log('\n3️⃣  Sadece bankaları getiriliyor...')
    const banksRes = await fetch(`${baseUrl}/parameters/BANK`)
    if (banksRes.ok) {
      const data = await banksRes.json()
      console.log(`   ✅ ${data.count} banka bulundu`)
      console.log(
        `      İlk 5: ${data.data
          .slice(0, 5)
          .map((b: any) => b.displayName)
          .join(', ')}`
      )
    } else {
      console.log(`   ❌ Hata: ${banksRes.status}`)
    }

    // 4. Sadece altın türlerini getir
    console.log('\n4️⃣  Sadece altın türlerini getiriliyor...')
    const goldRes = await fetch(`${baseUrl}/parameters/GOLD_TYPE`)
    if (goldRes.ok) {
      const data = await goldRes.json()
      console.log(`   ✅ ${data.count} altın türü bulundu`)
      console.log(
        `      İlk 5: ${data.data
          .slice(0, 5)
          .map((g: any) => g.displayName)
          .join(', ')}`
      )
    } else {
      console.log(`   ❌ Hata: ${goldRes.status}`)
    }

    // 5. Reference data ile karşılaştır
    console.log("\n5️⃣  Reference data endpoint'i test ediliyor...")
    const refRes = await fetch(`${baseUrl}/reference-data`)
    if (refRes.ok) {
      const data = await refRes.json()
      console.log(`   ✅ Reference data başarılı`)
      console.log(`      Bankalar: ${data.banks.length}`)
      console.log(`      Altın Türleri: ${data.goldTypes.length}`)
      console.log(`      Altın Ayarları: ${data.goldPurities.length}`)
      console.log(`      Hesap Türleri: ${data.accountTypes.length}`)
      console.log(`      Meta: ${JSON.stringify(data._meta)}`)
    } else {
      console.log(`   ❌ Hata: ${refRes.status}`)
    }

    console.log('\n✅ API Testleri Tamamlandı!')
  } catch (error) {
    console.error('❌ Hata:', error)
  }
}

testAPI()
