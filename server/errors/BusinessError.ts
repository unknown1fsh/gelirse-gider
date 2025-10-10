import { BaseError } from './BaseError'

// Bu sınıf iş kuralı hatalarını temsil eder.
export class BusinessRuleError extends BaseError {
  constructor(message: string, errorCode = 'BUSINESS_RULE_VIOLATION') {
    super(message, 400, errorCode)
  }
}

// Bu sınıf limit aşım hatalarını temsil eder.
export class LimitExceededError extends BaseError {
  constructor(
    message: string,
    public current: number,
    public limit: number,
    public limitType: string
  ) {
    super(message, 403, 'LIMIT_EXCEEDED')
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      current: this.current,
      limit: this.limit,
      limitType: this.limitType,
    }
  }
}

// Bu sınıf yetersiz bakiye hatalarını temsil eder.
export class InsufficientBalanceError extends BaseError {
  constructor(
    message = 'Yetersiz bakiye',
    public available: number,
    public required: number
  ) {
    super(message, 400, 'INSUFFICIENT_BALANCE')
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      available: this.available,
      required: this.required,
    }
  }
}
