import { PrismaClient, Prisma } from '@prisma/client'
import { BaseService } from '../BaseService'
import { TransactionRepository } from '../../repositories/TransactionRepository'
import { TransactionMapper } from '../../mappers/TransactionMapper'
import { TransactionDTO, CreateTransactionDTO } from '../../dto/TransactionDTO'
import { TransactionValidationService } from './TransactionValidationService'
import { ValidationError } from '../../errors'

// Bu sınıf işlem (transaction) iş mantığını yönetir.
export class TransactionService extends BaseService<TransactionDTO> {
  private prisma: PrismaClient
  private transactionRepository: TransactionRepository
  private validationService: TransactionValidationService

  constructor(prisma: PrismaClient) {
    super()
    this.prisma = prisma
    this.transactionRepository = new TransactionRepository(prisma)
    this.validationService = new TransactionValidationService(prisma)
  }

  // Bu metot ID'ye göre işlem getirir.
  // Girdi: İşlem ID'si
  // Çıktı: TransactionDTO veya null
  // Hata: NotFoundError
  async findById(id: number): Promise<TransactionDTO | null> {
    const transaction = await this.transactionRepository.findById(id)
    if (!transaction) {
      return null
    }
    return TransactionMapper.prismaToDTO(transaction)
  }

  // Bu metot ID'ye göre işlemi ilişkili verilerle getirir.
  // Girdi: İşlem ID'si
  // Çıktı: İşlem ve ilişkili veriler veya null
  // Hata: NotFoundError
  async findByIdWithRelations(id: number) {
    return this.transactionRepository.findByIdWithRelations(id)
  }

  // Bu metot kullanıcıya ait işlemleri getirir.
  // Girdi: Kullanıcı ID'si ve opsiyonel limit
  // Çıktı: İşlemler dizisi
  // Hata: -
  async findByUserId(userId: number, limit?: number) {
    return this.transactionRepository.findByUserIdWithRelations(userId, limit)
  }

  // Bu metot tüm işlemleri getirir.
  // Girdi: -
  // Çıktı: TransactionDTO dizisi
  // Hata: -
  async findAll(): Promise<TransactionDTO[]> {
    const transactions = await this.transactionRepository.findAll()
    return transactions.map(tx => TransactionMapper.prismaToDTO(tx))
  }

  // Bu metot yeni işlem oluşturur.
  // Girdi: CreateTransactionDTO ve kullanıcı ID'si
  // Çıktı: Oluşturulan işlem
  // Hata: ValidationError, BusinessRuleError
  async create(data: CreateTransactionDTO & { userId: number }) {
    // ✅ ÖNEMLİ: Tüm validasyonları çalıştır
    await this.validationService.validateTransaction({
      txTypeId: data.txTypeId,
      categoryId: data.categoryId,
      accountId: data.accountId,
      creditCardId: data.creditCardId,
      eWalletId: (data as any).eWalletId,
      beneficiaryId: (data as any).beneficiaryId,
      paymentMethodId: data.paymentMethodId,
      amount: data.amount,
      transactionDate: data.transactionDate,
    })

    // SystemParameter ID'lerini Ref tablo ID'lerine map et
    // Frontend SystemParameter gönderiyor ama Transaction tablosu Ref tablolarına bağlı
    const [refTxTypeId, refCategoryId, refPaymentMethodId, refCurrencyId] = await Promise.all([
      this.mapSystemParameterToRefTxType(data.txTypeId),
      this.mapSystemParameterToRefCategory(data.categoryId, data.txTypeId),
      this.mapSystemParameterToRefPaymentMethod(data.paymentMethodId),
      this.mapSystemParameterToRefCurrency(data.currencyId),
    ])

    // ✅ NAKİT ÖDEMELERİ: Hesap/Kart/E-Cüzdan seçilmemişse otomatik "Nakit" hesabına ata
    // Mapping SONRASI refPaymentMethodId kullan
    let effectiveAccountId = data.accountId
    if (!data.accountId && !data.creditCardId && !(data as any).eWalletId) {
      effectiveAccountId = await this.ensureCashAccount(data.userId, refPaymentMethodId)
    }

    const createData: Prisma.TransactionCreateInput = {
      user: { connect: { id: data.userId } },
      txType: { connect: { id: refTxTypeId } }, // RefTxType ID (3 veya 4)
      category: { connect: { id: refCategoryId } }, // RefTxCategory ID
      paymentMethod: { connect: { id: refPaymentMethodId } }, // RefPaymentMethod ID
      currency: { connect: { id: refCurrencyId } }, // RefCurrency ID
      amount: new Prisma.Decimal(data.amount),
      transactionDate: data.transactionDate,
      description: data.description,
      tags: data.tags || [],
    }

    // Hesap/Kart/E-Cüzdan/Alıcı bağlantısı
    if (effectiveAccountId) {
      createData.account = { connect: { id: effectiveAccountId } }
    } else if (data.creditCardId) {
      createData.creditCard = { connect: { id: data.creditCardId } }
    }
    
    if ((data as any).eWalletId) {
      createData.eWallet = { connect: { id: (data as any).eWalletId } }
    }
    
    if ((data as any).beneficiaryId) {
      createData.beneficiary = { connect: { id: (data as any).beneficiaryId } }
    }

    // Transaction oluştur
    const transaction = await this.transactionRepository.createWithRelations(createData)

    // ✅ İŞ MANTIĞI: Hesap/Kart/E-Cüzdan bakiyesini güncelle
    const balanceUpdateData = { 
      ...data, 
      accountId: effectiveAccountId,
      eWalletId: (data as any).eWalletId
    }
    await this.updateAccountBalance(balanceUpdateData, refTxTypeId)

    return transaction
  }

