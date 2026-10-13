import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Phone, MapPin, Receipt, Sparkles } from 'lucide-react'
import OrderSuccessClient from './OrderSuccessClient'

export const metadata = {
  title: 'Order Confirmed | Flavourite Cafe',
  description: 'Your order has been placed successfully',
}

export const dynamic = 'force-dynamic'

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

  return <OrderSuccessClient order={order} orderNumber={orderNumber} settings={settings} />
}
