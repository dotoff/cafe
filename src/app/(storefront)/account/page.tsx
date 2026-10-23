import { Suspense } from 'react'
import { AccountClient } from './AccountClient'

export const metadata = {
  title: 'My Account • Flavourite Cafe & Bakery',
  description: 'Manage your saved delivery addresses and track past bakery orders.',
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-dark border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AccountClient />
    </Suspense>
  )
}
