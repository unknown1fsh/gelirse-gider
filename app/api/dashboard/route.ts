import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Son 30 gün KPI'larını al
    const kpiData = await prisma.$queryRaw`
      SELECT 
        COALESCE(SUM(CASE WHEN tt.code = 'GELIR' THEN t.amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN tt.code = 'GIDER' THEN t.amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN tt.code = 'GELIR' THEN t.amount ELSE -t.amount END), 0) as net_amount,
        COUNT(CASE WHEN tt.code = 'GELIR' THEN 1 END) as income_count,
        COUNT(CASE WHEN tt.code = 'GIDER' THEN 1 END) as expense_count
      FROM transaction t
      JOIN ref_tx_type tt ON t.tx_type_id = tt.id
      WHERE t.transaction_date >= CURRENT_DATE - INTERVAL '30 days'
    `

    // Yaklaşan kart ödemeleri
    const upcomingPayments = await prisma.$queryRaw`
      SELECT 
        cc.id,
        cc.name,
        b.name as bank_name,
        cc.limit_amount,
        cc.available_limit,
        cc.due_day,
        CASE 
          WHEN EXTRACT(DAY FROM CURRENT_DATE) <= cc.due_day 
          THEN DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day' + INTERVAL '1 day' * cc.due_day
          ELSE DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '2 month' - INTERVAL '1 day' + INTERVAL '1 day' * cc.due_day
        END as next_due_date,
        (cc.limit_amount - cc.available_limit) as current_debt,
        ((cc.limit_amount - cc.available_limit) * cc.min_payment_percent / 100) as min_payment
      FROM credit_card cc
      JOIN ref_bank b ON cc.bank_id = b.id
      WHERE cc.active = true
    `

    // Kategori bazlı dağılım
    const categoryBreakdown = await prisma.$queryRaw`
      SELECT 
        tc.name as category_name,
        tt.name as tx_type_name,
        SUM(t.amount) as total_amount,
        COUNT(*) as transaction_count
      FROM transaction t
      JOIN ref_tx_category tc ON t.category_id = tc.id
      JOIN ref_tx_type tt ON t.tx_type_id = tt.id
      WHERE t.transaction_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY tc.name, tt.name, tc.id
      ORDER BY total_amount DESC
    `

    // BigInt değerlerini string'e çevir
    const kpi = kpiData[0] ? {
      total_income: kpiData[0].total_income?.toString() || '0',
      total_expense: kpiData[0].total_expense?.toString() || '0',
      net_amount: kpiData[0].net_amount?.toString() || '0',
      income_count: kpiData[0].income_count?.toString() || '0',
      expense_count: kpiData[0].expense_count?.toString() || '0'
    } : {
      total_income: '0',
      total_expense: '0',
      net_amount: '0',
      income_count: '0',
      expense_count: '0'
    }

    const payments = upcomingPayments.map((payment: any) => ({
      ...payment,
      limit_amount: payment.limit_amount?.toString() || '0',
      available_limit: payment.available_limit?.toString() || '0',
      current_debt: payment.current_debt?.toString() || '0',
      min_payment: payment.min_payment?.toString() || '0'
    }))

    const categories = categoryBreakdown.map((category: any) => ({
      ...category,
      total_amount: category.total_amount?.toString() || '0',
      transaction_count: category.transaction_count?.toString() || '0'
    }))

    return NextResponse.json({
      kpi,
      upcomingPayments: payments,
      categoryBreakdown: categories
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Dashboard verileri alınamadı' },
      { status: 500 }
    )
  }
}

