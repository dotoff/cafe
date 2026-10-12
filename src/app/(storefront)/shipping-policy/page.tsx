import Link from 'next/link'

export const metadata = {
  title: 'Shipping & Delivery Policy | Flavourite Cafe',
  description: 'Shipping and delivery timelines for Flavourite Food & Beverage',
}

export default function ShippingPolicyPage() {
  return (
    <div className="bg-brand-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-serif text-brand-dark mb-6">Shipping & Delivery Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: October 2026</p>

        <div className="prose prose-stone text-gray-700 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Delivery Coverage</h2>
            <p>
              We deliver handcrafted chocolates, brownies, cakes, gift hampers, and herbal teas across Hyderabad and Pan-India:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Local City Deliveries (Hyderabad):</strong> Same-day or next-day delivery via direct courier/rider partners (Dunzo, Porter, Rapido, or in-house logistics).</li>
              <li><strong>Domestic Shipping (Pan India):</strong> Available for non-perishable hampers, chocolates, and packaged herbal teas via standard courier (Bluedart, Delhivery, DTDC). Typically delivered in <strong>3 to 5 business days</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Processing & Baking Times</h2>
            <p>
              All our bakery items are baked fresh in small batches. Orders are usually processed, prepared, and dispatched within <strong>24 to 48 hours</strong> of payment confirmation. Custom or bulk celebration cake orders may require 48 hours prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Shipping Charges</h2>
            <p>
              Shipping fees are calculated transparently at checkout:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Orders above ₹500:</strong> FREE Delivery!</li>
              <li><strong>Standard Delivery:</strong> Flat ₹50 across standard delivery radius.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Order Tracking</h2>
            <p>
              Once your order is dispatched, you will receive an update on WhatsApp or SMS with tracking details or delivery rider contact information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Delivery Inquiries</h2>
            <p>
              For urgent or same-day delivery requests, reach out directly to our kitchen team at +91 70132 05977 or email <a href="mailto:contact@flavourite.com" className="text-brand-dark underline">contact@flavourite.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link href="/" className="text-brand-dark font-medium hover:underline text-sm">
            ← Back to Flavourite Home
          </Link>
        </div>
      </div>
    </div>
  )
}
