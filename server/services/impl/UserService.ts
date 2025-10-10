import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { BaseService } from '../BaseService'
import { UserRepository } from '../../repositories/UserRepository'
import { UserMapper } from '../../mappers/UserMapper'
import { UserDTO, RegisterUserDTO, UpdateUserDTO } from '../../dto/UserDTO'

// Bu sınıf kullanıcı iş mantığını yönetir.
export class UserService extends BaseService<UserDTO> {
  private userRepository: UserRepository

  constructor(prisma: PrismaClient) {
    super()
    this.userRepository = new UserRepository(prisma)
  }

  // Bu metot ID'ye göre kullanıcı getirir.
  // Girdi: Kullanıcı ID'si
  // Çıktı: UserDTO veya null
  // Hata: NotFoundError
  async findById(id: number): Promise<UserDTO | null> {
    const user = await this.userRepository.findByIdWithSubscriptions(id)
    if (!user) {
      return null
    }
    return UserMapper.prismaToDTO(user)
  }

  // Bu metot e-posta ile kullanıcı getirir.
  // Girdi: E-posta adresi
  // Çıktı: UserDTO veya null
  // Hata: NotFoundError
  async findByEmail(email: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findByEmailWithSubscriptions(email)
    if (!user) {
      return null
    }
    return UserMapper.prismaToDTO(user)
  }

  // Bu metot tüm kullanıcıları getirir.
  // Girdi: -
  // Çıktı: UserDTO dizisi
  // Hata: -
  async findAll(): Promise<UserDTO[]> {
    const users = await this.userRepository.findAll()
    return users.map(user => UserMapper.prismaToDTO(user))
  }

  // Bu metot yeni kullanıcı kaydı oluşturur.
  // Girdi: RegisterUserDTO
  // Çıktı: UserDTO
  // Hata: ConflictError (e-posta zaten mevcut), ValidationError
  async create(data: RegisterUserDTO): Promise<UserDTO> {
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('Bu e-posta adresi zaten kullanılıyor')
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      emailVerified: false,
      phoneVerified: false,
      timezone: 'Europe/Istanbul',
      language: 'tr',
      currency: 'TRY',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: '1.234,56',
      theme: 'light',
      notifications: {},
      settings: {},
      isActive: true,
    })

    return UserMapper.prismaToDTO(user)
  }

  // Bu metot kullanıcı bilgilerini günceller.
  // Girdi: Kullanıcı ID'si ve UpdateUserDTO
  // Çıktı: Güncellenmiş UserDTO
  // Hata: NotFoundError
  async update(id: number, data: UpdateUserDTO): Promise<UserDTO> {
    const user = await this.userRepository.update(id, data as never)
    return UserMapper.prismaToDTO(user)
  }

  // Bu metot kullanıcıyı siler.
  // Girdi: Kullanıcı ID'si
  // Çıktı: Silinen UserDTO
  // Hata: NotFoundError
  async delete(id: number): Promise<UserDTO> {
    const user = await this.userRepository.delete(id)
    return UserMapper.prismaToDTO(user)
  }

  // Bu metot şifre doğrulama yapar.
  // Girdi: Kullanıcı ID'si ve şifre
  // Çıktı: Boolean (doğru/yanlış)
  // Hata: NotFoundError
  async verifyPassword(userId: number, password: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      return false
    }
    return bcrypt.compare(password, user.passwordHash)
  }

  // Bu metot şifre değiştirme işlemini yapar.
  // Girdi: Kullanıcı ID'si, mevcut şifre, yeni şifre
  // Çıktı: void
  // Hata: UnauthorizedError, NotFoundError
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const isValid = await this.verifyPassword(userId, currentPassword)
    if (!isValid) {
      throw new Error('Mevcut şifre yanlış')
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12)
    await this.userRepository.update(userId, { passwordHash: newPasswordHash } as never)
  }

  // Bu metot son giriş zamanını günceller.
  // Girdi: Kullanıcı ID'si
  // Çıktı: void
  // Hata: NotFoundError
  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.updateLastLogin(userId)
  }
}
