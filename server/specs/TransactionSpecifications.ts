import { BaseSpecification } from './Specification'
import { TransactionEntity } from '../entities/TransactionEntity'

// Bu specification kullanıcı ID'sine göre işlemleri filtreler.
export class TransactionByUserSpecification extends BaseSpecification<TransactionEntity> {
  constructor(private userId: number) {
    super()
  }

  isSatisfiedBy(entity: TransactionEntity): boolean {
    return entity.userId === this.userId
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      userId: this.userId,
    }
  }
}

// Bu specification tarih aralığına göre işlemleri filtreler.
export class TransactionDateRangeSpecification extends BaseSpecification<TransactionEntity> {
  constructor(
    private startDate: Date,
    private endDate: Date
  ) {
    super()
  }

  isSatisfiedBy(entity: TransactionEntity): boolean {
    return entity.transactionDate >= this.startDate && entity.transactionDate <= this.endDate
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      transactionDate: {
        gte: this.startDate,
        lte: this.endDate,
      },
    }
  }
}

// Bu specification işlem türüne göre filtreler.
export class TransactionByTypeSpecification extends BaseSpecification<TransactionEntity> {
  constructor(private txTypeId: number) {
    super()
  }

  isSatisfiedBy(entity: TransactionEntity): boolean {
    return entity.txTypeId === this.txTypeId
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      txTypeId: this.txTypeId,
    }
  }
}

// Bu specification kategoriye göre işlemleri filtreler.
export class TransactionByCategorySpecification extends BaseSpecification<TransactionEntity> {
  constructor(private categoryId: number) {
    super()
  }

  isSatisfiedBy(entity: TransactionEntity): boolean {
    return entity.categoryId === this.categoryId
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      categoryId: this.categoryId,
    }
  }
}

// Bu specification minimum tutara göre işlemleri filtreler.
export class TransactionMinAmountSpecification extends BaseSpecification<TransactionEntity> {
  constructor(private minAmount: number) {
    super()
  }

  isSatisfiedBy(entity: TransactionEntity): boolean {
    return entity.amount >= this.minAmount
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      amount: {
        gte: this.minAmount,
      },
    }
  }
}

// Bu specification maksimum tutara göre işlemleri filtreler.
export class TransactionMaxAmountSpecification extends BaseSpecification<TransactionEntity> {
  constructor(private maxAmount: number) {
    super()
  }

  isSatisfiedBy(entity: TransactionEntity): boolean {
    return entity.amount <= this.maxAmount
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      amount: {
        lte: this.maxAmount,
      },
    }
  }
}
