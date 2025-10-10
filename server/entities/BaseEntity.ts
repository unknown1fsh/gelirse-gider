// Bu sınıf tüm entity'ler için temel alanları tanımlar.
// Girdi: -
// Çıktı: BaseEntity sınıfı
// Hata: -
export abstract class BaseEntity {
  id: number
  createdAt: Date
  updatedAt: Date

  constructor(id: number, createdAt: Date, updatedAt: Date) {
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
