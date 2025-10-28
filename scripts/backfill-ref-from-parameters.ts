/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'

interface SystemParamMeta {
  icon?: string
  color?: string
  isDefault?: boolean
  txTypeCode?: string
}

const prisma = new PrismaClient()

async function main(): Promise<void> {
  console.log('🔄 Backfill: SystemParameter -> Ref tablolari')

  // 1) TX_TYPE -> ref_tx_type
  const txTypes = await prisma.systemParameter.findMany({
    where: { paramGroup: 'TX_TYPE', isActive: true },
    orderBy: { displayOrder: 'asc' },
  })

  for (const t of txTypes) {
    const meta = (t.metadata ?? {}) as SystemParamMeta
    await prisma.refTxType.upsert({
      where: { code: t.paramCode },
      update: {
        name: t.displayName,
        icon: meta.icon ?? null,
        color: meta.color ?? null,
        active: t.isActive,
      },
      create: {
        code: t.paramCode,
        name: t.displayName,
        icon: meta.icon ?? null,
        color: meta.color ?? null,
        active: t.isActive,
      },
    })
  }
  console.log(`✅ ref_tx_type upsert: ${txTypes.length}`)

  // 2) TX_CATEGORY -> ref_tx_category (tx_type_id eşlemesi paramCode ile)
  const categories = await prisma.systemParameter.findMany({
    where: { paramGroup: 'TX_CATEGORY', isActive: true },
    orderBy: { displayOrder: 'asc' },
  })

  for (const c of categories) {
    const meta = (c.metadata ?? {}) as SystemParamMeta
    const txTypeCode = meta.txTypeCode
    if (!txTypeCode) {
      continue
    }

    const txType = await prisma.refTxType.findUnique({ where: { code: txTypeCode } })
    if (!txType) {
      continue
    }

    await prisma.refTxCategory.upsert({
      where: {
        txTypeId_code: { txTypeId: txType.id, code: c.paramCode },
      },
      update: {
        name: c.displayName,
        description: c.description ?? null,
        icon: meta.icon ?? null,
        color: meta.color ?? null,
        isDefault: Boolean(meta.isDefault),
        active: c.isActive,
      },
      create: {
        txTypeId: txType.id,
        code: c.paramCode,
        name: c.displayName,
        description: c.description ?? null,
        icon: meta.icon ?? null,
        color: meta.color ?? null,
        isDefault: Boolean(meta.isDefault),
        active: c.isActive,
      },
    })
  }
  console.log(`✅ ref_tx_category upsert: ${categories.length}`)

  // 3) PAYMENT_METHOD -> ref_payment_method
  const methods = await prisma.systemParameter.findMany({
    where: { paramGroup: 'PAYMENT_METHOD', isActive: true },
    orderBy: { displayOrder: 'asc' },
  })

  for (const m of methods) {
    await prisma.refPaymentMethod.upsert({
      where: { code: m.paramCode },
      update: {
        name: m.displayName,
        description: m.description ?? null,
        active: m.isActive,
      },
      create: {
        code: m.paramCode,
        name: m.displayName,
        description: m.description ?? null,
        active: m.isActive,
      },
    })
  }
  console.log(`✅ ref_payment_method upsert: ${methods.length}`)

  console.log('🎉 Backfill tamam')
}

void (async () => {
  try {
    await main()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
