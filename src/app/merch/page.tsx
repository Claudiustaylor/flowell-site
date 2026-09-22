'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Zap, Disc3, ArrowRight, Plus, Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react'
import { useCart } from '@/components/CartContext'
import { MERCH_PRODUCTS, MERCH_CATEGORIES, getMerchProduct, type MerchProduct } from '@/lib/merch'

/** Live overrides from the Printful store (dashboard edits propagate here). */
type LiveOverride = { id: string; name: string; price: number; outOfStockSizes: string[] }

export default function MerchPage() {
  const { add, count, setOpen } = useCart()
  const [category, setCategory] = useState('all')
  const [quickView, setQuickView] = useState<string | null>(null)
  const [quickViewBack, setQuickViewBack] = useState(false)
  const [size, setSize] = useState<string>('M')
  const [live, setLive] = useState<Map<string, LiveOverride>>(new Map())
  const [success] = useState(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('checkout') === 'success'
  )

  // Pull Printful-backed price/name/stock overrides (site design stays merch.ts-owned)
  useEffect(() => {
    fetch('/api/merch/live')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.products) return
        const m = new Map<string, LiveOverride>()
        for (const p of d.products) {
          m.set(p.id, { id: p.id, name: p.name, price: p.price, outOfStockSizes: p.outOfStockSizes ?? [] })
        }
        setLive(m)
      })
      .catch(() => {})
  }, [])

  /** merch.ts product with live Printful overrides applied. */
  const withLive = (p: MerchProduct): MerchProduct => {
    const o = live.get(p.id)
    if (!o) return p
    return {
      ...p,
      name: o.name || p.name,
      price: o.price > 0 ? o.price : p.price,
    }
  }

  const filtered =
    category === 'all' ? MERCH_PRODUCTS : MERCH_PRODUCTS.filter(p => p.category === category)

  const fmt = (n: number) => `$${n.toFixed(n % 1 ? 2 : 0)}`

  const badgeStyles: Record<string, string> = {
    new: 'bg-[#f1c40f] text-black',
    limited: 'bg-red-500/90 text-white',
    bestseller: 'bg-white text-black',
    collector: 'bg-[#f1c40f]/10 border border-[#f1c40f]/40 text-[#f1c40f]',
  }

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
      {/* ── Checkout success banner ───────────────────────────────────── */}
      {success && (
        <div className="mb-10 border border-[#f1c40f]/40 bg-[#f1c40f]/[0.07] p-5 text-center">
          <p className="text-sm font-black text-[#f1c40f] mb-1">★ ORDER CONFIRMED</p>
          <p className="text-xs text-white/70">
            Check your inbox — order confirmation and tracking are on the way. First pressing ships within 5 business days.
          </p>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="text-center mb-14">
        <p className="section-label">Official Store</p>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-4">MERCH</h1>
        <p className="text-white/70 max-w-lg mx-auto">
          The FEARS first pressing. Vinyl, apparel and collectibles — limited runs, hand-numbered, built to last.
        </p>
      </div>

      {/* ── Trust bar ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-14 max-w-3xl mx-auto">
        {[
          { icon: Truck, text: 'Free shipping over $75' },
          { icon: RotateCcw, text: '30-day returns' },
          { icon: ShieldCheck, text: 'Secure Stripe checkout' },
        ].map(t => (
          <div key={t.text} className="flex items-center justify-center gap-2 border border-white/10 py-3 px-2">
            <t.icon className="w-4 h-4 text-[#f1c40f] flex-shrink-0" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-white/60">{t.text}</span>
          </div>
        ))}
      </div>

      {/* ── Category tabs ───────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {MERCH_CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase border transition-colors ${
              category === c.id
                ? 'border-[#f1c40f] text-[#f1c40f]'
                : 'border-white/10 text-white/60 hover:border-white/30'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Product grid ────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(raw => {
          const p = withLive(raw)
          return (
          <div key={p.id} className="group border border-white/10 hover:border-[#f1c40f]/40 transition-all bg-black flex flex-col">
            {/* Image area */}
            <div className="relative aspect-square bg-neutral-950 overflow-hidden flex items-center justify-center">
              {p.image ? (
                <>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-0"
                  />
                  {p.imageBack && (
                    <img
                      src={p.imageBack}
                      alt={`${p.name} — back`}
                      className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.05)_0%,_transparent_70%)]">
                  {p.category === 'vinyl' && <Disc3 className="w-16 h-16 text-[#f1c40f]/60" />}
                  {p.category === 'apparel' && <ShoppingBag className="w-14 h-14 text-[#f1c40f]/60" />}
                  {p.category === 'bundle' && <Sparkles className="w-14 h-14 text-[#f1c40f]/60" />}
                  {p.category === 'collectible' && <Zap className="w-14 h-14 text-[#f1c40f]/60" />}
                  {p.category === 'digital' && <Zap className="w-16 h-16 text-[#f1c40f]/60" />}
                  <span className="text-xs font-black tracking-[0.3em] uppercase text-white/45">{p.name}</span>
                </div>
              )}
              {p.badge && (
                <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black tracking-[0.15em] uppercase ${badgeStyles[p.badge]}`}>
                  {p.badge}
                </span>
              )}
              {/* Quick view button */}
              <button
                onClick={() => { setQuickViewBack(false); setQuickView(p.id) }}
                className="absolute bottom-3 right-3 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase bg-black/80 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:border-[#f1c40f] hover:text-[#f1c40f]"
              >
                Quick View
              </button>
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-base font-bold italic tracking-tight mb-1">{p.name}</h3>
              <p className="text-xs text-white/55 leading-relaxed mb-4 flex-1">{p.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black">{fmt(p.price)}</span>
                  {p.compareAt && <span className="text-xs text-white/45 line-through">{fmt(p.compareAt)}</span>}
                </div>
                {p.stock !== undefined && p.stock < 100 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                    {p.stock} left
                  </span>
                )}
              </div>

              {/* Apparel sizes inline */}
              {p.category === 'apparel' && (
                <div className="flex gap-1.5 mb-4">
                  {['S', 'M', 'L', 'XL'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`w-9 h-9 text-xs font-bold border transition-colors ${
                        size === s ? 'border-[#f1c40f] text-[#f1c40f]' : 'border-white/10 text-white/55 hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => add(p.id, 1, p.category === 'apparel' ? size : undefined)}
                className="btn-primary w-full justify-center text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            </div>
          </div>
          )
        })}
      </div>

      {/* ── Quick view modal ───────────────────────────────────────── */}
      {quickView && (() => {
        const base = getMerchProduct(quickView)
        if (!base) return null
        const p = withLive(base)
        const crossSells = (p.crossSellIds ?? []).map(getMerchProduct).filter(Boolean)
        return (
          <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setQuickView(null)} />
            <div className="relative max-w-2xl w-full bg-neutral-950 border border-white/10 flex flex-col md:flex-row max-h-[85vh] overflow-y-auto">
              {/* Visual */}
              <div className="md:w-1/2 aspect-square bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.06)_0%,_transparent_70%)] flex items-center justify-center">
                {p.image ? (
                  <>
                  <img src={p.imageBack && quickViewBack ? p.imageBack : p.image} alt={p.name} className="w-full h-full object-contain" />
                  {p.imageBack && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 bg-black/80 border border-white/20 px-1 py-1 z-10">
                      <button
                        onClick={() => setQuickViewBack(false)}
                        className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${!quickViewBack ? 'text-[#f1c40f]' : 'text-white/55 hover:text-white'}`}
                      >Front</button>
                      <button
                        onClick={() => setQuickViewBack(true)}
                        className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${quickViewBack ? 'text-[#f1c40f]' : 'text-white/55 hover:text-white'}`}
                      >Back</button>
                    </div>
                  )}
                  </>
                ) : (
                  <div className="text-center">
                    {p.category === 'vinyl' && <Disc3 className="w-24 h-24 mx-auto mb-3 text-[#f1c40f]/60" />}
                    {p.category === 'apparel' && <ShoppingBag className="w-20 h-20 mx-auto mb-3 text-[#f1c40f]/60" />}
                    {p.category === 'bundle' && <Sparkles className="w-20 h-20 mx-auto mb-3 text-[#f1c40f]/60" />}
                    {p.category === 'collectible' && <Zap className="w-20 h-20 mx-auto mb-3 text-[#f1c40f]/60" />}
                    {p.category === 'digital' && <Zap className="w-24 h-24 mx-auto mb-3 text-[#f1c40f]/60" />}
                    <span className="text-sm font-black tracking-[0.3em] uppercase text-white/45">{p.name}</span>
                  </div>
                )}
              </div>
              {/* Details */}
              <div className="md:w-1/2 p-6 md:p-8">
                {p.badge && (
                  <span className={`inline-block px-2.5 py-1 text-[10px] font-black tracking-[0.15em] uppercase mb-4 ${badgeStyles[p.badge]}`}>
                    {p.badge}
                  </span>
                )}
                <h3 className="text-2xl font-black italic tracking-tight mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-black text-[#f1c40f]">{fmt(p.price)}</span>
                  {p.compareAt && <span className="text-sm text-white/45 line-through">{fmt(p.compareAt)}</span>}
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-6">{p.description}</p>
                <ul className="space-y-2 mb-6">
                  {p.details.map(d => (
                    <li key={d} className="flex items-start gap-2 text-xs text-white/60">
                      <span className="text-[#f1c40f] mt-0.5">▸</span>
                      {d}
                    </li>
                  ))}
                </ul>
                {p.category === 'apparel' && (
                  <div className="flex gap-1.5 mb-6">
                    {['S', 'M', 'L', 'XL'].map(s => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`w-10 h-10 text-xs font-bold border transition-colors ${
                          size === s ? 'border-[#f1c40f] text-[#f1c40f]' : 'border-white/10 text-white/55 hover:border-white/30'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => { add(p.id, 1, p.category === 'apparel' ? size : undefined); setQuickView(null) }}
                  className="btn-primary w-full justify-center text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add to Cart — {fmt(p.price)}
                </button>

                {/* Cross-sells in quick view */}
                {crossSells.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-[11px] font-black tracking-[0.2em] uppercase text-[#f1c40f] mb-3">
                      Pairs well with
                    </p>
                    {crossSells.map(cs => cs && (
                      <button
                        key={cs.id}
                        onClick={() => add(cs.id, 1, cs.category === 'apparel' ? size : undefined)}
                        className="flex items-center gap-3 w-full border border-white/10 p-2 hover:border-[#f1c40f]/50 transition-colors mb-2 text-left"
                      >
                        <div className="w-10 h-10 bg-[#f1c40f]/10 border border-[#f1c40f]/20 flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="w-4 h-4 text-[#f1c40f]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{cs.name}</p>
                          <p className="text-xs text-white/55">{fmt(cs.price)}</p>
                        </div>
                        <Plus className="w-4 h-4 text-[#f1c40f]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Sticky bottom upsell bar ────────────────────────────────── */}
      {count > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[70] bg-neutral-950/95 backdrop-blur-md border-t border-[#f1c40f]/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#f1c40f]" />
            <span className="text-sm font-bold">{count} in cart</span>
            <span className="text-xs text-white/55 hidden sm:inline">Bundle and save — free shipping over $75</span>
          </div>
          <button onClick={() => setOpen(true)} className="btn-primary text-xs whitespace-nowrap">
            View Cart
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}