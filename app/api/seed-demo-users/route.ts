import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST() {
  try {
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

    const results = []

    for (const user of demoUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 12)
      
      const upsertResult = await prisma.user.upsert({
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
      
      results.push({
        email: user.email,
        name: user.name,
        id: upsertResult.id
      })
      
      console.log(`✅ ${user.name} kullanıcısı eklendi: ${user.email}`)
    }

    console.log('🎉 Tüm demo kullanıcıları başarıyla eklendi!')

    return NextResponse.json({
      success: true,
      message: 'Demo kullanıcıları başarıyla eklendi',
      users: results
    })

  } catch (error) {
    console.error('❌ Seed hatası:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Seed hatası',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
