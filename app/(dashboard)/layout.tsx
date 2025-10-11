import Sidebar from '@/components/sidebar'
import PeriodOnboarding from '@/components/period-onboarding'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
      <PeriodOnboarding />
    </div>
  )
}
