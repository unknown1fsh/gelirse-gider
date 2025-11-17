'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface UserDetail {
  id: number
  email: string
  name: string
  phone?: string
  role: string
  plan: string
  isActive: boolean
  emailVerified: boolean
  createdAt: string
  lastLoginAt?: string
  _count?: {
    accounts: number
    transactions: number
    periods: number
    subscriptions: number
  }
}

interface UserDetailModalProps {
  open: boolean
  onClose: () => void
  user: UserDetail | null
  loading?: boolean
}

export default function UserDetailModal({ open, onClose, user, loading }: UserDetailModalProps) {
  if (!user && !loading) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Kullanıcı Detayları</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : user ? (
          <div className="space-y-6 mt-4">
            {/* Temel Bilgiler */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Ad Soyad</label>
                <p className="text-sm text-slate-900 mt-1">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">E-posta</label>
                <p className="text-sm text-slate-900 mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Telefon</label>
                <p className="text-sm text-slate-900 mt-1">{user.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Rol</label>
                <div className="mt-1">
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Plan</label>
                <div className="mt-1">
                  <Badge
                    variant={
                      user.plan === 'premium' || user.plan === 'enterprise'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {user.plan}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Durum</label>
                <div className="mt-1">
                  <Badge variant={user.isActive ? 'default' : 'destructive'}>
                    {user.isActive ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">E-posta Doğrulandı</label>
                <div className="mt-1">
                  <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                    {user.emailVerified ? 'Evet' : 'Hayır'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Kayıt Tarihi</label>
                <p className="text-sm text-slate-900 mt-1">
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              {user.lastLoginAt && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Son Giriş</label>
                  <p className="text-sm text-slate-900 mt-1">
                    {new Date(user.lastLoginAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              )}
            </div>

            {/* İstatistikler */}
            {user._count && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">İstatistikler</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{user._count.accounts}</div>
                    <div className="text-sm text-slate-600 mt-1">Hesap</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">
                      {user._count.transactions}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">İşlem</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{user._count.periods}</div>
                    <div className="text-sm text-slate-600 mt-1">Dönem</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">
                      {user._count.subscriptions}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">Abonelik</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
