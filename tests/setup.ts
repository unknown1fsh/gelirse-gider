import { PrismaClient } from '@prisma/client'

// Bu dosya test öncesi setup işlemlerini yapar.
// Girdi: -
// Çıktı: Test environment hazır
// Hata: -

const prisma = new PrismaClient()

// Test veritabanı bağlantısını kontrol et
beforeAll(async () => {
  try {
    await prisma.$connect()
    console.log('✅ Test veritabanı bağlantısı başarılı')
  } catch (error) {
    console.error('❌ Test veritabanı bağlantı hatası:', error)
    throw error
  }
})

// Her test sonrası temizlik
afterEach(async () => {
  // Test kullanıcılarını temizle
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: 'test-',
      },
    },
  })
})

// Tüm testler bittikten sonra
afterAll(async () => {
  await prisma.$disconnect()
  console.log('✅ Test veritabanı bağlantısı kapatıldı')
})

export { prisma }
