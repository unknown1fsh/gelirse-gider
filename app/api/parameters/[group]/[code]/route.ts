import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SystemParameterService } from '@/server/services/impl/SystemParameterService'
import { ExceptionMapper } from '@/server/errors'

// Bu endpoint belirli bir parametreyi getirir
// GET /api/parameters/BANK/ZIRAAT -> Ziraat Bankası parametresini getirir
export const GET = ExceptionMapper.asyncHandler(
  async (request: NextRequest, { params }: { params: { group: string; code: string } }) => {
    const parameterService = new SystemParameterService(prisma)
    const parameter = await parameterService.getByCode(params.group, params.code)

    return NextResponse.json({
      success: true,
      data: parameter,
    })
  }
)
