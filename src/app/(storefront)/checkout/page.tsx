import { getPayload } from 'payload'
import configPromise from '@payload-config'
import CheckoutClient from './CheckoutClient'

export const metadata = {
  title: 'Checkout | Flavourite Cafe',
  description: 'Enter your delivery address and confirm your order',
}

export default async function CheckoutPage() {
  const payload = await getPayload({ config: configPromise })

  let settings = {}
  try {
    settings = await payload.findGlobal({
      slug: 'store-settings',
    })
  } catch (error) {
    console.error('Failed to fetch store settings for checkout:', error)
  }

  return <CheckoutClient settings={settings} />
}
