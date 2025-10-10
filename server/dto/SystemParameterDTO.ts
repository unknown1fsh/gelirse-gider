// Bu dosya sistem parametre DTO'larını tanımlar

export class SystemParameterDTO {
  id: number
  paramGroup: string
  paramCode: string
  paramValue: string
  displayName: string
  description?: string | null
  displayOrder: number
  metadata?: Record<string, any>
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  constructor(data: SystemParameterDTO) {
    this.id = data.id
    this.paramGroup = data.paramGroup
    this.paramCode = data.paramCode
    this.paramValue = data.paramValue
    this.displayName = data.displayName
    this.description = data.description
    this.displayOrder = data.displayOrder
    this.metadata = data.metadata
    this.isActive = data.isActive
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}

export class CreateSystemParameterDTO {
  paramGroup: string
  paramCode: string
  paramValue: string
  displayName: string
  description?: string
  displayOrder?: number
  metadata?: Record<string, any>
  isActive?: boolean

  constructor(data: CreateSystemParameterDTO) {
    this.paramGroup = data.paramGroup
    this.paramCode = data.paramCode
    this.paramValue = data.paramValue
    this.displayName = data.displayName
    this.description = data.description
    this.displayOrder = data.displayOrder || 0
    this.metadata = data.metadata
    this.isActive = data.isActive ?? true
  }
}

export class SystemParameterGroupDTO {
  group: string
  groupName: string
  parameters: SystemParameterDTO[]
  count: number

  constructor(data: SystemParameterGroupDTO) {
    this.group = data.group
    this.groupName = data.groupName
    this.parameters = data.parameters
    this.count = data.count
  }
}
