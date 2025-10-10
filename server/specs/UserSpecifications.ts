import { BaseSpecification } from './Specification'
import { UserEntity } from '../entities/UserEntity'

// Bu specification aktif kullanıcıları filtreler.
export class ActiveUserSpecification extends BaseSpecification<UserEntity> {
  isSatisfiedBy(entity: UserEntity): boolean {
    return entity.isActive === true
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      isActive: true,
    }
  }
}

// Bu specification e-posta doğrulanmış kullanıcıları filtreler.
export class EmailVerifiedSpecification extends BaseSpecification<UserEntity> {
  isSatisfiedBy(entity: UserEntity): boolean {
    return entity.emailVerified === true
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      emailVerified: true,
    }
  }
}

// Bu specification belirli bir dile sahip kullanıcıları filtreler.
export class UserLanguageSpecification extends BaseSpecification<UserEntity> {
  constructor(private language: string) {
    super()
  }

  isSatisfiedBy(entity: UserEntity): boolean {
    return entity.language === this.language
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      language: this.language,
    }
  }
}

// Bu specification e-posta adresine göre kullanıcı arar.
export class UserEmailSpecification extends BaseSpecification<UserEntity> {
  constructor(private email: string) {
    super()
  }

  isSatisfiedBy(entity: UserEntity): boolean {
    return entity.email.toLowerCase() === this.email.toLowerCase()
  }

  toPrismaWhere(): Record<string, unknown> {
    return {
      email: {
        equals: this.email,
        mode: 'insensitive',
      },
    }
  }
}
