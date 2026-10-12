import Link from 'next/link'

export const metadata = {
  title: 'Refund & Cancellation Policy | Flavourite Cafe',
  description: 'Refund, return and cancellation guidelines for Flavourite Food & Beverage',
}

export default function RefundPolicyPage() {
  return (
    <div className="bg-brand-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-serif text-brand-dark mb-6">Cancellation & Refund Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: October 2026</p>

        <div className="prose prose-stone text-gray-700 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Cancellation Policy</h2>
            <p>
              Due to the perishable nature of handcrafted baked goods and gourmet food items, orders can only be cancelled within <strong>2 hours of placing the order</strong>, provided baking preparation has not yet started. To request a cancellation, please message us immediately on WhatsApp at +91 70132 05977 with your Order Number.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Returns (Perishable Food)</h2>
            <p>
              Under Food Safety standards, we do not accept physical returns on perishable food products (chocolates, brownies, cupcakes, cakes, teas) once delivered. However, if your order was delivered damaged, tampered, or incorrect, you are entitled to a free replacement or refund as detailed below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Damaged or Incorrect Items</h2>
            <p>
              If your treats arrive damaged during transit or if an incorrect item was delivered:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Please notify us within <strong>24 hours of delivery</strong>.</li>
              <li>Share a clear photo or video of the parcel and damaged product via WhatsApp (+91 70132 05977) or email (<a href="mailto:contact@flavourite.com" className="text-brand-dark underline">contact@flavourite.com</a>).</li>
              <li>Upon verification, we will immediately initiate an express replacement or a full refund.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Refund Process & Timelines</h2>
            <p>
              Approved refunds will be processed to the original payment source (Bank Account, UPI, or Credit/Debit card).
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>UPI / Direct Payments:</strong> Processed within 24 to 48 hours.</li>
              <li><strong>Payment Gateway (Razorpay / Credit/Debit Cards):</strong> Refunded within <strong>5 to 7 business days</strong> depending on your bank's processing schedule.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Need Help?</h2>
            <p>
              For any questions regarding cancellations or refunds, our customer care is available at +91 70132 05977 or <a href="mailto:contact@flavourite.com" className="text-brand-dark underline">contact@flavourite.com</a>.
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
