import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Bu endpoint SystemParameter tablosunu doldurur
// SADECE GELİŞTİRME/TEST AMAÇLI - Production'da silinmeli!
export async function POST(_request: NextRequest) {
  try {
    // eslint-disable-next-line no-console
    console.log('🌱 SystemParameter seed başlatılıyor...')

    // TX_TYPE parametreleri
    const txTypes = [
      {
        paramGroup: 'TX_TYPE',
        paramCode: 'GELIR',
        paramValue: 'GELIR',
        displayName: 'Gelir',
        displayOrder: 1,
        isActive: true,
        metadata: { icon: 'TrendingUp', color: 'green' },
      },
      {
        paramGroup: 'TX_TYPE',
        paramCode: 'GIDER',
        paramValue: 'GIDER',
        displayName: 'Gider',
        displayOrder: 2,
        isActive: true,
        metadata: { icon: 'TrendingDown', color: 'red' },
      },
    ]

    // TX_CATEGORY parametreleri
    const categories = [
      // GELİR kategorileri
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'MAAS',
        paramValue: 'MAAS',
        displayName: 'Maaş',
        displayOrder: 1,
        isActive: true,
        metadata: {
          txTypeCode: 'GELIR',
          txTypeName: 'Gelir',
          icon: 'Briefcase',
          color: 'blue',
          isDefault: true,
        },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'FREELANCE',
        paramValue: 'FREELANCE',
        displayName: 'Freelance',
        displayOrder: 2,
        isActive: true,
        metadata: { txTypeCode: 'GELIR', txTypeName: 'Gelir', icon: 'Laptop', color: 'purple' },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'YATIRIM',
        paramValue: 'YATIRIM',
        displayName: 'Yatırım Geliri',
        displayOrder: 3,
        isActive: true,
        metadata: { txTypeCode: 'GELIR', txTypeName: 'Gelir', icon: 'TrendingUp', color: 'green' },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'KIRA_GELIRI',
        paramValue: 'KIRA_GELIRI',
        displayName: 'Kira Geliri',
        displayOrder: 4,
        isActive: true,
        metadata: { txTypeCode: 'GELIR', txTypeName: 'Gelir', icon: 'Home', color: 'orange' },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'HEDIYE',
        paramValue: 'HEDIYE',
        displayName: 'Hediye',
        displayOrder: 5,
        isActive: true,
        metadata: { txTypeCode: 'GELIR', txTypeName: 'Gelir', icon: 'Gift', color: 'pink' },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'DIGER_GELIR',
        paramValue: 'DIGER_GELIR',
        displayName: 'Diğer Gelir',
        displayOrder: 6,
        isActive: true,
        metadata: { txTypeCode: 'GELIR', txTypeName: 'Gelir', icon: 'DollarSign', color: 'gray' },
      },

      // GİDER kategorileri
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'MARKET',
        paramValue: 'MARKET',
        displayName: 'Market',
        displayOrder: 11,
        isActive: true,
        metadata: {
          txTypeCode: 'GIDER',
          txTypeName: 'Gider',
          icon: 'ShoppingCart',
          color: 'red',
          isDefault: true,
        },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'FATURA',
        paramValue: 'FATURA',
        displayName: 'Fatura',
        displayOrder: 12,
        isActive: true,
        metadata: { txTypeCode: 'GIDER', txTypeName: 'Gider', icon: 'FileText', color: 'yellow' },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'ULASIM',
        paramValue: 'ULASIM',
        displayName: 'Ulaşım',
        displayOrder: 13,
        isActive: true,
        metadata: { txTypeCode: 'GIDER', txTypeName: 'Gider', icon: 'Car', color: 'blue' },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'KIRA',
        paramValue: 'KIRA',
        displayName: 'Kira',
        displayOrder: 14,
        isActive: true,
        metadata: { txTypeCode: 'GIDER', txTypeName: 'Gider', icon: 'Home', color: 'purple' },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'SAGLIK',
        paramValue: 'SAGLIK',
        displayName: 'Sağlık',
        displayOrder: 15,
        isActive: true,
        metadata: { txTypeCode: 'GIDER', txTypeName: 'Gider', icon: 'Heart', color: 'red' },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'EGITIM',
        paramValue: 'EGITIM',
        displayName: 'Eğitim',
        displayOrder: 16,
        isActive: true,
        metadata: { txTypeCode: 'GIDER', txTypeName: 'Gider', icon: 'BookOpen', color: 'green' },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'EGLENCE',
        paramValue: 'EGLENCE',
        displayName: 'Eğlence',
        displayOrder: 17,
        isActive: true,
        metadata: { txTypeCode: 'GIDER', txTypeName: 'Gider', icon: 'Film', color: 'pink' },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'GIYIM',
        paramValue: 'GIYIM',
        displayName: 'Giyim',
        displayOrder: 18,
        isActive: true,
        metadata: { txTypeCode: 'GIDER', txTypeName: 'Gider', icon: 'Shirt', color: 'indigo' },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'RESTORAN',
        paramValue: 'RESTORAN',
        displayName: 'Restoran',
        displayOrder: 19,
        isActive: true,
        metadata: { txTypeCode: 'GIDER', txTypeName: 'Gider', icon: 'Utensils', color: 'orange' },
      },
      {
        paramGroup: 'TX_CATEGORY',
        paramCode: 'DIGER_GIDER',
        paramValue: 'DIGER_GIDER',
        displayName: 'Diğer Gider',
        displayOrder: 20,
        isActive: true,
        metadata: {
          txTypeCode: 'GIDER',
          txTypeName: 'Gider',
          icon: 'MoreHorizontal',
          color: 'gray',
        },
      },
    ]

    // PAYMENT_METHOD parametreleri
    const paymentMethods = [
      {
        paramGroup: 'PAYMENT_METHOD',
        paramCode: 'NAKIT',
        paramValue: 'NAKIT',
        displayName: 'Nakit',
        description: 'Nakit ödeme',
        displayOrder: 1,
        isActive: true,
      },
      {
        paramGroup: 'PAYMENT_METHOD',
        paramCode: 'BANKA_HAVALESI',
        paramValue: 'BANKA_HAVALESI',
        displayName: 'Banka Havalesi',
        description: 'Banka havalesi ile ödeme',
        displayOrder: 2,
        isActive: true,
      },
      {
        paramGroup: 'PAYMENT_METHOD',
        paramCode: 'KREDI_KARTI',
        paramValue: 'KREDI_KARTI',
        displayName: 'Kredi Kartı',
        description: 'Kredi kartı ile ödeme',
        displayOrder: 3,
        isActive: true,
      },
      {
        paramGroup: 'PAYMENT_METHOD',
        paramCode: 'BANKA_KARTI',
        paramValue: 'BANKA_KARTI',
        displayName: 'Banka Kartı',
        description: 'Banka kartı ile ödeme',
        displayOrder: 4,
        isActive: true,
      },
      {
        paramGroup: 'PAYMENT_METHOD',
        paramCode: 'HAVALE_EFT',
        paramValue: 'HAVALE_EFT',
        displayName: 'Havale/EFT',
        description: 'Havale veya EFT ile ödeme',
        displayOrder: 5,
        isActive: true,
      },
      {
        paramGroup: 'PAYMENT_METHOD',
        paramCode: 'E_CUZDAN',
        paramValue: 'E_CUZDAN',
        displayName: 'E-Cüzdan',
        description: 'Dijital cüzdan ile ödeme',
        displayOrder: 6,
        isActive: true,
      },
    ]

    // CURRENCY parametreleri
    const currencies = [
      {
        paramGroup: 'CURRENCY',
        paramCode: 'TRY',
        paramValue: 'TRY',
        displayName: 'Türk Lirası (TRY)',
        displayOrder: 1,
        isActive: true,
        metadata: { symbol: '₺' },
      },
      {
        paramGroup: 'CURRENCY',
        paramCode: 'USD',
        paramValue: 'USD',
        displayName: 'Amerikan Doları (USD)',
        displayOrder: 2,
        isActive: true,
        metadata: { symbol: '$' },
      },
      {
        paramGroup: 'CURRENCY',
        paramCode: 'EUR',
        paramValue: 'EUR',
        displayName: 'Euro (EUR)',
        displayOrder: 3,
        isActive: true,
        metadata: { symbol: '€' },
      },
      {
        paramGroup: 'CURRENCY',
        paramCode: 'GBP',
        paramValue: 'GBP',
        displayName: 'İngiliz Sterlini (GBP)',
        displayOrder: 4,
        isActive: true,
        metadata: { symbol: '£' },
      },
    ]

    // Tüm parametreleri birleştir
    const allParameters = [...txTypes, ...categories, ...paymentMethods, ...currencies]

    // Her parametreyi upsert et
    let created = 0
    let updated = 0

    for (const param of allParameters) {
      const existing = await prisma.systemParameter.findUnique({
        where: {
          paramGroup_paramCode: {
            paramGroup: param.paramGroup,
            paramCode: param.paramCode,
          },
        },
      })

      await prisma.systemParameter.upsert({
        where: {
          paramGroup_paramCode: {
            paramGroup: param.paramGroup,
            paramCode: param.paramCode,
          },
        },
        update: {
          paramValue: param.paramValue,
          displayName: param.displayName,
          description: param.description as string | null | undefined,
          displayOrder: param.displayOrder,
          isActive: param.isActive,
          metadata: (param.metadata || {}) as Record<string, unknown>,
        },
        create: {
          paramGroup: param.paramGroup,
          paramCode: param.paramCode,
          paramValue: param.paramValue,
          displayName: param.displayName,
          description: param.description as string | null | undefined,
          displayOrder: param.displayOrder,
          isActive: param.isActive,
          metadata: (param.metadata || {}) as Record<string, unknown>,
        },
      })

      if (existing) {
        updated++
      } else {
        created++
      }
    }

    // eslint-disable-next-line no-console
    console.log(
      `✅ SystemParameter seed tamamlandı: ${created} oluşturuldu, ${updated} güncellendi`
    )

    // Sonuçları kontrol et
    const counts = await prisma.systemParameter.groupBy({
      by: ['paramGroup'],
      _count: true,
    })

    return NextResponse.json({
      success: true,
      message: 'SystemParameter seed tamamlandı',
      stats: {
        created,
        updated,
        total: created + updated,
        groups: counts,
      },
    })
  } catch (error) {
    console.error('❌ SystemParameter seed hatası:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'SystemParameter seed hatası',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata',
      },
      { status: 500 }
    )
  }
}

// GET endpoint - mevcut durumu göster
export async function GET() {
  try {
    const counts = await prisma.systemParameter.groupBy({
      by: ['paramGroup'],
      _count: true,
    })

    const total = await prisma.systemParameter.count()

    return NextResponse.json({
      success: true,
      total,
      groups: counts,
    })
  } catch (error) {
    console.error('❌ SystemParameter kontrol hatası:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'SystemParameter kontrol hatası',
      },
      { status: 500 }
    )
  }
}
