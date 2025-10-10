import { BaseDTO } from './BaseDTO'

// Bu sınıf işlem bilgilerini taşıyan DTO'yu tanımlar.
// Girdi: İşlem bilgileri
// Çıktı: TransactionDTO instance
// Hata: -
export class TransactionDTO extends BaseDTO {
  id: number
  userId: number
  txTypeId: number
  categoryId: number
  paymentMethodId: number
  accountId?: number
  creditCardId?: number
  amount: number
  currencyId: number
  transactionDate: Date
  description?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date

  constructor(data: {
    id: number
    userId: number
    txTypeId: number
    categoryId: number
    paymentMethodId: number
    accountId?: number
    creditCardId?: number
    amount: number
    currencyId: number
    transactionDate: Date
    description?: string
    tags: string[]
    createdAt: Date
    updatedAt: Date
  }) {
    super()
    this.id = data.id
    this.userId = data.userId
    this.txTypeId = data.txTypeId
    this.categoryId = data.categoryId
    this.paymentMethodId = data.paymentMethodId
    this.accountId = data.accountId
    this.creditCardId = data.creditCardId
    this.amount = data.amount
    this.currencyId = data.currencyId
    this.transactionDate = data.transactionDate
    this.description = data.description
    this.tags = data.tags
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}

// Bu sınıf işlem oluşturma isteği DTO'sunu tanımlar.
// Girdi: Yeni işlem bilgileri
// Çıktı: CreateTransactionDTO instance
// Hata: -
export class CreateTransactionDTO {
  txTypeId: number
  categoryId: number
  paymentMethodId: number
  accountId?: number
  creditCardId?: number
  amount: number
  currencyId: number
  transactionDate: Date
  description?: string
  tags?: string[]

  constructor(data: {
    txTypeId: number
    categoryId: number
    paymentMethodId: number
    accountId?: number
    creditCardId?: number
    amount: number
    currencyId: number
    transactionDate: Date
    description?: string
    tags?: string[]
  }) {
    this.txTypeId = data.txTypeId
    this.categoryId = data.categoryId
    this.paymentMethodId = data.paymentMethodId
    this.accountId = data.accountId
    this.creditCardId = data.creditCardId
    this.amount = data.amount
    this.currencyId = data.currencyId
    this.transactionDate = data.transactionDate
    this.description = data.description
    this.tags = data.tags || []
  }
}