  // Bu metot kullanıcının "Nakit" hesabını bulur veya oluşturur
  // Girdi: userId, refPaymentMethodId (RefPaymentMethod ID - mapping yapılmış)
  // Çıktı: Nakit hesap ID
  private async ensureCashAccount(userId: number, refPaymentMethodId: number): Promise<number> {
    // Nakit ödeme kontrolü (Ref tablo ID ile)
    const refPaymentMethod = await this.prisma.refPaymentMethod.findUnique({
      where: { id: refPaymentMethodId },
    })

    const isNakitPayment = refPaymentMethod?.code === 'NAKIT'

    if (!isNakitPayment) {
      return 0 // Nakit değilse hesap zorunlu (validation hata vermiştir)
    }

    // Kullanıcının "Nakit" hesabını ara
    let cashAccount = await this.prisma.account.findFirst({
      where: {
        userId,
        name: 'Nakit',
        active: true,
      },
    })

    // Yoksa oluştur
    if (!cashAccount) {
      // Nakit "bankası"nı bul veya oluştur
      let cashBank = await this.prisma.refBank.findFirst({
        where: { name: 'Nakit' },
      })

      if (!cashBank) {
        cashBank = await this.prisma.refBank.create({
          data: {
            name: 'Nakit',
            asciiName: 'Nakit',
            swiftBic: null,
            bankCode: null,
            website: null,
            active: true,
          },
        })
      }

      // Vadesiz hesap tipini bul
      const accountType = await this.prisma.refAccountType.findFirst({
        where: { code: 'VADESIZ' },
      })

      // TRY para birimini bul
      const tryCurrency = await this.prisma.refCurrency.findFirst({
        where: { code: 'TRY' },
      })

      if (!accountType || !tryCurrency) {
        throw new ValidationError('Nakit hesabı oluşturulamadı: Ref veriler eksik')
      }

      // Nakit hesabı oluştur
      cashAccount = await this.prisma.account.create({
        data: {
          userId,
          name: 'Nakit',
          bankId: cashBank.id,
          accountTypeId: accountType.id,
          currencyId: tryCurrency.id,
          balance: 0,
          active: true,
        },
      })
    }

    return cashAccount.id
  }

