/**
 * Demo Users Seed Script
 * Sadece demo kullanıcıları ve temel dönemlerini ekler
 */

/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Demo kullanıcıları ekleniyor...\n')

  // Demo kullanıcılar
  const demoUsers = [
    {
      email: 'demo@giderse.com',
      name: 'Premium Demo',
      phone: '+90 555 111 22 33',
      password: 'demo123',
      plan: 'premium',
    },
    {
      email: 'free@giderse.com',
      name: 'Free Demo',
      phone: '+90 555 222 33 44',
      password: 'free123',
      plan: 'free',
    },
    {
      email: 'enterprise@giderse.com',
      name: 'Enterprise Demo',
      phone: '+90 555 333 44 55',
      password: 'enterprise123',
      plan: 'enterprise',
    },
    {
      email: 'enterprise-premium@giderse.com',
      name: 'Ultra Premium Demo',
      phone: '+90 555 444 55 66',
      password: 'ultra123',
      plan: 'enterprise_premium',
    },
  ]

  for (const userData of demoUsers) {
    try {
      // Kullanıcı zaten var mı kontrol et
      const existing = await prisma.user.findUnique({
        where: { email: userData.email },
      })

      if (existing) {
        console.log(`⏭️  ${userData.email} zaten mevcut, atlanıyor...`)
        continue
      }

      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      // Kullanıcıyı oluştur
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          passwordHash: hashedPassword,
          isActive: true,
          lastLoginAt: new Date(),
        },
      })

      console.log(`✅ ${user.name} (${user.email}) oluşturuldu`)

      // Plan subscription oluştur
      const subscription = await prisma.userSubscription.create({
        data: {
          userId: user.id,
          planId: userData.plan,
          status: 'active',
          startDate: new Date(),
          endDate: new Date('2099-12-31'), // Demo için çok uzun tarih
          amount: 0,
          currency: 'TRY',
          autoRenew: true,
        },
      })

      console.log(`   💳 ${userData.plan} planı aktif edildi`)

      // Varsayılan dönem oluştur
      const period = await prisma.period.create({
        data: {
          userId: user.id,
          name: 'Tüm Zamanlar',
          periodType: 'CUSTOM',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2025-12-31'),
          isClosed: false,
          isActive: true,
          description: 'Otomatik oluşturulan varsayılan dönem',
        },
      })

      console.log(`   📅 Dönem oluşturuldu: ${period.name}`)
    } catch (error) {
      console.error(`❌ ${userData.email} eklenirken hata:`, error)
    }
  }

  console.log('\n🎉 Demo kullanıcıları başarıyla eklendi!')
  console.log('\n📋 Kullanıcılar:')
  console.log('   - demo@giderse.com / demo123 (Premium)')
  console.log('   - free@giderse.com / free123 (Free)')
  console.log('   - enterprise@giderse.com / enterprise123 (Enterprise)')
  console.log('   - enterprise-premium@giderse.com / ultra123 (Ultra Premium)')
}

main()
  .catch(e => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(() => {
    void prisma.$disconnect()
  })

