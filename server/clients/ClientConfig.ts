// Bu sınıf dış servis client'ları için yapılandırma sağlar.
export interface ClientConfig {
  baseUrl: string
  timeout: number
  retryAttempts: number
  retryDelay: number
  headers?: Record<string, string>
}

// Bu sınıf default client yapılandırmasını sağlar.
export class DefaultClientConfig {
  // Bu metot HTTP client için default yapılandırma döndürür.
  // Girdi: -
  // Çıktı: ClientConfig
  // Hata: -
  static getDefaultConfig(): ClientConfig {
    return {
      baseUrl: '',
      timeout: 30000, // 30 saniye
      retryAttempts: 3,
      retryDelay: 1000, // 1 saniye
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  }

  // Bu metot TCMB döviz servisi için yapılandırma döndürür.
  // Girdi: -
  // Çıktı: ClientConfig
  // Hata: -
  static getTCMBConfig(): ClientConfig {
    return {
      ...this.getDefaultConfig(),
      baseUrl: 'https://www.tcmb.gov.tr',
      timeout: 10000, // 10 saniye
    }
  }

  // Bu metot altın fiyat servisi için yapılandırma döndürür.
  // Girdi: -
  // Çıktı: ClientConfig
  // Hata: -
  static getGoldPriceConfig(): ClientConfig {
    return {
      ...this.getDefaultConfig(),
      baseUrl: 'https://www.doviz.com',
      timeout: 10000, // 10 saniye
    }
  }
}