  // Bu metot transaction sonrası hesap/kart/e-cüzdan bakiyesini günceller
  // Girdi: Transaction data ve işlem tipi
  // Çıktı: void
  // Hata: -
  private async updateAccountBalance(
    data: CreateTransactionDTO & { userId: number; eWalletId?: number },
    refTxTypeId: number
  ): Promise<void> {
    const amount = new Prisma.Decimal(data.amount)
    const isIncome = refTxTypeId === 3 // GELIR: +, GIDER: -

    // Hesap seçiliyse
    if (data.accountId) {
      const currentAccount = await this.prisma.account.findUnique({
        where: { id: data.accountId },
      })

      if (currentAccount) {
        const newBalance = isIncome
          ? currentAccount.balance.add(amount) // Gelir: bakiye artar
          : currentAccount.balance.sub(amount) // Gider: bakiye azalır

        await this.prisma.account.update({
          where: { id: data.accountId },
          data: { balance: newBalance },
        })
      }
    }

    // Kredi kartı seçiliyse
    if (data.creditCardId) {
      const currentCard = await this.prisma.creditCard.findUnique({
        where: { id: data.creditCardId },
      })

      if (currentCard) {
        const newAvailableLimit = isIncome
          ? currentCard.availableLimit.add(amount) // Gelir: limit artar (ödeme yapılmış)
          : currentCard.availableLimit.sub(amount) // Gider: limit azalır (harcama)

        await this.prisma.creditCard.update({
          where: { id: data.creditCardId },
          data: { availableLimit: newAvailableLimit },
        })
      }
    }

    // E-Cüzdan seçiliyse
    if (data.eWalletId) {
      const currentWallet = await this.prisma.eWallet.findUnique({
        where: { id: data.eWalletId },
      })

      if (currentWallet) {
        const newBalance = isIncome
          ? currentWallet.balance.add(amount) // Gelir: bakiye artar
          : currentWallet.balance.sub(amount) // Gider: bakiye azalır

        await this.prisma.eWallet.update({
          where: { id: data.eWalletId },
          data: { balance: newBalance },
        })
      }
    }
  }

  // Bu metot SystemParameter TX_TYPE ID'sini RefTxType ID'sine map eder
  // Girdi: SystemParameter txTypeId (44, 45)
  // Çıktı: RefTxType ID (3, 4)
  private async mapSystemParameterToRefTxType(systemParamId: number): Promise<number> {
    // SystemParameter'dan kodu al
    const systemParam = await this.prisma.systemParameter.findUnique({
      where: { id: systemParamId },
    })

    if (!systemParam) {
      throw new ValidationError(`Geçersiz işlem tipi ID: ${systemParamId}`)
    }

    // RefTxType'dan aynı koda sahip kaydı bul
    const refTxType = await this.prisma.refTxType.findFirst({
      where: { code: systemParam.paramCode }, // GELIR veya GIDER
    })

    if (!refTxType) {
      throw new ValidationError(`RefTxType bulunamadı: ${systemParam.paramCode}`)
    }

    return refTxType.id // 3 veya 4
  }

  // Bu metot SystemParameter TX_CATEGORY ID'sini RefTxCategory ID'sine map eder
  // Girdi: SystemParameter categoryId, SystemParameter txTypeId
  // Çıktı: RefTxCategory ID
  private async mapSystemParameterToRefCategory(
    systemParamId: number,
    systemTxTypeId: number
  ): Promise<number> {
    // SystemParameter'dan kategoriyi al
    const systemParam = await this.prisma.systemParameter.findUnique({
      where: { id: systemParamId },
    })

    if (!systemParam) {
      throw new ValidationError(`Geçersiz kategori ID: ${systemParamId}`)
    }

    // txTypeId'yi RefTxType ID'sine çevir
    const refTxTypeId = await this.mapSystemParameterToRefTxType(systemTxTypeId)

    // RefTxCategory'den displayName ile eşleşen kaydı bul
    const refCategory = await this.prisma.refTxCategory.findFirst({
      where: {
        name: systemParam.displayName, // "Maaş", "Kira" vb.
        txTypeId: refTxTypeId, // 3 veya 4
      },
    })

    if (!refCategory) {
      throw new ValidationError(
        `RefTxCategory bulunamadı: ${systemParam.displayName} (txTypeId: ${refTxTypeId})`
      )
    }

    return refCategory.id
  }

  // Bu metot SystemParameter PAYMENT_METHOD ID'sini RefPaymentMethod ID'sine map eder
  // Girdi: SystemParameter paymentMethodId
  // Çıktı: RefPaymentMethod ID
  private async mapSystemParameterToRefPaymentMethod(systemParamId: number): Promise<number> {
    const systemParam = await this.prisma.systemParameter.findUnique({
      where: { id: systemParamId },
    })

    if (!systemParam) {
      throw new ValidationError(`Geçersiz ödeme yöntemi ID: ${systemParamId}`)
    }

    const refPaymentMethod = await this.prisma.refPaymentMethod.findFirst({
      where: { code: systemParam.paramCode },
    })

    if (!refPaymentMethod) {
      throw new ValidationError(`RefPaymentMethod bulunamadı: ${systemParam.paramCode}`)
    }

    return refPaymentMethod.id
  }

