// Bu soyut sınıf tüm servisler için temel iş mantığı operasyonlarını tanımlar.
// Girdi: -
// Çıktı: BaseService sınıfı
// Hata: -
export abstract class BaseService<T> {
  // Bu metot ID'ye göre tek bir kayıt getirir.
  // Girdi: ID değeri
  // Çıktı: Bulunan kayıt veya null
  // Hata: İş mantığı hataları
  abstract findById(id: number): Promise<T | null>

  // Bu metot tüm kayıtları getirir.
  // Girdi: -
  // Çıktı: Tüm kayıtlar dizisi
  // Hata: İş mantığı hataları
  abstract findAll(): Promise<T[]>

  // Bu metot yeni bir kayıt oluşturur.
  // Girdi: Oluşturulacak veri
  // Çıktı: Oluşturulan kayıt
  // Hata: İş mantığı hataları
  abstract create(data: unknown): Promise<T>

  // Bu metot mevcut bir kaydı günceller.
  // Girdi: ID ve güncellenecek veri
  // Çıktı: Güncellenmiş kayıt
  // Hata: İş mantığı hataları
  abstract update(id: number, data: unknown): Promise<T>

  // Bu metot bir kaydı siler.
  // Girdi: ID değeri
  // Çıktı: Silinen kayıt
  // Hata: İş mantığı hataları
  abstract delete(id: number): Promise<T>
}
