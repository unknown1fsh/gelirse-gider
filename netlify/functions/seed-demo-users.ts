import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const handler = async (event: any) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Demo kullanıcıları başarıyla eklendi',
        users: results
      }),
    }

  } catch (error) {
    console.error('❌ Seed hatası:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Seed hatası',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }),
    }
  } finally {
    await prisma.$disconnect()
  }
}
