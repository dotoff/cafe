import type { Metadata } from 'next'
import '@/app/globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const metadata: Metadata = {
  title: 'Flavourite Cafe & Bakery • Handcrafted Artisanal Goodies',
  description: 'Moments are Sweeter with Flavourite. Deliciously handcrafted chocolates, baked goodies, brownies, and gift hampers. 100% vegetarian, made in Samalkot.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  let settings: any = null
  let categories: any[] = []

  try {
    const payload = await getPayload({ config: configPromise })
    settings = await payload.findGlobal({ slug: 'store-settings' })
    const catResult = await payload.find({ 
      collection: 'categories', 
      limit: 12, 
      sort: 'title' 
    })
    categories = catResult.docs
  } catch (err) {
    console.warn('Could not fetch store settings or categories in layout:', err)
  }

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar settings={settings} categories={categories} />
          <main className="flex-grow">{children}</main>
          <Footer settings={settings} categories={categories} />
        </div>
      </body>
    </html>
  )
}
