import Link from 'next/link'

export const metadata = {
  title: 'Terms & Conditions | Flavourite Cafe',
  description: 'Terms and conditions for shopping at Flavourite Food & Beverage',
}

export default function TermsPage() {
  return (
    <div className="bg-brand-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-serif text-brand-dark mb-6">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: October 2026</p>

        <div className="prose prose-stone text-gray-700 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Overview</h2>
            <p>
              This website is operated by Flavourite Food & Beverage. Throughout the site, the terms "we", "us" and "our" refer to Flavourite. By visiting our site and/or purchasing from us, you engage in our "Service" and agree to be bound by the following terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Products & Perishables</h2>
            <p>
              We specialize in freshly handcrafted chocolates, brownies, cakes, tea, and gift hampers. All our bakery products are 100% vegetarian. Because our baked products are fresh and made without artificial preservatives, visual appearance and weight may slightly vary. Product shelf-life guidelines are provided on product packaging.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Pricing & Payments</h2>
            <p>
              All prices listed on our website are in Indian Rupees (INR ₹) and are inclusive or exclusive of applicable Goods and Services Tax (GST) as indicated at checkout. We reserve the right to modify prices without prior notice. Payments can be completed using UPI, WhatsApp Pay, or authorized payment gateways (Razorpay).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Orders & Cancellations</h2>
            <p>
              Orders are confirmed once payment verification is completed. Because baked goods are prepared fresh upon order, cancellations must be requested within 2 hours of placing the order. Once baking or dispatch has commenced, cancellations cannot be accepted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Governing Law & Jurisdiction</h2>
            <p>
              These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India, under the jurisdiction of Hyderabad, Telangana.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Contact Information</h2>
            <p>
              Questions about the Terms of Service should be sent to us at <a href="mailto:contact@flavourite.com" className="text-brand-dark underline">contact@flavourite.com</a> or via phone at +91 70132 05977.
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
