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

    // Premium kontrolü - Gelişmiş yatırım araçları sadece premium kullanıcılar için
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: user.id,
        status: 'active'
      },
      orderBy: { createdAt: 'desc' }
    })

    const currentPlan = subscription?.planId || 'free'
    
    if (currentPlan === 'free') {
      return NextResponse.json(
        { 
          error: 'Gelişmiş yatırım araçları Premium üyelik gerektirir. Premium plana geçerek tüm yatırım araçlarına erişebilirsiniz.',
          requiresPremium: true,
          feature: 'Gelişmiş Yatırım Araçları'
        },
        { status: 403 }
      )
    }

    // Kullanıcının yatırımlarını getir
    const investments = await prisma.investment.findMany({
      where: {
        userId: user.id
      },
      include: {
        investmentType: true,
        currency: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(investments)
  } catch (error) {
    console.error('Yatırımlar yüklenirken hata:', error)
    return NextResponse.json(
      { error: 'Yatırımlar yüklenirken hata oluştu' },
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

    // Premium kontrolü - Yatırım ekleme sadece premium kullanıcılar için
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: user.id,
        status: 'active'
      },
      orderBy: { createdAt: 'desc' }
    })

    const currentPlan = subscription?.planId || 'free'
    
    if (currentPlan === 'free') {
      return NextResponse.json(
        { 
          error: 'Yatırım ekleme özelliği Premium üyelik gerektirir. Premium plana geçerek yatırımlarınızı yönetebilirsiniz.',
          requiresPremium: true,
          feature: 'Yatırım Yönetimi'
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      type,
      name,
      symbol,
      quantity,
      purchasePrice,
      currentPrice,
      purchaseDate,
      description,
      category,
      riskLevel,
      currencyId
    } = body

    // Yatırım türünü kontrol et veya oluştur
    let investmentType = await prisma.investmentType.findFirst({
      where: { name: type }
    })

    if (!investmentType) {
      investmentType = await prisma.investmentType.create({
        data: {
          name: type,
          description: `${type} yatırım aracı`,
          riskLevel: riskLevel || 'medium'
        }
      })
    }

    // Yatırım oluştur
    const investment = await prisma.investment.create({
      data: {
        userId: user.id,
        investmentTypeId: investmentType.id,
        name,
        symbol,
        quantity: parseFloat(quantity),
        purchasePrice: parseFloat(purchasePrice),
        currentPrice: parseFloat(currentPrice),
        purchaseDate: new Date(purchaseDate),
        description,
        category,
        riskLevel: riskLevel || 'medium',
        currencyId: currencyId || 1, // Varsayılan TRY
        totalValue: parseFloat(quantity) * parseFloat(currentPrice),
        profitLoss: parseFloat(quantity) * (parseFloat(currentPrice) - parseFloat(purchasePrice)),
        profitLossPercentage: ((parseFloat(currentPrice) - parseFloat(purchasePrice)) / parseFloat(purchasePrice)) * 100
      },
      include: {
        investmentType: true,
        currency: true
      }
    })

    return NextResponse.json(investment, { status: 201 })
  } catch (error) {
    console.error('Yatırım oluşturulurken hata:', error)
    return NextResponse.json(
      { error: 'Yatırım oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}
