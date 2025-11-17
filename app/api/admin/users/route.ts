import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { ExceptionMapper } from '@/server/errors'
import { UserMapper } from '@/server/mappers/UserMapper'

// Kullanıcı listesi
export const GET = ExceptionMapper.asyncHandler(async (request: NextRequest) => {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.error
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const search = searchParams.get('search') || ''
  const role = searchParams.get('role') || ''
  const isActive = searchParams.get('isActive')

  const skip = (page - 1) * limit

  // Arama ve filtreleme koşulları
  const where: any = {}

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (role) {
    where.role = role
  }

  if (isActive !== null && isActive !== undefined) {
    where.isActive = isActive === 'true'
  }

  // Toplam sayfa sayısı için count
  const total = await prisma.user.count({ where })

  // Kullanıcıları getir
  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      subscriptions: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  // UserDTO'ya dönüştür
  const userDTOs = users.map(user => UserMapper.prismaToDTO(user))

  return NextResponse.json({
    success: true,
    data: {
      users: userDTOs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  })
})

// Kullanıcı güncelleme (role, isActive vb.)
export const PUT = ExceptionMapper.asyncHandler(async (request: NextRequest) => {
  const adminCheck = await requireAdmin(request)
  if (adminCheck.error) {
    return adminCheck.error
  }

  const body = await request.json()
  const { userId, role, isActive } = body

  if (!userId) {
    return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 })
  }

  const updateData: any = {}

  if (role !== undefined) {
    updateData.role = role
  }

  if (isActive !== undefined) {
    updateData.isActive = isActive
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    include: {
      subscriptions: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  const userDTO = UserMapper.prismaToDTO(updatedUser)

  return NextResponse.json({
    success: true,
    data: userDTO,
  })
})

