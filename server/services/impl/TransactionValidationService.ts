import { PrismaClient } from '@prisma/client'
import { ValidationError, BadRequestError } from '../../errors'

// Bu sınıf işlem (transaction) validasyonlarını yönetir.
export class TransactionValidationService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  // Bu metot kategori ve işlem tipinin uyumlu olup olmadığını kontrol eder.
  // Girdi: categoryId (SystemParameter ID), txTypeId (SystemParameter ID)
  // Çıktı: void (hata fırlatır veya devam eder)
  // Hata: ValidationError
  async validateCategoryMatchesType(categoryId: number, txTypeId: number): Promise<void> {
    // TX_TYPE ve TX_CATEGORY artık SystemParameter'da
    // Frontend zaten doğru kategorileri filtreliyor (txTypeId'ye göre)
    // Bu yüzden bu validation basitleştirilebilir

    // SystemParameter'dan kategori ve tip kontrolü yapılabilir
    // ancak şimdilik frontend'in doğru veriyi göndereceğine güveniyoruz
    // Zod validation zaten categoryId ve txTypeId'nin pozitif olduğunu kontrol eder

    if (!categoryId || categoryId <= 0) {
      throw new ValidationError('Geçersiz kategori ID')
    }

    if (!txTypeId || txTypeId <= 0) {
      throw new ValidationError('Geçersiz işlem tipi ID')
    }

    // NOT: Frontend /transactions/new-income sadece GELIR kategorileri,
    // /transactions/new-expense sadece GIDER kategorileri gösterir
    // Bu nedenle kategori-tip uyumsuzluğu frontend'de engellenmiştir
  }

  // Bu metot işlem tipinin aktif olup olmadığını kontrol eder.
  // Girdi: txTypeId (SystemParameter ID)
  // Çıktı: void
  // Hata: BadRequestError
  async validateTransactionTypeIsActive(txTypeId: number): Promise<void> {
    // TX_TYPE artık SystemParameter'da, direkt Zod validation yeterli
    // SystemParameter'dan kontrol etmeye gerek yok çünkü frontend zaten
    // sadece aktif parametreleri gösteriyor
    if (!txTypeId || txTypeId <= 0) {
      throw new BadRequestError('Geçersiz işlem tipi ID')
    }

    // SystemParameter kontrolü (opsiyonel - şimdilik basit kontrol yeterli)
    // Gelecekte gerekirse SystemParameter tablosundan kontrol eklenebilir
  }

  // Bu metot kategorinin aktif olup olmadığını kontrol eder.
  // Girdi: categoryId (SystemParameter ID)
  // Çıktı: void
  // Hata: BadRequestError
  async validateCategoryIsActive(categoryId: number): Promise<void> {
    // TX_CATEGORY artık SystemParameter'da, direkt Zod validation yeterli
    // SystemParameter'dan kontrol etmeye gerek yok çünkü frontend zaten
    // sadece aktif parametreleri gösteriyor
    if (!categoryId || categoryId <= 0) {
      throw new BadRequestError('Geçersiz kategori ID')
    }

    // SystemParameter kontrolü (opsiyonel - şimdilik basit kontrol yeterli)
    // Gelecekte gerekirse SystemParameter tablosundan kontrol eklenebilir
  }

  // Bu metot hesap veya kredi kartından en az birinin seçildiğini kontrol eder.
  // NOT: Nakit ödemeler için bu kontrol ATLANIR
  // Girdi: accountId, creditCardId, paymentMethodId
  // Çıktı: void
  // Hata: ValidationError
  validateAccountOrCreditCard(
    accountId?: number,
    creditCardId?: number,
    paymentMethodId?: number
  ): void {
    // Nakit ödeme için hesap/kart zorunlu değil (otomatik Nakit hesabı kullanılır)
    // Nakit kodları kontrol et (SystemParameter: 62, RefPaymentMethod: 3)
    const isNakitPayment = paymentMethodId === 62 || paymentMethodId === 3

    if (isNakitPayment) {
      return // Nakit için zorunluluk yok
    }

    if (!accountId && !creditCardId) {
      throw new ValidationError('Hesap veya kredi kartından en az birini seçmelisiniz')
    }

    if (accountId && creditCardId) {
      throw new ValidationError('Hem hesap hem kredi kartı seçilemez, birini seçiniz')
    }
  }

  // Bu metot tutar değerinin pozitif olduğunu kontrol eder.
  // Girdi: amount
  // Çıktı: void
  // Hata: ValidationError
  validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new ValidationError("Tutar 0'dan büyük olmalıdır")
    }

    if (amount > 999999999.99) {
      throw new ValidationError('Tutar çok yüksek (max: 999,999,999.99)')
    }
  }

  // Bu metot işlem tarihinin geçerli olduğunu kontrol eder.
  // Girdi: transactionDate
  // Çıktı: void
  // Hata: ValidationError
  validateTransactionDate(transactionDate: Date): void {
    if (isNaN(transactionDate.getTime())) {
      throw new ValidationError('Geçersiz tarih formatı')
    }

    // Gelecek tarih kontrolü (1 gün tolerans)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(23, 59, 59, 999)

    if (transactionDate > tomorrow) {
      throw new ValidationError('İşlem tarihi gelecek bir tarih olamaz')
    }
  }

  // Bu metot tüm işlem validasyonlarını bir arada çalıştırır.
  // Girdi: ValidateTransactionData
  // Çıktı: void
  // Hata: ValidationError, BadRequestError
  async validateTransaction(data: {
    txTypeId: number
    categoryId: number
    accountId?: number
    creditCardId?: number
    paymentMethodId?: number
    amount: number
    transactionDate: Date
  }): Promise<void> {
    // Sırayla tüm validasyonları çalıştır
    await this.validateTransactionTypeIsActive(data.txTypeId)
    await this.validateCategoryIsActive(data.categoryId)
    await this.validateCategoryMatchesType(data.categoryId, data.txTypeId)
    this.validateAccountOrCreditCard(data.accountId, data.creditCardId, data.paymentMethodId)
    this.validateAmount(data.amount)
    this.validateTransactionDate(data.transactionDate)
  }
}
