export default function FAQ() {
  const faqs = [
    { q: 'What is your return policy?', a: 'We offer a 30-day return policy. Items must be unused and in their original packaging. Contact our support team to initiate a return, and we will provide a prepaid shipping label.' },
    { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days within the US. Express shipping (2-3 days) and overnight options are available. International shipping typically takes 7-14 business days.' },
    { q: 'Do you offer free shipping?', a: 'Yes, we offer free standard shipping on all orders over $200. Express and overnight shipping rates are calculated at checkout.' },
    { q: 'How can I track my order?', a: 'Once your order ships, you will receive a confirmation email with a tracking number. You can also view your order status in your account under Order History.' },
    { q: 'Is my payment information secure?', a: 'Absolutely. We use 256-bit SSL encryption and process all payments through PCI-compliant partners. Your payment details are never stored on our servers.' },
    { q: 'Do you ship internationally?', a: 'Yes, we ship to over 40 countries. International shipping rates and delivery times vary by destination. Duties and taxes may apply and are the responsibility of the customer.' },
    { q: 'Can I change or cancel my order?', a: 'You can modify or cancel your order within 1 hour of placement. After that, the order enters processing and cannot be changed. Contact us immediately for assistance.' },
    { q: 'How do I contact customer support?', a: 'You can reach us through our contact form, email us at support@horizonstore.com, or use the live chat feature on our website. We typically respond within 2-4 hours during business hours.' },
  ]

  return (
    <div className="pt-24 md:pt-28">
      <div className="container-wide py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <p className="section-subtitle">Help</p>
          <h1 className="section-title mt-2 mb-8">Frequently Asked Questions</h1>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="card group">
                <summary className="px-6 py-4 cursor-pointer text-sm font-medium text-horizon-900 dark:text-horizon-100 hover:text-horizon-600 dark:hover:text-horizon-300 transition-colors flex items-center justify-between list-none">
                  {faq.q}
                  <svg className="w-4 h-4 text-horizon-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </summary>
                <div className="px-6 pb-4 text-sm text-horizon-500 dark:text-horizon-300 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-sm text-horizon-400 mb-4">Still have questions?</p>
            <a href="/contact" className="btn-primary">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}
