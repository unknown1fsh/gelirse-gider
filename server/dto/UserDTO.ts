import { BaseDTO } from './BaseDTO'

// Bu sınıf kullanıcı bilgilerini taşıyan DTO'yu tanımlar.
// Girdi: Kullanıcı bilgileri
// Çıktı: UserDTO instance
// Hata: -
export class UserDTO extends BaseDTO {
  id: number
  email: string
  name: string
  phone?: string
  avatar?: string
  plan: string
  isActive: boolean
  createdAt: Date
  lastLoginAt?: Date

  constructor(data: {
    id: number
    email: string
    name: string
    phone?: string
    avatar?: string
    plan: string
    isActive: boolean
    createdAt: Date
    lastLoginAt?: Date
  }) {
    super()
    this.id = data.id
    this.email = data.email
    this.name = data.name
    this.phone = data.phone
    this.avatar = data.avatar
    this.plan = data.plan
    this.isActive = data.isActive
    this.createdAt = data.createdAt
    this.lastLoginAt = data.lastLoginAt
  }
}

// Bu sınıf kullanıcı kayıt isteği DTO'sunu tanımlar.
// Girdi: Kayıt bilgileri
// Çıktı: RegisterUserDTO instance
// Hata: -
export class RegisterUserDTO {
  name: string
  email: string
  phone?: string
  password: string
  plan?: string

  constructor(data: {
    name: string
    email: string
    phone?: string
    password: string
    plan?: string
  }) {
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.password = data.password
    this.plan = data.plan
  }
}

// Bu sınıf kullanıcı giriş isteği DTO'sunu tanımlar.
// Girdi: Giriş bilgileri
// Çıktı: LoginUserDTO instance
// Hata: -
export class LoginUserDTO {
  email: string
  password: string

  constructor(data: { email: string; password: string }) {
    this.email = data.email
    this.password = data.password
  }
}

// Bu sınıf kullanıcı güncelleme isteği DTO'sunu tanımlar.
// Girdi: Güncellenecek bilgiler
// Çıktı: UpdateUserDTO instance
// Hata: -
export class UpdateUserDTO {
  name?: string
  phone?: string
  avatar?: string
  timezone?: string
  language?: string
  currency?: string
  dateFormat?: string
  numberFormat?: string
  theme?: string
  notifications?: Record<string, unknown>
  settings?: Record<string, unknown>

  constructor(data: {
    name?: string
    phone?: string
    avatar?: string
    timezone?: string
    language?: string
    currency?: string
    dateFormat?: string
    numberFormat?: string
    theme?: string
    notifications?: Record<string, unknown>
    settings?: Record<string, unknown>
  }) {
    this.name = data.name
    this.phone = data.phone
    this.avatar = data.avatar
    this.timezone = data.timezone
    this.language = data.language
    this.currency = data.currency
    this.dateFormat = data.dateFormat
    this.numberFormat = data.numberFormat
    this.theme = data.theme
    this.notifications = data.notifications
    this.settings = data.settings
  }
}
