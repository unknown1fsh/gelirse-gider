import { NextResponse } from 'next/server'
import { BaseError } from './BaseError'
import { InternalServerError } from './HttpError'
import { Logger } from '../utils/Logger'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

// Bu sınıf hataları HTTP response'larına dönüştürür.
export class ExceptionMapper {
  // Bu metot hatayı HTTP response'a dönüştürür.
  // Girdi: Hata objesi
  // Çıktı: NextResponse
  // Hata: -
  static toHttpResponse(error: unknown): NextResponse {
    if (error instanceof BaseError) {
      return this.handleBaseError(error)
    }

    if (error instanceof ZodError) {
      return this.handleZodError(error)
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaError(error)
    }

    if (error instanceof Error) {
      return this.handleGenericError(error)
    }

    return this.handleUnknownError(error)
  }

  // Bu metot BaseError'ları işler.
  // Girdi: BaseError instance
  // Çıktı: NextResponse
  // Hata: -
  private static handleBaseError(error: BaseError): NextResponse {
    Logger.error(`[${error.errorCode}] ${error.message}`, error)

    return NextResponse.json(error.toJSON(), {
      status: error.statusCode,
    })
  }

  // Bu metot Zod validasyon hatalarını işler.
  // Girdi: ZodError instance
  // Çıktı: NextResponse
  // Hata: -
  private static handleZodError(error: ZodError): NextResponse {
    Logger.error('Validation error', error)

    const formattedErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }))

    return NextResponse.json(
      {
        error: 'Validasyon hatası',
        errorCode: 'VALIDATION_ERROR',
        statusCode: 422,
        details: formattedErrors,
      },
      { status: 422 }
    )
  }

  // Bu metot Prisma veritabanı hatalarını işler.
  // Girdi: Prisma hata instance
  // Çıktı: NextResponse
  // Hata: -
  private static handlePrismaError(error: Prisma.PrismaClientKnownRequestError): NextResponse {
    Logger.error(`Prisma error [${error.code}]`, error)

    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          {
            error: 'Bu kayıt zaten mevcut (unique constraint)',
            errorCode: 'DUPLICATE_ENTRY',
            statusCode: 409,
          },
          { status: 409 }
        )

      case 'P2025':
        return NextResponse.json(
          {
            error: 'Kayıt bulunamadı',
            errorCode: 'NOT_FOUND',
            statusCode: 404,
          },
          { status: 404 }
        )

      case 'P2003':
        return NextResponse.json(
          {
            error: 'İlişkili kayıt bulunamadı (foreign key constraint)',
            errorCode: 'FOREIGN_KEY_VIOLATION',
            statusCode: 400,
          },
          { status: 400 }
        )

      default:
        return NextResponse.json(
          {
            error: 'Veritabanı hatası',
            errorCode: 'DATABASE_ERROR',
            statusCode: 500,
          },
          { status: 500 }
        )
    }
  }

  // Bu metot genel Error objelerini işler.
  // Girdi: Error instance
  // Çıktı: NextResponse
  // Hata: -
  private static handleGenericError(error: Error): NextResponse {
    Logger.error('Unhandled error', error)

    const internalError = new InternalServerError(
      process.env.NODE_ENV === 'production' ? 'Sunucu hatası' : error.message
    )

    return NextResponse.json(internalError.toJSON(), {
      status: internalError.statusCode,
    })
  }

  // Bu metot bilinmeyen hataları işler.
  // Girdi: unknown tip hata
  // Çıktı: NextResponse
  // Hata: -
  private static handleUnknownError(error: unknown): NextResponse {
    Logger.error('Unknown error', error)

    const internalError = new InternalServerError()
    return NextResponse.json(internalError.toJSON(), {
      status: internalError.statusCode,
    })
  }

  // Bu metot async fonksiyonları wrap eder ve hataları yakalar.
  // Girdi: Async handler fonksiyonu
  // Çıktı: Wrap edilmiş fonksiyon
  // Hata: -
  static asyncHandler<T extends unknown[]>(
    fn: (...args: T) => Promise<NextResponse>
  ): (...args: T) => Promise<NextResponse> {
    return async (...args: T): Promise<NextResponse> => {
      try {
        return await fn(...args)
      } catch (error) {
        return this.toHttpResponse(error)
      }
    }
  }
}
