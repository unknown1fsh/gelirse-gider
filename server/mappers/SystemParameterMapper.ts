import { SystemParameter } from '@prisma/client'
import { SystemParameterDTO } from '../dto/SystemParameterDTO'

// Bu mapper SystemParameter entity'sini DTO'ya dönüştürür
export class SystemParameterMapper {
  // Prisma entity'sini DTO'ya dönüştür
  // Girdi: SystemParameter (Prisma entity)
  // Çıktı: SystemParameterDTO
  static toDTO(entity: SystemParameter): SystemParameterDTO {
    return new SystemParameterDTO({
      id: entity.id,
      paramGroup: entity.paramGroup,
      paramCode: entity.paramCode,
      paramValue: entity.paramValue,
      displayName: entity.displayName,
      description: entity.description,
      displayOrder: entity.displayOrder,
      metadata: entity.metadata ? (entity.metadata as Record<string, any>) : undefined,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  // Birden fazla entity'yi DTO'ya dönüştür
  // Girdi: SystemParameter[] (Prisma entities)
  // Çıktı: SystemParameterDTO[]
  static toDTOArray(entities: SystemParameter[]): SystemParameterDTO[] {
    return entities.map(entity => this.toDTO(entity))
  }

  // Parametreleri gruplara göre düzenle
  // Girdi: SystemParameter[] (Prisma entities)
  // Çıktı: Map<string, SystemParameterDTO[]>
  static groupByParamGroup(entities: SystemParameter[]): Map<string, SystemParameterDTO[]> {
    const grouped = new Map<string, SystemParameterDTO[]>()

    entities.forEach(entity => {
      const dto = this.toDTO(entity)
      const group = entity.paramGroup

      if (!grouped.has(group)) {
        grouped.set(group, [])
      }

      grouped.get(group)!.push(dto)
    })

    return grouped
  }
}
