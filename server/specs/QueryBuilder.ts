// Bu sınıf dinamik sorgu oluşturma için QueryBuilder pattern'ini uygular.
// Specification pattern ile birlikte kullanılır.
export class QueryBuilder<T> {
  private whereConditions: Record<string, unknown>[] = []
  private orderByConditions: Record<string, 'asc' | 'desc'>[] = []
  private skipValue = 0
  private takeValue?: number

  constructor() {
    // QueryBuilder instance'ı oluşturulur
  }

  // Bu metot WHERE koşulu ekler.
  // Girdi: Field adı ve değer
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  where(field: string, value: unknown): QueryBuilder<T> {
    this.whereConditions.push({ [field]: value })
    return this
  }

  // Bu metot AND koşulu ile WHERE ekler.
  // Girdi: Koşullar objesi
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  and(conditions: Record<string, unknown>): QueryBuilder<T> {
    this.whereConditions.push({ AND: conditions })
    return this
  }

  // Bu metot OR koşulu ile WHERE ekler.
  // Girdi: Koşullar dizisi
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  or(conditions: Record<string, unknown>[]): QueryBuilder<T> {
    this.whereConditions.push({ OR: conditions })
    return this
  }

  // Bu metot LIKE (contains) koşulu ekler.
  // Girdi: Field adı ve aranacak değer
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  like(field: string, value: string): QueryBuilder<T> {
    this.whereConditions.push({
      [field]: {
        contains: value,
        mode: 'insensitive',
      },
    })
    return this
  }

  // Bu metot RANGE (between) koşulu ekler.
  // Girdi: Field adı, başlangıç ve bitiş değerleri
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  range(field: string, from: unknown, to: unknown): QueryBuilder<T> {
    this.whereConditions.push({
      [field]: {
        gte: from,
        lte: to,
      },
    })
    return this
  }

  // Bu metot IN koşulu ekler.
  // Girdi: Field adı ve değerler dizisi
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  in(field: string, values: unknown[]): QueryBuilder<T> {
    this.whereConditions.push({
      [field]: {
        in: values,
      },
    })
    return this
  }

  // Bu metot NOT IN koşulu ekler.
  // Girdi: Field adı ve değerler dizisi
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  notIn(field: string, values: unknown[]): QueryBuilder<T> {
    this.whereConditions.push({
      [field]: {
        notIn: values,
      },
    })
    return this
  }

  // Bu metot büyüktür (greater than) koşulu ekler.
  // Girdi: Field adı ve değer
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  greaterThan(field: string, value: unknown): QueryBuilder<T> {
    this.whereConditions.push({
      [field]: {
        gt: value,
      },
    })
    return this
  }

  // Bu metot büyük eşittir (greater than or equal) koşulu ekler.
  // Girdi: Field adı ve değer
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  greaterThanOrEqual(field: string, value: unknown): QueryBuilder<T> {
    this.whereConditions.push({
      [field]: {
        gte: value,
      },
    })
    return this
  }

  // Bu metot küçüktür (less than) koşulu ekler.
  // Girdi: Field adı ve değer
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  lessThan(field: string, value: unknown): QueryBuilder<T> {
    this.whereConditions.push({
      [field]: {
        lt: value,
      },
    })
    return this
  }

  // Bu metot küçük eşittir (less than or equal) koşulu ekler.
  // Girdi: Field adı ve değer
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  lessThanOrEqual(field: string, value: unknown): QueryBuilder<T> {
    this.whereConditions.push({
      [field]: {
        lte: value,
      },
    })
    return this
  }

  // Bu metot ORDER BY ekler.
  // Girdi: Field adı ve sıralama yönü
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder<T> {
    this.orderByConditions.push({ [field]: direction })
    return this
  }

  // Bu metot sıralama için artan (ascending) yön kullanır.
  // Girdi: Field adı
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  sortAsc(field: string): QueryBuilder<T> {
    return this.orderBy(field, 'asc')
  }

  // Bu metot sıralama için azalan (descending) yön kullanır.
  // Girdi: Field adı
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  sortDesc(field: string): QueryBuilder<T> {
    return this.orderBy(field, 'desc')
  }

  // Bu metot sayfalama için SKIP değeri ayarlar.
  // Girdi: Atlanacak kayıt sayısı
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  skip(count: number): QueryBuilder<T> {
    this.skipValue = count
    return this
  }

  // Bu metot sayfalama için TAKE (limit) değeri ayarlar.
  // Girdi: Alınacak kayıt sayısı
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  take(count: number): QueryBuilder<T> {
    this.takeValue = count
    return this
  }

  // Bu metot sayfalama yapar.
  // Girdi: Sayfa numarası ve sayfa başına kayıt sayısı
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  paginate(page: number, pageSize: number): QueryBuilder<T> {
    this.skipValue = (page - 1) * pageSize
    this.takeValue = pageSize
    return this
  }

  // Bu metot oluşturulan sorguyu Prisma formatında döndürür.
  // Girdi: -
  // Çıktı: Prisma sorgu objesi
  // Hata: -
  build(): {
    where?: unknown
    orderBy?: unknown
    skip?: number
    take?: number
  } {
    const query: {
      where?: unknown
      orderBy?: unknown
      skip?: number
      take?: number
    } = {}

    if (this.whereConditions.length > 0) {
      if (this.whereConditions.length === 1) {
        query.where = this.whereConditions[0]
      } else {
        query.where = { AND: this.whereConditions }
      }
    }

    if (this.orderByConditions.length > 0) {
      query.orderBy =
        this.orderByConditions.length === 1 ? this.orderByConditions[0] : this.orderByConditions
    }

    if (this.skipValue > 0) {
      query.skip = this.skipValue
    }

    if (this.takeValue !== undefined) {
      query.take = this.takeValue
    }

    return query
  }

  // Bu metot sorguyu sıfırlar.
  // Girdi: -
  // Çıktı: QueryBuilder instance (fluent interface)
  // Hata: -
  reset(): QueryBuilder<T> {
    this.whereConditions = []
    this.orderByConditions = []
    this.skipValue = 0
    this.takeValue = undefined
    return this
  }
}
