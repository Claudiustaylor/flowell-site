'use client'

import { useEffect, useState } from 'react'
import { X, Zap, Timer } from 'lucide-react'
import { useCart } from '@/components/CartContext'

/**
 * Exit-intent popup.
 *
 * Desktop: fires when the cursor leaves the viewport top (the classic
 * abandonment moment). Mobile: fires after 25 seconds of dwell with no
 * interaction. Once shown, suppressed for 7 days (localStorage), so a
 * returning visitor is not nagged.
 *
 * The offer: 10% off the first pressing merch. The code is shown after
 * the email is captured — capturing the email is worth more than the
 * discount itself, because it feeds the abandoned-cart recovery sequence.
 */
export function ExitIntentPopup() {
  const { count } = useCart()
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const until = parseInt(localStorage.getItem('flowell-exit-suppressed') || '0', 10)
      if (Date.now() < until) return
    } catch {}

    let shown = false
    const fire = () => {
      if (shown) return
      // Do not fire on shoppers with an open cart — the cart drawer email
      // capture handles them, and a discount popup on top of it is noise.
      if (count > 0) return
      shown = true
      setShow(true)
      try {
        localStorage.setItem('flowell-exit-suppressed', String(Date.now() + 7 * 24 * 3600 * 1000))
      } catch {}
    }

    // Desktop exit intent
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) fire()
    }
    document.addEventListener('mouseout', onLeave)

    // Mobile dwell timer
    const t = setTimeout(fire, 25000)

    return () => {
      document.removeEventListener('mouseout', onLeave)
      clearTimeout(t)
    }
  }, [count])

  async function submit() {
    if (!email || !email.includes('@')) return
    setLoading(true)
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exit-intent-popup' }),
      })
      setCode('FEARS10')
    } catch {}
    setLoading(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShow(false)} />
      <div className="relative max-w-md w-full bg-neutral-950 border border-[#f1c40f]/40 p-8 md:p-10 text-center">
        {/* Corner accents — same handcrafted frame as the FEARS section */}
        <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#f1c40f]" />
        <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#f1c40f]" />
        <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#f1c40f]" />
        <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#f1c40f]" />

        <button
          onClick={() => setShow(false)}
          className="absolute -top-3 -right-3 w-9 h-9 bg-neutral-950 border border-white/15 flex items-center justify-center hover:border-[#f1c40f] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!code ? (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f1c40f] text-black mb-6">
              <Timer className="w-3.5 h-3.5" />
              <span className="text-[11px] font-black tracking-[0.25em] uppercase">Wait — First Pressing</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-4">
              10% OFF<br />THE FEARS DROP
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Vinyl, apparel, collectibles — everything in the store. The first pressing is
              limited. Take 10% off before you go.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 focus:border-[#f1c40f] text-white placeholder-white/40 text-base outline-none transition-colors"
              />
              <button onClick={submit} disabled={loading} className="btn-primary w-full justify-center text-sm disabled:opacity-50">
                <Zap className="w-4 h-4" />
                {loading ? 'Sending...' : 'Give Me The Code'}
              </button>
            </div>
            <p className="text-[11px] text-white/40 mt-4">
              No spam. Just beats, drops and early access. Unsubscribe anytime.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#f1c40f]/10 border border-[#f1c40f]/30">
              <Zap className="w-7 h-7 text-[#f1c40f]" />
            </div>
            <h3 className="text-2xl font-black italic tracking-tight mb-3">YOU&apos;RE IN.</h3>
            <p className="text-sm text-white/60 mb-6">
              Your code for the first pressing:
            </p>
            <div className="border border-[#f1c40f] border-dashed bg-[#f1c40f]/[0.06] px-6 py-4 mb-6">
              <span className="text-2xl font-black tracking-[0.3em] text-[#f1c40f]">FEARS10</span>
            </div>
            <a href="/merch/" className="btn-primary w-full justify-center text-sm">
              Shop The FEARS Store
            </a>
            <p className="text-[11px] text-white/40 mt-4">
              Code applied at checkout. Valid on everything.
            </p>
          </>
        )}
      </div>

    </div>
  )
}