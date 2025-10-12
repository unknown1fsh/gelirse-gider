import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Demo kullanıcıları ekleniyor...')

  // Demo kullanıcıları
  const demoUsers = [
    {
      email: 'demo@giderse.com',
      password: 'demo123',
      name: 'Premium Demo',
    },
    {
      email: 'free@giderse.com', 
      password: 'free123',
      name: 'Ücretsiz Demo',
    },
    {
      email: 'enterprise@giderse.com',
      password: 'enterprise123', 
      name: 'Kurumsal Demo',
    },
    {
      email: 'enterprise-premium@giderse.com',
      password: 'ultra123',
      name: 'Ultra Premium Demo',
    },
  ]

  for (const user of demoUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 12)
    
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        passwordHash: hashedPassword,
        name: user.name,
        emailVerified: true,
      },
      create: {
        email: user.email,
        passwordHash: hashedPassword,
        name: user.name,
        emailVerified: true,
      },
    })
    
    console.log(`✅ ${user.name} kullanıcısı eklendi: ${user.email}`)
  }

  console.log('🎉 Tüm demo kullanıcıları başarıyla eklendi!')
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })