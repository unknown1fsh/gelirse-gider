'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  plan: string
  isActive: boolean
  createdAt: Date
  lastLoginAt?: Date
}

interface UserContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: {
    name: string
    email: string
    phone?: string
    password: string
    plan?: string
  }) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<boolean>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Kullanıcı bilgilerini al
  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
      } else {
        // Kullanıcı giriş yapmamış, bu normal
        setUser(null)
      }
    } catch (error) {
      // Network hataları veya diğer hatalar
      console.error('Fetch user error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Giriş yapma
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        // Kullanıcı bilgilerini hemen güncelle
        await fetchUser()
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  // Kayıt olma
  const register = async (data: {
    name: string
    email: string
    phone?: string
    password: string
    plan?: string
  }): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.user)
        // Kullanıcı bilgilerini hemen güncelle
        await fetchUser()
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }

  // Çıkış yapma
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      router.push('/landing')
    }
  }

  // Kullanıcı bilgilerini güncelleme
  const updateUser = async (data: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.user)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Update user error:', error)
      return false
    }
  }

  // Kullanıcı bilgilerini yenileme
  const refreshUser = async (): Promise<void> => {
    await fetchUser()
  }

  // Component mount olduğunda kullanıcı bilgilerini al
  useEffect(() => {
    fetchUser()
  }, [])

  const value: UserContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
