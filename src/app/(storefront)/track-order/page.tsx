import { getPayload } from 'payload'
import configPromise from '@payload-config'
import TrackOrderClient from './TrackOrderClient'
import { Suspense } from 'react'

export const metadata = {
  title: 'Track Your Order | Flavourite Cafe',
  description: 'Track the live preparation and delivery status of your Flavourite order',
}

export default async function TrackOrderPage() {
  const payload = await getPayload({ config: configPromise })

  let settings = {}
  try {
    settings = await payload.findGlobal({ slug: 'store-settings' })
  } catch (e) {
    console.error('Error fetching settings for tracking page:', e)
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream flex items-center justify-center">Loading tracker...</div>}>
      <TrackOrderClient settings={settings} />
    </Suspense>
  )
}
