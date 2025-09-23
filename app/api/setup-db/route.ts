import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // PostgreSQL şemasını oluştur
    const fs = require('fs')
    const path = require('path')
    const schemaPath = path.join(process.cwd(), 'db', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Şemayı çalıştır
    await prisma.$executeRawUnsafe(schema)
    
    return NextResponse.json({ message: 'Veritabanı şeması başarıyla oluşturuldu' })
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json(
      { error: 'Veritabanı kurulumu başarısız' },
      { status: 500 }
    )
  }
}

