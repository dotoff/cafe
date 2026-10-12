import { getPayload } from 'payload'
import configPromise from '@payload-config'
import CartClient from './CartClient'

export const metadata = {
  title: 'Shopping Cart | Flavourite',
  description: 'Review your cart and checkout',
}

export default async function CartPage() {
  const payload = await getPayload({ config: configPromise })
  
  // Fetch global store settings
  let settings = {}
  try {
    settings = await payload.findGlobal({
      slug: 'store-settings',
    })
  } catch (error) {
    console.error('Failed to fetch store settings:', error)
  }

  return <CartClient settings={settings} />
}
