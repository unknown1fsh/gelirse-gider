import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { AuthService } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Oturum bulunamadı' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Güncellenebilir alanlar
    const allowedFields = [
      'name',
      'phone',
      'avatar',
      'timezone',
      'language',
      'currency',
      'dateFormat',
      'numberFormat',
      'theme',
      'notifications',
      'settings'
    ]

    const updateData: any = {}
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field]
      }
    }

    const result = await AuthService.updateUser(user.id, updateData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: result.user,
        message: 'Profil güncellendi'
      })
    }

    return NextResponse.json(
      { success: false, message: result.error || 'Güncelleme başarısız' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Update user API error:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
