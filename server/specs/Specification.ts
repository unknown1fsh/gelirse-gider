// Bu interface Specification pattern için temel yapıyı tanımlar.
export interface Specification<T> {
  // Bu metot specification'ın karşılandığını kontrol eder.
  // Girdi: Entity instance
  // Çıktı: Boolean (karşılanıyor mu?)
  // Hata: -
  isSatisfiedBy(entity: T): boolean

  // Bu metot specification'ı Prisma where koşuluna çevirir.
  // Girdi: -
  // Çıktı: Prisma where koşulu
  // Hata: -
  toPrismaWhere(): Record<string, unknown>
}

// Bu soyut sınıf Specification implementasyonu için temel sağlar.
export abstract class BaseSpecification<T> implements Specification<T> {
  abstract isSatisfiedBy(entity: T): boolean
  abstract toPrismaWhere(): Record<string, unknown>

  // Bu metot iki specification'ı AND ile birleştirir.
  // Girdi: Diğer specification
  // Çıktı: Yeni CompositeSpecification
  // Hata: -
  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other)
  }

  // Bu metot iki specification'ı OR ile birleştirir.
  // Girdi: Diğer specification
  // Çıktı: Yeni CompositeSpecification
  // Hata: -
  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other)
  }

  // Bu metot specification'ı tersine çevirir (NOT).
  // Girdi: -
  // Çıktı: Yeni NotSpecification
  // Hata: -
  not(): Specification<T> {
    return new NotSpecification(this)
  }
}

// Bu sınıf AND operatörü ile birleştirilmiş specification'ı temsil eder.
class AndSpecification<T> extends BaseSpecification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {
    super()
  }

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity) && this.right.isSatisfiedBy(entity)
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      AND: [this.left.toPrismaWhere(), this.right.toPrismaWhere()],
    }
  }
}

// Bu sınıf OR operatörü ile birleştirilmiş specification'ı temsil eder.
class OrSpecification<T> extends BaseSpecification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {
    super()
  }

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity) || this.right.isSatisfiedBy(entity)
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      OR: [this.left.toPrismaWhere(), this.right.toPrismaWhere()],
    }
  }
}

// Bu sınıf NOT operatörü ile tersine çevrilmiş specification'ı temsil eder.
class NotSpecification<T> extends BaseSpecification<T> {
  constructor(private spec: Specification<T>) {
    super()
  }

  isSatisfiedBy(entity: T): boolean {
    return !this.spec.isSatisfiedBy(entity)
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      NOT: this.spec.toPrismaWhere(),
    }
  }
}
