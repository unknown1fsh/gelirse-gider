// Bu sınıf merkezi loglama işlemlerini yönetir.
export class Logger {
  // Bu metot bilgi seviyesinde log kaydı oluşturur.
  // Girdi: Mesaj ve opsiyonel metadata
  // Çıktı: void
  // Hata: -
  static info(message: string, meta?: Record<string, unknown>): void {
    console.info(`[INFO] ${message}`, meta || '')
  }

  // Bu metot hata seviyesinde log kaydı oluşturur.
  // Girdi: Mesaj ve opsiyonel hata objesi
  // Çıktı: void
  // Hata: -
  static error(message: string, error?: Error | unknown): void {
    console.error(`[ERROR] ${message}`, error || '')
  }

  // Bu metot uyarı seviyesinde log kaydı oluşturur.
  // Girdi: Mesaj ve opsiyonel metadata
  // Çıktı: void
  // Hata: -
  static warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(`[WARN] ${message}`, meta || '')
  }

  // Bu metot debug seviyesinde log kaydı oluşturur.
  // Girdi: Mesaj ve opsiyonel metadata
  // Çıktı: void
  // Hata: -
  static debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, meta || '')
    }
  }
}
