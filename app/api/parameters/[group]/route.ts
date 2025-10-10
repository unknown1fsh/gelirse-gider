import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SystemParameterService } from '@/server/services/impl/SystemParameterService'
import { ExceptionMapper } from '@/server/errors'

// Bu endpoint belirli bir parametre grubunu getirir
// GET /api/parameters/BANK -> Banka parametrelerini getirir
export const GET = ExceptionMapper.asyncHandler(
  async (request: NextRequest, { params }: { params: { group: string } }) => {
    const { searchParams } = new URL(request.url)
    const onlyActive = searchParams.get('onlyActive') !== 'false'

    const parameterService = new SystemParameterService(prisma)
    const parameters = await parameterService.getByGroup(params.group, onlyActive)

    return NextResponse.json({
      success: true,
      group: params.group,
      data: parameters,
      count: parameters.length,
    })
  }
)
