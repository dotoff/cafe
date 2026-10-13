import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="bg-gradient-to-r from-brand-dark to-brand-medium text-white py-16 text-center">
        <h1 className="text-4xl font-serif mb-4">Contact Us</h1>
        <p className="text-white/80 text-sm">
          <Link href="/" className="hover:text-white">Home</Link> <span className="mx-2">›</span> Contact Us
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="bg-white border border-gray-100 p-10 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-serif text-brand-dark mb-6">Send a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark outline-none transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark outline-none transition-colors" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark outline-none transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-brand-medium transition-colors">
                Send Message
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h2 className="text-3xl font-serif text-brand-dark mb-4">We'd Love to Hear from You</h2>
              <p className="text-gray-600 leading-relaxed">
                Have a question, feedback, or want to place a bulk order? Drop us a message or reach out using the details below.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <div className="text-3xl">📍</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Visit Us</h4>
                  <p className="text-gray-500 text-sm">Flavourite Food & Beverage<br/>Shop No. 12, Jubilee Hills Road 36<br/>Hyderabad, Telangana 500033</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <div className="text-3xl">📞</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Call / WhatsApp</h4>
                  <p className="text-gray-500 text-sm">+91 70132 05977 / +91 90006 85718</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <div className="text-3xl">✉️</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                  <p className="text-gray-500 text-sm">hello@flavourite.in</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
