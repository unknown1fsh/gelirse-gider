'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Period } from './period-helpers'

export interface CreatePeriodData {
  name: string
  periodType: 'YEARLY' | 'FISCAL_YEAR' | 'MONTHLY' | 'CUSTOM'
  startDate: Date
  endDate: Date
  description?: string
}

export interface ClosePeriodData {
  periodId: number
  transferBalances: boolean
  closingNotes?: string
}

interface PeriodContextType {
  activePeriod: Period | null
  periods: Period[]
  loading: boolean
  changePeriod: (periodId: number) => Promise<boolean>
  createPeriod: (data: CreatePeriodData) => Promise<{ success: boolean; error?: string }>
  closePeriod: (data: ClosePeriodData) => Promise<boolean>
  refreshPeriods: () => Promise<void>
  error: string | null
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined)

export function PeriodProvider({ children }: { children: React.ReactNode }) {
  const [activePeriod, setActivePeriod] = useState<Period | null>(null)
  const [periods, setPeriods] = useState<Period[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  // Dönemleri yükle
  const fetchPeriods = useCallback(
    async (forceRefresh = false) => {
      // Eğer zaten fetch edilmişse ve force değilse, tekrar fetch etme
      if (hasFetched && !forceRefresh) {
        return
      }

      try {
        setError(null)
        setLoading(true)

        const response = await fetch('/api/periods', {
          credentials: 'include',
          cache: 'no-store',
        })

        if (!response.ok) {
          // 401 - kullanıcı giriş yapmamış, normal durum
          if (response.status === 401) {
            setLoading(false)
            setHasFetched(true)
            return
          }

          // 500 hatası - veritabanı henüz hazır değil, sessizce geç
          console.warn('Period API not ready yet, skipping...')
          setLoading(false)
          setHasFetched(true)
          return
        }

        const data = (await response.json()) as { success?: boolean; periods?: Period[] }
        setPeriods(data.periods || [])

        // Aktif dönemi bul
        const active = data.periods?.find(p => p.isActive && !p.isClosed)
        setActivePeriod(active || null)

        setHasFetched(true)
      } catch (err) {
        // Network hatası, sessizce logla
        console.warn('Period fetch warning:', err)
        // Hata durumunda empty state bırak
        setHasFetched(true)
      } finally {
        setLoading(false)
      }
    },
    [hasFetched]
  )

  // Aktif dönemi değiştir
  const changePeriod = async (periodId: number): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`/api/periods/${periodId}/activate`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string }
        throw new Error(errorData.error || 'Dönem değiştirilemedi')
      }

      const data = (await response.json()) as { success?: boolean; period?: Period }
      if (data.period) {
        setActivePeriod(data.period)
      }

      // Tüm dönemleri yenile (force refresh)
      await fetchPeriods(true)

      return true
    } catch (err) {
      console.error('Change period error:', err)
      setError(err instanceof Error ? err.message : 'Dönem değiştirilemedi')
      return false
    }
  }

  // Yeni dönem oluştur
  const createPeriod = async (
    data: CreatePeriodData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null)
      const response = await fetch('/api/periods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const responseData = (await response.json()) as {
        success?: boolean
        error?: string
        period?: Period
      }

      if (!response.ok) {
        const errorMessage = responseData.error || 'Dönem oluşturulamadı'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      // Dönemleri yenile (force refresh)
      await fetchPeriods(true)

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Dönem oluşturulamadı'
      console.error('Create period error:', err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Dönemi kapat
  const closePeriod = async (data: ClosePeriodData): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`/api/periods/${data.periodId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          transferBalances: data.transferBalances,
          closingNotes: data.closingNotes,
        }),
      })

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string }
        throw new Error(errorData.error || 'Dönem kapatılamadı')
      }

      // Dönemleri yenile (force refresh)
      await fetchPeriods(true)

      return true
    } catch (err) {
      console.error('Close period error:', err)
      setError(err instanceof Error ? err.message : 'Dönem kapatılamadı')
      return false
    }
  }

  // Dönemleri yenile
  const refreshPeriods = async (): Promise<void> => {
    setHasFetched(false)
    await fetchPeriods(true)
  }

  // Public sayfa kontrolü
  const isPublicPage = (): boolean => {
    if (typeof window === 'undefined') {
      return false
    }
    const currentPath = window.location.pathname
    const publicPaths = ['/landing', '/auth/login', '/auth/register', '/auth/forgot-password']
    return publicPaths.some(path => currentPath.startsWith(path))
  }

  // İlk yüklemede dönemleri getir (public sayfalarda değil)
  useEffect(() => {
    // Public sayfalarda fetch yapma
    if (isPublicPage()) {
      setLoading(false)
      setHasFetched(true)
      return
    }

    // Sadece bir kere fetch et
    if (!hasFetched) {
      void fetchPeriods(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFetched])

  // Login/Register olaylarını dinle
  useEffect(() => {
    const handleUserLogin = () => {
      // Kullanıcı giriş yaptığında period'ları yenile
      setHasFetched(false)
      void fetchPeriods(true)
    }

    window.addEventListener('user-logged-in', handleUserLogin)

    return () => {
      window.removeEventListener('user-logged-in', handleUserLogin)
    }
  }, [fetchPeriods])

  const value: PeriodContextType = {
    activePeriod,
    periods,
    loading,
    changePeriod,
    createPeriod,
    closePeriod,
    refreshPeriods,
    error,
  }

  return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>
}

export function usePeriod() {
  const context = useContext(PeriodContext)
  if (context === undefined) {
    throw new Error('usePeriod must be used within a PeriodProvider')
  }
  return context
}
