import { ClientConfig } from './ClientConfig'
import { Logger } from '../utils/Logger'

// Bu sınıf tüm HTTP client'lar için temel işlevleri sağlar.
export class BaseHttpClient {
  protected config: ClientConfig

  constructor(config: ClientConfig) {
    this.config = config
  }

  // Bu metot retry mekanizması ile fetch işlemi yapar.
  // Girdi: URL ve fetch options
  // Çıktı: Fetch response
  // Hata: FetchError, TimeoutError
  protected async fetchWithRetry(
    url: string,
    options?: RequestInit,
    attempt = 1
  ): Promise<Response> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.config.headers,
          ...options?.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok && attempt < this.config.retryAttempts) {
        Logger.warn(`Request failed, retrying... (Attempt ${attempt})`, {
          url,
          status: response.status,
        })
        await this.delay(this.config.retryDelay)
        return this.fetchWithRetry(url, options, attempt + 1)
      }

      return response
    } catch (error) {
      if (attempt < this.config.retryAttempts) {
        Logger.warn(`Request failed, retrying... (Attempt ${attempt})`, { url, error })
        await this.delay(this.config.retryDelay)
        return this.fetchWithRetry(url, options, attempt + 1)
      }
      throw error
    }
  }

  // Bu metot belirtilen süre bekler.
  // Girdi: Milisaniye cinsinden süre
  // Çıktı: Promise
  // Hata: -
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Bu metot GET isteği yapar.
  // Girdi: Endpoint path
  // Çıktı: JSON response
  // Hata: HttpError
  async get<T>(path: string): Promise<T> {
    const url = `${this.config.baseUrl}${path}`
    const response = await this.fetchWithRetry(url, { method: 'GET' })
    return response.json() as Promise<T>
  }

  // Bu metot POST isteği yapar.
  // Girdi: Endpoint path ve request body
  // Çıktı: JSON response
  // Hata: HttpError
  async post<T>(path: string, body: unknown): Promise<T> {
    const url = `${this.config.baseUrl}${path}`
    const response = await this.fetchWithRetry(url, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return response.json() as Promise<T>
  }
}
