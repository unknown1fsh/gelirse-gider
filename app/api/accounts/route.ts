import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Kullanıcı doğrulama
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 401 }
      )
    }

    // Tüm hesap türlerini paralel olarak çek
    const [accounts, creditCards, goldItems] = await Promise.all([
      prisma.account.findMany({
        include: {
          accountType: true,
          bank: true,
          currency: true
        },
        where: {
          userId: user.id,
          active: true
        },
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.creditCard.findMany({
        include: {
          bank: true,
          currency: true
        },
        where: {
          userId: user.id,
          active: true
        },
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.goldItem.findMany({
        include: {
          goldType: true,
          goldPurity: true
        },
        where: {
          userId: user.id
        },
        orderBy: {
          name: 'asc'
        }
      })
    ])

    // Tüm hesapları birleştir ve tip bilgisi ekle
    const allAccounts = [
      ...accounts.map(account => ({ ...account, accountType: 'bank', uniqueId: `bank_${account.id}` })),
      ...creditCards.map(card => ({ ...card, accountType: 'credit_card', uniqueId: `card_${card.id}` })),
      ...goldItems.map(gold => ({ ...gold, accountType: 'gold', uniqueId: `gold_${gold.id}` }))
    ]

    return NextResponse.json(allAccounts)
  } catch (error) {
    console.error('Accounts API error:', error)
    return NextResponse.json(
      { error: 'Hesaplar alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Kullanıcı doğrulama
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Hesap türüne göre farklı işlemler
    if (body.accountType === 'bank') {
      const account = await prisma.account.create({
        data: {
          userId: user.id,
          name: body.name,
          bankId: body.bankId,
          accountTypeId: body.accountTypeId,
          currencyId: body.currencyId,
          balance: body.balance || 0,
          accountNumber: body.accountNumber || null,
          iban: body.iban || null,
          active: true
        },
        include: {
          accountType: true,
          bank: true,
          currency: true
        }
      })
      return NextResponse.json(account, { status: 201 })
    }
    
    if (body.accountType === 'credit_card') {
      const creditCard = await prisma.creditCard.create({
        data: {
          userId: user.id,
          name: body.name,
          bankId: body.bankId,
          currencyId: body.currencyId,
          limitAmount: body.limitAmount || 0,
          availableLimit: body.limitAmount || 0,
          statementDay: 1, // Varsayılan hesap kesim günü
          dueDay: body.dueDay || 1,
          active: true
        },
        include: {
          bank: true,
          currency: true
        }
      })
      return NextResponse.json(creditCard, { status: 201 })
    }
    
    if (body.accountType === 'gold') {
      const goldItem = await prisma.goldItem.create({
        data: {
          userId: user.id,
          name: body.name,
          goldTypeId: body.goldTypeId,
          goldPurityId: body.goldPurityId,
          weightGrams: body.weight || 0,
          purchasePrice: body.purchasePrice || 0,
          purchaseDate: new Date(),
          currentValueTry: body.purchasePrice || 0, // Başlangıçta alış fiyatı ile aynı
          description: null
        }
      })
      return NextResponse.json(goldItem, { status: 201 })
    }

    return NextResponse.json(
      { error: 'Geçersiz hesap türü' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Account creation error:', error)
    return NextResponse.json(
      { error: 'Hesap oluşturulamadı' },
      { status: 500 }
    )
  }
}

