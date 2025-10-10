// Bu sınıf tarih işlemlerinde yardımcı fonksiyonlar sağlar.
export class DateHelper {
  // Bu metot ayın ilk gününü döndürür.
  // Girdi: Opsiyonel tarih (default: bugün)
  // Çıktı: Ayın ilk günü
  // Hata: -
  static getFirstDayOfMonth(date?: Date): Date {
    const d = date || new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
  }

  // Bu metot ayın son gününü döndürür.
  // Girdi: Opsiyonel tarih (default: bugün)
  // Çıktı: Ayın son günü
  // Hata: -
  static getLastDayOfMonth(date?: Date): Date {
    const d = date || new Date()
    return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
  }

  // Bu metot iki tarih arasındaki gün farkını hesaplar.
  // Girdi: Başlangıç ve bitiş tarihleri
  // Çıktı: Gün farkı
  // Hata: -
  static getDaysDifference(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Bu metot tarihe gün ekler.
  // Girdi: Tarih ve eklenecek gün sayısı
  // Çıktı: Yeni tarih
  // Hata: -
  static addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  // Bu metot tarihi Türkçe formata çevirir.
  // Girdi: Tarih
  // Çıktı: Formatlanmış tarih string (DD/MM/YYYY)
  // Hata: -
  static formatToTurkish(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }
}
