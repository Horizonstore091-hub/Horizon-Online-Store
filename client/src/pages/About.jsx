export default function About() {
  return (
    <div className="pt-24 md:pt-28">
      <div className="container-wide py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <p className="section-subtitle">About Us</p>
          <h1 className="section-title mt-2 mb-8">Our Story</h1>
          <div className="space-y-6 text-horizon-500 dark:text-horizon-300 text-sm leading-relaxed">
            <p>HORIZON was founded in 2022 with a simple belief: the products you surround yourself with should be exceptional. We set out to curate a collection of the finest essentials — items crafted with care, designed to last, and made by makers who take pride in their work.</p>
            <p>Every product in our collection is personally vetted. We visit workshops, test materials, and make sure every piece meets our standards before it reaches you. We don't carry thousands of items — we carry the right ones.</p>
            <p>Our team is based in New York with partners around the globe, from leather artisans in Florence to watchmakers in the Swiss Jura. We believe in slow commerce: thoughtful buying, lasting quality, and relationships built on trust.</p>
            <h2 className="text-xl font-display font-bold text-horizon-900 dark:text-horizon-100 pt-6">Our Promise</h2>
            <p>Every order is backed by our 30-day satisfaction guarantee. If you're not happy, we'll make it right — no questions asked. We also offset carbon emissions on every shipment and use plastic-free packaging.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-horizon-100 dark:border-horizon-700">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '15K+', label: 'Orders Shipped' },
              { value: '4.9', label: 'Average Rating' },
              { value: '30 Day', label: 'Free Returns' },
            ].map(s => (
              <div key={s.label} className="text-center"><p className="text-2xl font-bold text-horizon-900 dark:text-horizon-100">{s.value}</p><p className="text-xs text-horizon-400 uppercase tracking-wider mt-1">{s.label}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
