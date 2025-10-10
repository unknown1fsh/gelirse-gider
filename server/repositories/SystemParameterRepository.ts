import { PrismaClient, Prisma, SystemParameter } from '@prisma/client'

// Bu repository sistem parametrelerinin veritabanı işlemlerini yönetir
export class SystemParameterRepository {
  constructor(private prisma: PrismaClient) {}

  // Tüm parametreleri getir
  // Girdi: where (Prisma.SystemParameterWhereInput)
  // Çıktı: SystemParameter[]
  async findMany(where?: Prisma.SystemParameterWhereInput): Promise<SystemParameter[]> {
    return this.prisma.systemParameter.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { displayName: 'asc' }],
    })
  }

  // Belirli bir grup için tüm parametreleri getir
  // Girdi: paramGroup (string), onlyActive (boolean)
  // Çıktı: SystemParameter[]
  async findByGroup(paramGroup: string, onlyActive: boolean = true): Promise<SystemParameter[]> {
    const where: Prisma.SystemParameterWhereInput = {
      paramGroup,
      ...(onlyActive && { isActive: true }),
    }

    return this.prisma.systemParameter.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { displayName: 'asc' }],
    })
  }

  // Belirli bir parametreyi kod ile getir
  // Girdi: paramGroup (string), paramCode (string)
  // Çıktı: SystemParameter | null
  async findByCode(paramGroup: string, paramCode: string): Promise<SystemParameter | null> {
    return this.prisma.systemParameter.findUnique({
      where: {
        paramGroup_paramCode: {
          paramGroup,
          paramCode,
        },
      },
    })
  }

  // Tüm grupları listele
  // Girdi: onlyActive (boolean)
  // Çıktı: string[] (grup adları)
  async findAllGroups(onlyActive: boolean = true): Promise<string[]> {
    const result = await this.prisma.systemParameter.groupBy({
      by: ['paramGroup'],
      where: onlyActive ? { isActive: true } : undefined,
      _count: true,
    })

    return result.map(group => group.paramGroup)
  }

  // Parametre oluştur veya güncelle
  // Girdi: data (CreateSystemParameterInput)
  // Çıktı: SystemParameter
  async upsertParameter(
    paramGroup: string,
    paramCode: string,
    data: Prisma.SystemParameterCreateInput
  ): Promise<SystemParameter> {
    return this.prisma.systemParameter.upsert({
      where: {
        paramGroup_paramCode: {
          paramGroup,
          paramCode,
        },
      },
      update: data,
      create: data,
    })
  }
}
