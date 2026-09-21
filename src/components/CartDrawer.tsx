'use client'

import { useState } from 'react'
import { X, ShoppingBag, Plus, Minus, Trash2, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useCart } from '@/components/CartContext'
import { getMerchProduct, MERCH_PRODUCTS } from '@/lib/merch'

export function CartDrawer() {
  const { open, setOpen, lineItems, setQty, remove, subtotal, count, add } = useCart()
  const [email, setEmail] = useState('')
  const [emailSaved, setEmailSaved] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  if (!open) return null

  // ── In-cart cross-sells ─────────────────────────────────────────────
  // Products the shopper has not added, that cross-sell from anything in
  // the cart. Cheap add-ons dominate here (posters, cassettes, tees).
  const inCart = new Set(lineItems.map(li => li.productId))
  const recs = MERCH_PRODUCTS.filter(p => {
    if (inCart.has(p.id)) return false
    const cross = lineItems.some(li => li.product.crossSellIds?.includes(p.id))
    return cross && p.price <= 60
  }).slice(0, 2)
  const fallbackRecs = MERCH_PRODUCTS.filter(p => !inCart.has(p.id) && p.price <= 45).slice(0, 2)
  const shown = recs.length > 0 ? recs : fallbackRecs

  const fmt = (n: number) => `$${n.toFixed(n % 1 ? 2 : 0)}`

  async function handleCheckout() {
    setCheckingOut(true)
    setCheckoutError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lineItems.map(li => ({ productId: li.productId, qty: li.qty, size: li.size })),
          email: email || undefined,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return // page is navigating
      }
      setCheckoutError(
        data.message ?? 'Checkout is not wired to Stripe yet. Add STRIPE_SECRET_KEY to enable it.'
      )
    } catch {
      setCheckoutError('Could not reach checkout. Check your connection and try again.')
    }
    setCheckingOut(false)
  }

  async function saveEmail() {
    if (!email || !email.includes('@')) return
    try {
      // Save as abandoned-cart lead — powers the recovery email sequence
      const snapshot = JSON.parse(localStorage.getItem('flowell-abandoned-cart-v1') || '{}')
      localStorage.setItem(
        'flowell-abandoned-email-v1',
        JSON.stringify({ email, items: lineItems.map(li => ({ id: li.productId, qty: li.qty })), at: Date.now() })
      )
      await fetch('/api/abandoned-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, items: lineItems, subtotal }),
      })
      setEmailSaved(true)
      void snapshot
    } catch {}
  }

  // ── Free-shipping progress nudge (order-value up-sell) ───────────────
  const FREE_SHIP = 75
  const toFreeShip = Math.max(0, FREE_SHIP - subtotal)
  const shipPct = Math.min(100, (subtotal / FREE_SHIP) * 100)

  // ── Post-checkout up-sell suggestion (bundle push) ───────────────────
  // Suggests upgrading a hoodie/tee order to the Vault Bundle if the cart
  // is one apparel item — the classic "you're $X from the better deal" push.
  const singleApparel = lineItems.length === 1 && lineItems[0].product.category === 'apparel'
  const bundle = getMerchProduct('fears-vault-bundle')
  // Bundle value vs its parts — from the catalog: $195 worth for $149, so buying the
  // bundle INSTEAD of a $55 hoodie means paying $94 more for $140 more stuff.
  // Frame it as what they GET extra, not fake "savings" over the hoodie.
  const bundleDelta =
    singleApparel && bundle && !lineItems[0].product.id.includes('bundle')
      ? { extraCost: bundle.price - subtotal, bundleValue: (bundle.compareAt ?? bundle.price) - bundle.price }
      : null
  const bundleUpsell = bundleDelta && bundleDelta.extraCost > 0 && bundle
    ? `Swap for the Vault Bundle: ${fmt(bundle.price)} gets you vinyl + hoodie + tee + poster + cassette (worth $${(bundle.compareAt ?? bundle.price).toFixed(0)}).`
    : null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]"
        onClick={() => setOpen(false)}
      />
      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-neutral-950 border-l border-white/10 z-[90] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#f1c40f]" />
            <h2 className="text-lg font-black italic tracking-tight">YOUR CART</h2>
            {count > 0 && (
              <span className="text-xs font-mono text-white/55">{count} item{count !== 1 ? 's' : ''}</span>
            )}
          </div>
          <button onClick={() => setOpen(false)} className="w-9 h-9 flex items-center justify-center border border-white/10 hover:border-[#f1c40f] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lineItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-10 h-10 mx-auto mb-4 text-white/30" />
              <p className="text-sm text-white/55 mb-6">Your cart is empty.</p>
              <button onClick={() => setOpen(false)} className="btn-outline text-xs">
                Keep Browsing
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {lineItems.map(li => (
                <div key={li.productId + (li.size ?? '')} className="flex gap-4 border border-white/10 p-3">
                  {li.product.image ? (
                    <img src={li.product.image} alt={li.product.name} className="w-16 h-16 object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-[#f1c40f]/10 border border-[#f1c40f]/20 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-[#f1c40f]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold tracking-wide truncate">{li.product.name}</p>
                    {li.size && <p className="text-xs text-white/55">Size {li.size}</p>}
                    <p className="text-sm font-black text-[#f1c40f] mt-1">{fmt(li.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => setQty(li.productId, li.qty - 1, li.size)} className="w-6 h-6 flex items-center justify-center border border-white/10 text-xs hover:border-[#f1c40f]">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono w-6 text-center">{li.qty}</span>
                      <button onClick={() => setQty(li.productId, li.qty + 1, li.size)} className="w-6 h-6 flex items-center justify-center border border-white/10 text-xs hover:border-[#f1c40f]">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => remove(li.productId, li.size)} className="ml-auto w-6 h-6 flex items-center justify-center text-white/40 hover:text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* ── In-cart cross-sell ─────────────────────────────── */}
              {shown.length > 0 && (
                <div className="border border-[#f1c40f]/25 bg-[#f1c40f]/[0.04] p-4">
                  <p className="text-[11px] font-black tracking-[0.2em] uppercase text-[#f1c40f] mb-3">
                    Complete the fit
                  </p>
                  {shown.map(p => (
                    <div key={p.id} className="flex items-center gap-3 py-2">
                      <div className="w-10 h-10 bg-[#f1c40f]/10 border border-[#f1c40f]/20 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-[#f1c40f]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{p.name}</p>
                        <p className="text-xs text-white/55">{fmt(p.price)}</p>
                      </div>
                      <button onClick={() => add(p.id)} className="text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 bg-[#f1c40f] text-black hover:bg-[#f1c40f]/90 transition-colors">
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Save cart / abandoned-cart email capture ────────── */}
              {!emailSaved ? (
                <div className="border border-white/10 p-4">
                  <p className="text-xs text-white/60 mb-2">
                    <strong className="text-white">Save your cart.</strong> Get the link in your inbox before the first pressing sells out.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-sm focus:border-[#f1c40f] outline-none placeholder-white/40"
                    />
                    <button onClick={saveEmail} className="btn-outline text-xs whitespace-nowrap">
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-[#f1c40f]/30 bg-[#f1c40f]/[0.06] p-4 text-center">
                  <p className="text-xs text-white/70">
                    <span className="text-[#f1c40f] font-bold">Saved.</span> Check your inbox — the cart link and a code are on the way.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {lineItems.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5 space-y-4">
            {/* Free-shipping progress nudge */}
            {toFreeShip > 0 ? (
              <div className="border border-white/10 p-3">
                <p className="text-xs text-white/70 mb-2">
                  You&apos;re <span className="font-black text-[#f1c40f]">${toFreeShip.toFixed(0)}</span> away from{' '}
                  <span className="font-bold">free shipping</span>
                </p>
                <div className="h-1.5 bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#f1c40f] transition-all duration-500"
                    style={{ width: `${shipPct}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="border border-[#f1c40f]/30 bg-[#f1c40f]/[0.06] p-3 text-center">
                <p className="text-xs font-bold text-[#f1c40f]">★ Free US shipping unlocked</p>
              </div>
            )}

            {/* Bundle up-sell */}
            {bundleUpsell && (
              <div className="border border-white/10 p-3 flex items-center justify-between gap-3">
                <p className="text-xs text-white/70">{bundleUpsell}</p>
                <button
                  onClick={() => {
                    remove(lineItems[0].productId, lineItems[0].size)
                    add('fears-vault-bundle')
                  }}
                  className="text-[10px] font-black tracking-wider uppercase text-[#f1c40f] border border-[#f1c40f]/40 px-3 py-1.5 whitespace-nowrap hover:bg-[#f1c40f] hover:text-black transition-colors"
                >
                  Switch
                </button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Subtotal</span>
              <span className="text-xl font-black">{fmt(subtotal)}</span>
            </div>
            <p className="text-xs text-white/45">Shipping calculated at checkout. First pressing is limited.</p>
            {checkoutError && (
              <p className="text-xs text-red-400 border border-red-400/30 bg-red-400/10 p-3">{checkoutError}</p>
            )}
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className={`btn-primary w-full justify-center text-sm ${checkingOut ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {checkingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting to Stripe…
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Checkout — {fmt(subtotal)}
                </>
              )}
            </button>
            <p className="text-[11px] text-white/40 text-center">
              Secure checkout via Stripe · 30-day returns
            </p>
          </div>
        )}
      </div>
    </>
  )
}