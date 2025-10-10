import { NextResponse } from 'next/server'

export async function GET() {
  const plans = [
    {
      id: 'free',
      name: 'Ücretsiz',
      price: 0,
      currency: 'TRY',
      period: 'month',
      description: 'Temel özellikler',
      categories: [
        {
          name: 'Temel Finansal Yönetim',
          features: [
            'Aylık 50 işlem',
            'Temel raporlar',
            'Mobil erişim',
            'E-posta desteği',
            'Temel kategoriler',
          ],
        },
      ],
      limitations: ['Sınırlı işlem sayısı', 'Temel raporlar', 'Standart destek'],
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 250,
      currency: 'TRY',
      period: 'month',
      description: 'Tüm premium özellikler',
      categories: [
        {
          name: '🧠 AI & Akıllı Analizler',
          features: [
            'AI Finansal Asistan',
            'Otomatik Kategorileme',
            'Tahmin Modelleri',
            'Akıllı Öneriler',
          ],
        },
        {
          name: '📊 Gelişmiş Raporlama',
          features: [
            'İnteraktif Grafikler',
            'Harcama Dağılımı',
            'Trend Analizleri',
            'PDF/Excel Raporları',
          ],
        },
        {
          name: '🎯 Akıllı Hedefleme',
          features: ['Kişisel Hedefler', 'Mevsimsel Analiz', 'Akıllı Bildirimler', 'Başarı Takibi'],
        },
        {
          name: '⚡ Otomasyon & Verimlilik',
          features: ['Otomatik Takip', 'Akıllı Tekrarlar', 'Zaman Tasarrufu', 'Özelleştirilebilir'],
        },
        {
          name: '🛡️ Premium Destek',
          features: ['7/24 Premium Destek', 'Gelişmiş Güvenlik', 'Premium Tema', 'Bulut Yedekleme'],
        },
      ],
      limitations: [],
      popular: true,
      savings: 'Yıllık ödeme ile %20 indirim',
    },
    {
      id: 'enterprise_premium',
      name: 'Kurumsal Premium',
      price: 450,
      currency: 'TRY',
      period: 'month',
      description: 'İşletmeler için ultra premium',
      categories: [
        {
          name: '🏢 Kurumsal Yönetim',
          features: [
            'Çoklu Şirket Konsolidasyonu',
            'Sınırsız Departman Yönetimi',
            'Hiyerarşik Yetki Sistemi',
            'Global Şube Ağı',
          ],
        },
        {
          name: '🔒 Enterprise Güvenlik',
          features: [
            'Kurumsal Quantum Şifreleme',
            'Enterprise Sıfır Güven',
            'Siber Tehdit İzleme',
            'Uyumluluk Yönetimi',
          ],
        },
        {
          name: '🤖 AI Süper Zeka',
          features: [
            'Kurumsal AI Süper Zeka',
            'Kurumsal Gelir Optimizasyonu',
            'Operasyonel Verimlilik',
            'Kurumsal Süreç Otomasyonu',
          ],
        },
        {
          name: '🌐 Global Altyapı',
          features: [
            'Global İş Ağı',
            'Enterprise Bulut Altyapısı',
            'Çoklu Para Birimi Yönetimi',
            'VIP Kurumsal Destek',
          ],
        },
        {
          name: '💰 Kurumsal Gelir Artırma',
          features: [
            'Pazar Genişletme',
            'Müşteri Segmentasyonu',
            'Ürün Portföy Optimizasyonu',
            'Kurumsal Ortaklıklar',
          ],
        },
        {
          name: '📈 İş Zekası & Analytics',
          features: [
            'Kurumsal Dashboard',
            'Enterprise API',
            'Özel Sistem Entegrasyonları',
            'Beyaz Etiket Çözümü',
          ],
        },
      ],
      limitations: [],
      popular: false,
      custom: 'Özel fiyatlandırma mevcut',
    },
  ]

  return NextResponse.json({
    success: true,
    plans,
    lastUpdated: new Date().toISOString(),
  })
}
