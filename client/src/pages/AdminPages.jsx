import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminPages() {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    fetch('/api/admin/pages').then(r => r.json()).then(setSettings).catch(() => {})
  }, [])

  const update = (key, value) => {
    setSettings(s => ({ ...s, [key]: value }))
  }

  const save = () => {
    fetch('/api/admin/pages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).then(() => alert('Settings saved!')).catch(() => {})
  }

  return (
    <div className="min-h-screen bg-horizon-50 dark:bg-horizon-900">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="text-2xl font-display font-bold text-horizon-900 dark:text-horizon-100 mb-8">Page Editor</h1>

        <div className="bg-white dark:bg-horizon-800 p-6 space-y-6">
          <Field label="Homepage Hero Title" value={settings.home_hero_title || ''} onChange={v => update('home_hero_title', v)} />
          <Field label="Homepage Hero Subtitle" value={settings.home_hero_subtitle || ''} onChange={v => update('home_hero_subtitle', v)} />
          <Field label="Ads Countdown Target (ISO date)" value={settings.ads_countdown_target || ''} onChange={v => update('ads_countdown_target', v)} />
          <Field label="Ads Countdown Message" value={settings.ads_countdown_message || ''} onChange={v => update('ads_countdown_message', v)} />
          <Field label="Support Email" value={settings.support_email || ''} onChange={v => update('support_email', v)} />

          <h2 className="text-lg font-display font-bold text-horizon-900 dark:text-horizon-100 pt-4 border-t border-horizon-100 dark:border-horizon-700">Slideshow</h2>

          {[1, 2, 3].map(i => (
            <div key={i} className="border border-horizon-100 dark:border-horizon-700 p-4 space-y-3 rounded">
              <p className="text-[10px] uppercase tracking-wider text-horizon-400 font-medium">Slide {i}</p>
              <Field label={`Slide ${i} Image URL`} value={settings[`slideshow_slide${i}_image`] || ''} onChange={v => update(`slideshow_slide${i}_image`, v)} />
              <Field label={`Slide ${i} Title`} value={settings[`slideshow_slide${i}_title`] || ''} onChange={v => update(`slideshow_slide${i}_title`, v)} />
              <Field label={`Slide ${i} Subtitle`} value={settings[`slideshow_slide${i}_subtitle`] || ''} onChange={v => update(`slideshow_slide${i}_subtitle`, v)} />
            </div>
          ))}

          <h2 className="text-lg font-display font-bold text-horizon-900 dark:text-horizon-100 pt-4 border-t border-horizon-100 dark:border-horizon-700">Promo Banner</h2>

          <Field label="Promo Banner Enabled (1=on, 0=off)" value={settings.promo_banner_enabled || '0'} onChange={v => update('promo_banner_enabled', v)} />
          <Field label="Promo Banner Text" value={settings.promo_banner_text || ''} onChange={v => update('promo_banner_text', v)} />
          <Field label="Promo Countdown Target (ISO date)" value={settings.promo_banner_target || ''} onChange={v => update('promo_banner_target', v)} />

          <button onClick={save} className="btn-primary text-xs">Save All Settings</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-horizon-400 font-medium mb-1">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="input-field text-sm" />
    </div>
  )
}
