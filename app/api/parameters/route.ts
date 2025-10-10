import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SystemParameterService } from '@/server/services/impl/SystemParameterService'
import { ExceptionMapper } from '@/server/errors'

// Bu endpoint sistem parametrelerini yönetir
// GET: Tüm parametreleri veya belirli bir grubu getirir
export const GET = ExceptionMapper.asyncHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const group = searchParams.get('group')
  const onlyActive = searchParams.get('onlyActive') !== 'false'
  const grouped = searchParams.get('grouped') === 'true'

  const parameterService = new SystemParameterService(prisma)

  // Gruplu format istendi mi?
  if (grouped) {
    const groupedParameters = await parameterService.getGroupedParameters(onlyActive)
    return NextResponse.json({
      success: true,
      data: groupedParameters,
      count: groupedParameters.length,
    })
  }

  // Belirli bir grup istendi mi?
  if (group) {
    const parameters = await parameterService.getByGroup(group, onlyActive)
    return NextResponse.json({
      success: true,
      group,
      data: parameters,
      count: parameters.length,
    })
  }

  // Tüm parametreler
  const parameters = await parameterService.getAll(onlyActive)
  return NextResponse.json({
    success: true,
    data: parameters,
    count: parameters.length,
  })
})

// GET: Tüm grupları listele
export async function OPTIONS() {
  const parameterService = new SystemParameterService(prisma)
  const groups = await parameterService.getAllGroups()

  return NextResponse.json({
    success: true,
    groups,
    count: groups.length,
  })
}
