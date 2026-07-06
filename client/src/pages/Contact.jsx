import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      })
      if (res.ok) { setSent(true); setForm({ name: '', email: '', subject: '', message: '' }) }
    } catch {}
  }

  return (
    <div className="pt-24 md:pt-28">
      <div className="container-wide py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <p className="section-subtitle">Get in Touch</p>
          <h1 className="section-title mt-2 mb-8">Contact Us</h1>
          {sent ? (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-lg font-semibold text-horizon-900 dark:text-horizon-100 mb-2">Message Sent!</h2>
              <p className="text-sm text-horizon-400">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="btn-ghost mt-4">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" required className="input-field" />
                <input name="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email address" required className="input-field" />
              </div>
              <input name="subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subject (optional)" className="input-field" />
              <textarea name="message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Your message..." required rows={5} className="input-field resize-none" />
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
