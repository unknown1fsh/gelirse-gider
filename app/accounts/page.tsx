'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EditNameModal from '@/components/ui/edit-name-modal'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { usePremium } from '@/lib/use-premium'
import { Wallet, CreditCard, Coins, ArrowLeft, Home, Plus, Edit, Trash2, Crown } from 'lucide-react'
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

interface CreditCard {
  id: number
  name: string
  limitAmount: string
  availableLimit: string
  dueDay: number
  bank: { id: number; name: string }
  currency: { id: number; code: string; name: string }
  createdAt: string
}

interface GoldItem {
  id: number
  name: string
  weightGrams: string
  purchasePrice: string
  currentValueTry: string | null
  goldType: { id: number; name: string }
  goldPurity: { id: number; name: string }
  createdAt: string
}

export default function AccountsPage() {
  const router = useRouter()
  const { isPremium, handlePremiumFeature } = usePremium()

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [eWallets, setEWallets] = useState<EWallet[]>([])
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [goldItems, setGoldItems] = useState<GoldItem[]>([])
  const [loading, setLoading] = useState(true)

  // Edit/Delete states
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{
    id: number
    name: string
    type: 'account' | 'ewallet'
  } | null>(null)
  const [transactionCount, setTransactionCount] = useState(0)

  useEffect(() => {
    void fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchData() {
    try {
      const [accountsRes, ewalletsRes, cardsRes, goldRes] = await Promise.all([
        fetch('/api/accounts?type=bank', { credentials: 'include' }),
        fetch('/api/ewallets', { credentials: 'include' }).catch(() => ({ ok: false })),
        fetch('/api/cards', { credentials: 'include' }).catch(() => ({ ok: false })),
        fetch('/api/gold', { credentials: 'include' }).catch(() => ({ ok: false })),
      ])

      if (accountsRes.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const accountsData = await accountsRes.json()
        setBankAccounts(accountsData as BankAccount[])
      }

      if (ewalletsRes.ok && isPremium) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const walletsData = await ewalletsRes.json()
        setEWallets(walletsData as EWallet[])
      }

      if (cardsRes.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const cardsData = await cardsRes.json()
        setCreditCards(cardsData as CreditCard[])
      }

      if (goldRes.ok && isPremium) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const goldData = await goldRes.json()
        setGoldItems(goldData as GoldItem[])
      }
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error)
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
    const countRes = await fetch(
      `/api/transactions?${type === 'account' ? 'accountId' : 'eWalletId'}=${id}`
    )
    if (countRes.ok) {
      const transactions = (await countRes.json()) as Array<{ id: number }>
      setTransactionCount(transactions.length)
    } else {
      setTransactionCount(0)
    }

    setSelectedItem({ id, name: '', type })
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!selectedItem) {
      return
    }

    try {
      const endpoint =
        selectedItem.type === 'account'
          ? `/api/accounts/${selectedItem.id}`
          : `/api/ewallets/${selectedItem.id}`

      const response = await fetch(endpoint, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        alert(`${selectedItem.type === 'account' ? 'Hesap' : 'E-Cüzdan'} başarıyla silindi`)
        void fetchData()
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
    if (!selectedItem) {
      return
    }

    const endpoint =
      selectedItem.type === 'account'
        ? `/api/accounts/${selectedItem.id}`
        : `/api/ewallets/${selectedItem.id}`

    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
      credentials: 'include',
    })

    if (response.ok) {
      void fetchData()
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

  const totalCardLimit = creditCards.reduce((sum, card) => {
    const rate = card.currency.code === 'USD' ? 30 : card.currency.code === 'EUR' ? 32 : 1
    return sum + parseFloat(card.availableLimit) * rate
  }, 0)

  const totalGoldValue = goldItems.reduce((sum, item) => {
    return sum + parseFloat(item.currentValueTry || '0')
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
          <p className="text-muted-foreground">Tüm finansal hesaplarınızı tek yerden yönetin</p>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <CardTitle className="text-sm font-medium">Kredi Kartları</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalCardLimit, 'TRY')}
            </div>
            <p className="text-xs text-muted-foreground">{creditCards.length} kart</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Altın ve Ziynet</CardTitle>
            {!isPremium && <Crown className="h-4 w-4 text-purple-600" />}
            {isPremium && <Coins className="h-4 w-4 text-yellow-600" />}
          </CardHeader>
          <CardContent>
            {isPremium ? (
              <>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(totalGoldValue, 'TRY')}
                </div>
                <p className="text-xs text-muted-foreground">{goldItems.length} eşya</p>
              </>
            ) : (
              <>
                <div className="text-xl font-semibold text-purple-600">Premium</div>
                <p className="text-xs text-muted-foreground">Özellik</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="bank" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="bank">Banka Hesapları</TabsTrigger>
          <TabsTrigger value="ewallet" disabled={!isPremium}>
            E-Cüzdanlar {!isPremium && <Crown className="ml-2 h-3 w-3" />}
          </TabsTrigger>
          <TabsTrigger value="cards">Kredi Kartları</TabsTrigger>
          <TabsTrigger value="gold" disabled={!isPremium}>
            Altın ve Ziynet {!isPremium && <Crown className="ml-2 h-3 w-3" />}
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
                          onClick={() => void handleDelete(account.id, 'account')}
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
                <p className="text-purple-700 mb-6">E-Cüzdan yönetimi Premium üyelere özeldir</p>
                <button
                  onClick={() => router.push('/premium')}
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
                >
                  Premium&apos;a Geç
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
                <Card
                  key={wallet.id}
                  className="hover:shadow-md transition-shadow border-green-200"
                >
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
                          onClick={() => void handleDelete(wallet.id, 'ewallet')}
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

        {/* Kredi Kartları Tab */}
        <TabsContent value="cards" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Kredi Kartları</h2>
            <Link href="/cards">
              <button className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
                <Plus className="mr-2 h-4 w-4" />
                Yeni Kredi Kartı Ekle
              </button>
            </Link>
          </div>

          {creditCards.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Henüz kredi kartı eklenmemiş</p>
                <button
                  onClick={() => router.push('/cards')}
                  className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  İlk Kredi Kartını Ekle
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creditCards.map(card => (
                <Card key={card.id} className="hover:shadow-md transition-shadow border-orange-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{card.name}</CardTitle>
                        <CardDescription>{card.bank.name}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {formatCurrency(parseFloat(card.availableLimit), card.currency.code)}
                        </div>
                        <p className="text-xs text-gray-500">Kullanılabilir Limit</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Toplam Limit:</strong>{' '}
                        {formatCurrency(parseFloat(card.limitAmount), card.currency.code)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Son Ödeme Günü:</strong> Her ayın {card.dueDay}. günü
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Altın ve Ziynet Tab */}
        <TabsContent value="gold" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Altın ve Ziynet</h2>
            {isPremium && (
              <Link href="/gold/new">
                <button className="inline-flex items-center justify-center rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Altın Eşyası Ekle
                </button>
              </Link>
            )}
          </div>

          {!isPremium ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Crown className="mx-auto h-16 w-16 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Premium Özellik</h3>
                <p className="text-purple-700 mb-6">
                  Altın ve ziynet takibi Premium üyelere özeldir
                </p>
                <button
                  onClick={() => router.push('/premium')}
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
                >
                  Premium&apos;a Geç
                </button>
              </CardContent>
            </Card>
          ) : goldItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Coins className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Henüz altın eşyası eklenmemiş</p>
                <button
                  onClick={() => router.push('/gold/new')}
                  className="inline-flex items-center justify-center rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  İlk Altın Eşyasını Ekle
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goldItems.map(item => (
                <Card key={item.id} className="hover:shadow-md transition-shadow border-yellow-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>
                          {item.goldType.name} - {item.goldPurity.name}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {formatCurrency(
                            parseFloat(item.currentValueTry || item.purchasePrice),
                            'TRY'
                          )}
                        </div>
                        <p className="text-xs text-gray-500">Güncel Değer</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Ağırlık:</strong> {item.weightGrams} gram
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Alış Fiyatı:</strong>{' '}
                        {formatCurrency(parseFloat(item.purchasePrice), 'TRY')}
                      </div>
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
