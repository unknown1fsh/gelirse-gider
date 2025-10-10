// Bu sınıf yaygın validasyon işlemlerini sağlar.
export class Validator {
  // Bu metot e-posta adresini doğrular.
  // Girdi: E-posta string
  // Çıktı: Boolean (geçerli/geçersiz)
  // Hata: -
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Bu metot telefon numarasını doğrular.
  // Girdi: Telefon string
  // Çıktı: Boolean (geçerli/geçersiz)
  // Hata: -
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    return phoneRegex.test(phone)
  }

  // Bu metot şifre gücünü kontrol eder.
  // Girdi: Şifre string
  // Çıktı: Boolean (güçlü/zayıf)
  // Hata: -
  static isStrongPassword(password: string): boolean {
    return password.length >= 8
  }

  // Bu metot pozitif sayı kontrolü yapar.
  // Girdi: Sayı
  // Çıktı: Boolean (pozitif/negatif)
  // Hata: -
  static isPositiveNumber(value: number): boolean {
    return value > 0
  }

  // Bu metot boş string kontrolü yapar.
  // Girdi: String
  // Çıktı: Boolean (boş/dolu)
  // Hata: -
  static isEmpty(value: string): boolean {
    return !value || value.trim().length === 0
  }
}
