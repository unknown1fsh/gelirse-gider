// Bu soyut sınıf tüm hata sınıfları için temel yapıyı sağlar.
// Girdi: Hata mesajı, HTTP status kodu, hata kodu
// Çıktı: BaseError instance
// Hata: -
export abstract class BaseError extends Error {
  public readonly statusCode: number
  public readonly errorCode: string
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number, errorCode: string, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.isOperational = isOperational

    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this)
  }

  // Bu metot hata nesnesini JSON formatına çevirir.
  // Girdi: -
  // Çıktı: JSON objesi
  // Hata: -
  toJSON(): Record<string, unknown> {
    return {
      error: this.message,
      errorCode: this.errorCode,
      statusCode: this.statusCode,
    }
  }
}
