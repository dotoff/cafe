import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Flavourite Cafe',
  description: 'Privacy Policy for Flavourite Food & Beverage',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-brand-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-serif text-brand-dark mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: October 2026</p>

        <div className="prose prose-stone text-gray-700 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              When you purchase something from our cafe, as part of the buying and selling process, we collect the personal information you give us such as your name, delivery address, phone number, and email address. This information is strictly used to fulfill your order and communicate order status.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Payment Security</h2>
            <p>
              If you choose a direct payment gateway (such as Razorpay) to complete your purchase, your transaction data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS). Flavourite does not store or process your credit/debit card numbers or CVV on our own servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Disclosure & Sharing</h2>
            <p>
              We do not sell, rent, or trade your personal information. We only share customer contact details and addresses with verified delivery partners (such as Dunzo, Porter, or courier services) solely for order delivery.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Communications</h2>
            <p>
              We may send transactional WhatsApp messages, SMS, or emails regarding your order receipt, baking updates, and delivery tracking.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Contact Us</h2>
            <p>
              If you would like to access, correct, or delete any personal information we have about you, reach us at <a href="mailto:contact@flavourite.com" className="text-brand-dark underline">contact@flavourite.com</a> or phone +91 70132 05977.
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
