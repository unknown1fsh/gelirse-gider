// Bu sınıf işlem (transaction) işlemleri için yardımcı fonksiyonlar sağlar.
export class TransactionHelper {
  // Bu metot işlem tipinin GELIR olup olmadığını kontrol eder.
  // Girdi: İşlem tipi kodu
  // Çıktı: Boolean (gelir mi?)
  // Hata: -
  static isIncome(txTypeCode: string): boolean {
    return txTypeCode === 'GELIR'
  }

  // Bu metot işlem tipinin GIDER olup olmadığını kontrol eder.
  // Girdi: İşlem tipi kodu
  // Çıktı: Boolean (gider mi?)
  // Hata: -
  static isExpense(txTypeCode: string): boolean {
    return txTypeCode === 'GIDER'
  }

  // Bu metot tutarı işlem tipine göre signed value olarak döndürür.
  // Girdi: Tutar ve işlem tipi kodu
  // Çıktı: Number (gelir: +, gider: -)
  // Hata: -
  static getSignedAmount(amount: number, txTypeCode: string): number {
    return this.isIncome(txTypeCode) ? amount : -amount
  }

  // Bu metot işlem tipine göre renk kodu döndürür.
  // Girdi: İşlem tipi kodu
  // Çıktı: Renk kodu (hex)
  // Hata: -
  static getTypeColor(txTypeCode: string): string {
    return this.isIncome(txTypeCode) ? '#10b981' : '#ef4444'
  }

  // Bu metot işlem tipine göre icon adı döndürür.
  // Girdi: İşlem tipi kodu
  // Çıktı: Icon adı (lucide-react)
  // Hata: -
  static getTypeIcon(txTypeCode: string): string {
    return this.isIncome(txTypeCode) ? 'TrendingUp' : 'TrendingDown'
  }

  // Bu metot işlemleri gruplara ayırır (gelir/gider).
  // Girdi: İşlemler dizisi
  // Çıktı: { income: [], expense: [] }
  // Hata: -
  static groupByType(
    transactions: Array<{
      amount: number
      txType: { code: string }
    }>
  ): {
    income: typeof transactions
    expense: typeof transactions
  } {
    return transactions.reduce(
      (acc, tx) => {
        if (this.isIncome(tx.txType.code)) {
          acc.income.push(tx)
        } else {
          acc.expense.push(tx)
        }
        return acc
      },
      { income: [] as typeof transactions, expense: [] as typeof transactions }
    )
  }

  // Bu metot toplam gelir hesaplar.
  // Girdi: İşlemler dizisi
  // Çıktı: Toplam gelir
  // Hata: -
  static calculateTotalIncome(
    transactions: Array<{
      amount: number
      txType: { code: string }
    }>
  ): number {
    return transactions
      .filter(tx => this.isIncome(tx.txType.code))
      .reduce((sum, tx) => sum + Number(tx.amount), 0)
  }

  // Bu metot toplam gider hesaplar.
  // Girdi: İşlemler dizisi
  // Çıktı: Toplam gider
  // Hata: -
  static calculateTotalExpense(
    transactions: Array<{
      amount: number
      txType: { code: string }
    }>
  ): number {
    return transactions
      .filter(tx => this.isExpense(tx.txType.code))
      .reduce((sum, tx) => sum + Number(tx.amount), 0)
  }

  // Bu metot net bakiye hesaplar (gelir - gider).
  // Girdi: İşlemler dizisi
  // Çıktı: Net bakiye
  // Hata: -
  static calculateNetBalance(
    transactions: Array<{
      amount: number
      txType: { code: string }
    }>
  ): number {
    const income = this.calculateTotalIncome(transactions)
    const expense = this.calculateTotalExpense(transactions)
    return income - expense
  }
}
