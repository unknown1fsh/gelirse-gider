import { PrismaClient } from '@prisma/client'

// Bu soyut sınıf tüm repository'ler için temel CRUD operasyonlarını tanımlar.
// Girdi: -
// Çıktı: BaseRepository sınıfı
// Hata: -
export abstract class BaseRepository<T> {
  protected prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  // Bu metot ID'ye göre tek bir kayıt getirir.
  // Girdi: ID değeri
  // Çıktı: Bulunan kayıt veya null
  // Hata: Prisma hataları
  abstract findById(id: number): Promise<T | null>

  // Bu metot tüm kayıtları getirir.
  // Girdi: -
  // Çıktı: Tüm kayıtlar dizisi
  // Hata: Prisma hataları
  abstract findAll(): Promise<T[]>

  // Bu metot yeni bir kayıt oluşturur.
  // Girdi: Oluşturulacak veri
  // Çıktı: Oluşturulan kayıt
  // Hata: Prisma hataları
  abstract create(data: Partial<T>): Promise<T>

  // Bu metot mevcut bir kaydı günceller.
  // Girdi: ID ve güncellenecek veri
  // Çıktı: Güncellenmiş kayıt
  // Hata: Prisma hataları
  abstract update(id: number, data: Partial<T>): Promise<T>

  // Bu metot bir kaydı siler.
  // Girdi: ID değeri
  // Çıktı: Silinen kayıt
  // Hata: Prisma hataları
  abstract delete(id: number): Promise<T>
}