  // Bu metot SystemParameter CURRENCY ID'sini RefCurrency ID'sine map eder
  // Girdi: SystemParameter currencyId
  // Çıktı: RefCurrency ID
  private async mapSystemParameterToRefCurrency(systemParamId: number): Promise<number> {
    const systemParam = await this.prisma.systemParameter.findUnique({
      where: { id: systemParamId },
    })

    if (!systemParam) {
      throw new ValidationError(`Geçersiz para birimi ID: ${systemParamId}`)
    }

    const refCurrency = await this.prisma.refCurrency.findFirst({
      where: { code: systemParam.paramCode },
    })

    if (!refCurrency) {
      throw new ValidationError(`RefCurrency bulunamadı: ${systemParam.paramCode}`)
    }

    return refCurrency.id
  }

  // Bu metot işlem günceller.
  // Girdi: İşlem ID'si ve güncellenecek veriler
  // Çıktı: Güncellenmiş TransactionDTO
  // Hata: NotFoundError, ValidationError
  async update(id: number, data: Partial<CreateTransactionDTO>): Promise<TransactionDTO> {
    const transaction = await this.transactionRepository.update(id, data as never)
    return TransactionMapper.prismaToDTO(transaction)
  }

  // Bu metot işlemi siler.
  // Girdi: İşlem ID'si
  // Çıktı: Silinen TransactionDTO
  // Hata: NotFoundError
  async delete(id: number): Promise<TransactionDTO> {
    // Önce transaction'ı al (bakiye güncellemesi için)
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        txType: true,
        account: true,
        creditCard: true,
      },
    })

    if (!transaction) {
      throw new ValidationError(`Transaction bulunamadı: ${id}`)
    }

    // ✅ İŞ MANTIĞI: Silme öncesi bakiyeyi geri ekle
    await this.reverseAccountBalance(transaction)

    // Transaction'ı sil
    const deletedTransaction = await this.transactionRepository.delete(id)
    return TransactionMapper.prismaToDTO(deletedTransaction)
  }

  // Bu metot silinen transaction'ın etkisini geri alır (bakiye düzeltmesi)
  // Girdi: Transaction entity
  // Çıktı: void
  private async reverseAccountBalance(transaction: any): Promise<void> {
    const amount = new Prisma.Decimal(transaction.amount)
    const isIncome = transaction.txType.code === 'GELIR'

    // Hesaptan yapılmışsa
    if (transaction.accountId && transaction.account) {
      const newBalance = isIncome
        ? transaction.account.balance.sub(amount) // Gelir silindi: bakiye azalır
        : transaction.account.balance.add(amount) // Gider silindi: bakiye artar

      await this.prisma.account.update({
        where: { id: transaction.accountId },
        data: { balance: newBalance },
      })
    }

    // Kredi kartından yapılmışsa
    if (transaction.creditCardId && transaction.creditCard) {
      const newLimit = isIncome
        ? transaction.creditCard.availableLimit.sub(amount) // Gelir silindi: limit azalır
        : transaction.creditCard.availableLimit.add(amount) // Gider silindi: limit artar

      await this.prisma.creditCard.update({
        where: { id: transaction.creditCardId },
        data: { availableLimit: newLimit },
      })
    }
  }

  // Bu metot kullanıcının aylık işlem sayısını kontrol eder.
  // Girdi: Kullanıcı ID'si
  // Çıktı: İşlem sayısı
  // Hata: -
  async getMonthlyTransactionCount(userId: number): Promise<number> {
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    return this.transactionRepository.countByUserIdAndMonth(userId, currentMonth)
  }

  // Bu metot kullanıcının aylık işlem limitini kontrol eder.
  // Girdi: Kullanıcı ID'si ve plan
  // Çıktı: { allowed: boolean, current: number, limit: number }
  // Hata: -
  async checkMonthlyLimit(
    userId: number,
    plan: string
  ): Promise<{ allowed: boolean; current: number; limit: number }> {
    if (plan !== 'free') {
      return { allowed: true, current: 0, limit: -1 }
    }

    const limit = 50
    const current = await this.getMonthlyTransactionCount(userId)

    return {
      allowed: current < limit,
      current,
      limit,
    }
  }
}
