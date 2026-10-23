import { Suspense } from 'react'
import { LoginClient } from './LoginClient'

export const metadata = {
  title: 'Customer Login • Flavourite Cafe & Bakery',
  description: 'Log in with your phone number to access saved addresses and track bakery orders.',
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-dark border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginClient />
    </Suspense>
  )
}
