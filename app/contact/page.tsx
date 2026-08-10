export default function ContactPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20 relative z-20">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-custom-forest font-bold mb-4">Contact Us</h1>
          <p className="text-custom-charcoal/80 max-w-2xl mx-auto">
            Have a question about a custom order, our process, or shipping? Reach out to our workshop directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-custom-cream rounded-xl shadow-xl shadow-custom-forest/5 p-8 md:p-12 border border-white/50">
          
          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <h3 className="font-serif text-2xl text-custom-forest mb-6">Workshop Details</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-custom-gold mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div>
                  <h4 className="font-bold text-custom-charcoal text-sm uppercase tracking-wider mb-1">Address</h4>
                  <p className="text-custom-muted">Oreshaka 9<br/>6100 Kazanlak<br/>Bulgaria</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 text-custom-gold mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <div>
                  <h4 className="font-bold text-custom-charcoal text-sm uppercase tracking-wider mb-1">Phone</h4>
                  <p className="text-custom-muted">+359 87 843 7966</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 text-custom-gold mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <div>
                  <h4 className="font-bold text-custom-charcoal text-sm uppercase tracking-wider mb-1">Email</h4>
                  <p className="text-custom-muted">info@kazanlakwoodcarving.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-serif text-2xl text-custom-forest mb-6">Send a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-custom-charcoal uppercase tracking-wider mb-2">Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-custom-gold focus:bg-white transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-custom-charcoal uppercase tracking-wider mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-custom-gold focus:bg-white transition-colors" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-custom-charcoal uppercase tracking-wider mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-custom-gold focus:bg-white transition-colors" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full py-4 bg-custom-forest hover:bg-custom-forest/90 text-white font-bold tracking-widest uppercase text-sm rounded shadow-md transition-colors mt-4">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
