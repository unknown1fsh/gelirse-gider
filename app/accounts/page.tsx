'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EditNameModal from '@/components/ui/edit-name-modal'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { usePremium } from '@/lib/use-premium'
import {
  Wallet,
  CreditCard,
  TrendingUp,
  Coins,
  ArrowLeft,
  Home,
  Plus,
  Edit,
  Trash2,
  Crown,
} from 'lucide-react'
import { formatCurrency } from '@/lib/validators'

interface BankAccount {
  id: number
  name: string
  balance: string
  accountNumber?: string
  iban?: string
  bank: { id: number; name: string }
  currency: { id: number; code: string; name: string }
  createdAt: string
}

interface EWallet {
  id: number
  name: string
  provider: string
  balance: string
  accountEmail?: string
  accountPhone?: string
  currency: { id: number; code: string; name: string }
  createdAt: string
}

export default function AccountsPage() {
  const router = useRouter()
  const { isPremium, handlePremiumFeature } = usePremium()
  
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [eWallets, setEWallets] = useState<EWallet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Edit/Delete states
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{ id: number; name: string; type: 'account' | 'ewallet' } | null>(null)
  const [transactionCount, setTransactionCount] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [accountsRes, ewalletsRes] = await Promise.all([
        fetch('/api/accounts?type=bank', { credentials: 'include' }),
        fetch('/api/ewallets', { credentials: 'include' }).catch(() => ({ ok: false }))
      ])

      if (accountsRes.ok) {
        const accounts = await accountsRes.json()
        setBankAccounts(accounts.filter((acc: any) => acc.accountType === 'bank'))
      }

      if (ewalletsRes.ok && isPremium) {
        const wallets = await ewalletsRes.json()
        setEWallets(wallets)
      }
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error)
      setError('Veriler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: number, name: string, type: 'account' | 'ewallet') => {
    setSelectedItem({ id, name, type })
    setShowEditModal(true)
  }

  const handleDelete = async (id: number, type: 'account' | 'ewallet') => {
    // İşlem sayısını kontrol et
    const endpoint = type === 'account' ? `/api/accounts/${id}` : `/api/ewallets/${id}`
    const countRes = await fetch(`/api/transactions?${type === 'account' ? 'accountId' : 'eWalletId'}=${id}`)
    const count = countRes.ok ? (await countRes.json()).length : 0
    
    setTransactionCount(count)
    setSelectedItem({ id, name: '', type })
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!selectedItem) return

    try {
      const endpoint = selectedItem.type === 'account' 
        ? `/api/accounts/${selectedItem.id}` 
        : `/api/ewallets/${selectedItem.id}`
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        alert(`${selectedItem.type === 'account' ? 'Hesap' : 'E-Cüzdan'} başarıyla silindi`)
        fetchData()
      } else {
        alert('Silme işlemi başarısız')
      }
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Silme işlemi başarısız')
    } finally {
      setShowDeleteConfirm(false)
      setSelectedItem(null)
    }
  }

  const handleSaveEdit = async (newName: string) => {
    if (!selectedItem) return

    const endpoint = selectedItem.type === 'account' 
      ? `/api/accounts/${selectedItem.id}` 
      : `/api/ewallets/${selectedItem.id}`

    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
      credentials: 'include',
    })

    if (response.ok) {
      fetchData()
    }
  }

  const totalBankBalance = bankAccounts.reduce((sum, acc) => {
    const rate = acc.currency.code === 'USD' ? 30 : acc.currency.code === 'EUR' ? 32 : 1
    return sum + parseFloat(acc.balance) * rate
  }, 0)

  const totalEWalletBalance = eWallets.reduce((sum, wallet) => {
    const rate = wallet.currency.code === 'USD' ? 30 : wallet.currency.code === 'EUR' ? 32 : 1
    return sum + parseFloat(wallet.balance) * rate
  }, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Home className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Hesaplar</h1>
          <p className="text-muted-foreground">Banka hesaplarınızı ve e-cüzdanlarınızı yönetin</p>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banka Hesapları</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalBankBalance, 'TRY')}
            </div>
            <p className="text-xs text-muted-foreground">{bankAccounts.length} hesap</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-Cüzdanlar</CardTitle>
            {!isPremium && <Crown className="h-4 w-4 text-purple-600" />}
            {isPremium && <span className="text-xl font-bold text-green-600">₺</span>}
          </CardHeader>
          <CardContent>
            {isPremium ? (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalEWalletBalance, 'TRY')}
                </div>
                <p className="text-xs text-muted-foreground">{eWallets.length} e-cüzdan</p>
              </>
            ) : (
              <>
                <div className="text-xl font-semibold text-purple-600">Premium</div>
                <p className="text-xs text-muted-foreground">Özellik</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalBankBalance + totalEWalletBalance, 'TRY')}
            </div>
            <p className="text-xs text-muted-foreground">Toplam bakiye</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="bank" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bank">Banka Hesapları</TabsTrigger>
          <TabsTrigger value="ewallet" disabled={!isPremium}>
            E-Cüzdanlar {!isPremium && <Crown className="ml-2 h-3 w-3" />}
          </TabsTrigger>
        </TabsList>

        {/* Banka Hesapları Tab */}
        <TabsContent value="bank" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Banka Hesapları</h2>
            <Link
              href="/accounts/new"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Yeni Hesap
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : bankAccounts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Wallet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Henüz banka hesabı eklenmemiş</p>
                <Link
                  href="/accounts/new"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  İlk Hesabını Ekle
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bankAccounts.map(account => (
                <Card key={account.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{account.name}</CardTitle>
                        <CardDescription>{account.bank.name}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(account.id, account.name, 'account')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(account.id, 'account')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(parseFloat(account.balance), account.currency.code)}
                        </div>
                        <p className="text-xs text-gray-500">Güncel Bakiye</p>
                      </div>
                      {account.iban && (
                        <div className="text-sm text-gray-600">
                          <strong>IBAN:</strong> {account.iban}
                        </div>
                      )}
                      <Link
                        href={`/accounts/${account.id}`}
                        className="inline-block w-full text-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm font-medium"
                      >
                        Detayları Görüntüle
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* E-Cüzdanlar Tab */}
        <TabsContent value="ewallet" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">E-Cüzdanlar</h2>
              <p className="text-sm text-muted-foreground">PayPal, Papara, Ininal vb.</p>
            </div>
            <button
              onClick={() => {
                if (!isPremium) {
                  handlePremiumFeature('E-Cüzdanlar')
                  return
                }
                router.push('/ewallets/new')
              }}
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Yeni E-Cüzdan
            </button>
          </div>

          {!isPremium ? (
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="py-12 text-center">
                <Crown className="mx-auto h-16 w-16 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Premium Özellik</h3>
                <p className="text-purple-700 mb-6">
                  E-Cüzdan yönetimi Premium üyelere özeldir
                </p>
                <button
                  onClick={() => router.push('/premium')}
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
                >
                  Premium'a Geç
                </button>
              </CardContent>
            </Card>
          ) : eWallets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
                  <span className="text-5xl font-bold text-gray-400">₺</span>
                </div>
                <p className="text-gray-500 mb-4">Henüz e-cüzdan eklenmemiş</p>
                <button
                  onClick={() => router.push('/ewallets/new')}
                  className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  İlk E-Cüzdanı Ekle
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eWallets.map(wallet => (
                <Card key={wallet.id} className="hover:shadow-md transition-shadow border-green-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{wallet.name}</CardTitle>
                        <CardDescription>{wallet.provider}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(wallet.id, wallet.name, 'ewallet')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(wallet.id, 'ewallet')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(parseFloat(wallet.balance), wallet.currency.code)}
                        </div>
                        <p className="text-xs text-gray-500">Güncel Bakiye</p>
                      </div>
                      {wallet.accountEmail && (
                        <div className="text-sm text-gray-600">
                          <strong>Email:</strong> {wallet.accountEmail}
                        </div>
                      )}
                      {wallet.accountPhone && (
                        <div className="text-sm text-gray-600">
                          <strong>Telefon:</strong> {wallet.accountPhone}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <EditNameModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentName={selectedItem.name}
          onSave={handleSaveEdit}
          title={selectedItem.type === 'account' ? 'Hesap Adını Düzenle' : 'E-Cüzdan Adını Düzenle'}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedItem && (
        <ConfirmationDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title={`${selectedItem.type === 'account' ? 'Hesap' : 'E-Cüzdan'} Sil`}
          message={`Bu ${selectedItem.type === 'account' ? 'hesabı' : 'e-cüzdanı'} silmek istediğinizden emin misiniz?`}
          warningMessage={
            transactionCount > 0
              ? `Bu ${selectedItem.type === 'account' ? 'hesapla' : 'e-cüzdanla'} ilişkili ${transactionCount} işlem kaydı da silinecektir. Bu işlem geri alınamaz.`
              : undefined
          }
          confirmText="Sil"
          cancelText="İptal"
        />
      )}
    </div>
  )
}
