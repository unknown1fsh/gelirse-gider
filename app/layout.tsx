import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/lib/user-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GiderSE-Gelir - Kişisel Finans Yönetimi',
  description: 'Modern kişisel finans platformu ile gelir ve giderlerinizi kolayca takip edin',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
