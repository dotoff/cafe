import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Phone, MapPin, Receipt, Sparkles } from 'lucide-react'
import OrderSuccessClient from './OrderSuccessClient'

export const metadata = {
  title: 'Order Confirmed | Flavourite Cafe',
  description: 'Your order has been placed successfully',
}

interface PageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const orderNumber = resolvedSearchParams?.orderId

  const payload = await getPayload({ config: configPromise })

  let order: any = null
  let settings: any = null

  try {
    settings = await payload.findGlobal({ slug: 'store-settings' })
  } catch (e) {
    console.error('Error fetching settings:', e)
  }

  if (orderNumber) {
    try {
      const result = await payload.find({
        collection: 'orders',
        where: {
          orderNumber: {
            equals: orderNumber,
          },
        },
        limit: 1,
      })
      if (result.docs && result.docs.length > 0) {
        order = result.docs[0]
      }
    } catch (e) {
      console.error('Error fetching order:', e)
    }
  }

  if (!order) {
    return (
      <div className="bg-brand-cream min-h-screen py-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ✓
          </div>
          <h1 className="text-2xl font-serif text-brand-dark mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-sm mb-6">
            Thank you for shopping with Flavourite. We are preparing your order!
          </p>
          <Link
            href="/"
            className="inline-block bg-brand-dark text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-medium transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return <OrderSuccessClient order={order} settings={settings} />
}
