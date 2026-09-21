'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { MerchProduct } from '@/lib/merch'
import { getMerchProduct } from '@/lib/merch'

export type CartItem = {
  productId: string
  qty: number
  size?: string
}

type CartContextValue = {
  items: CartItem[]
  open: boolean
  setOpen: (v: boolean) => void
  add: (productId: string, qty?: number, size?: string) => void
  remove: (productId: string, size?: string) => void
  setQty: (productId: string, qty: number, size?: string) => void
  clear: () => void
  count: number
  subtotal: number
  lineItems: (CartItem & { product: MerchProduct })[]
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'flowell-cart-v1'
const ABANDONED_KEY = 'flowell-abandoned-cart-v1'
const ABANDONED_EMAIL_SENT_KEY = 'flowell-abandoned-email-at-v1'

/** Cart + abandoned-cart persistence. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)
  const hydrated = useRef(false)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
    hydrated.current = true
  }, [])

  // Persist on change + abandoned-cart capture
  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))

      // ── Abandoned cart logic ────────────────────────────────────────
      // The cart has items and the visitor has not checked out. Record
      // the abandonment snapshot the moment the cart becomes non-empty
      // (so we capture even quick bounces) and refresh it as items
      // change. Cleared on checkout success.
      if (items.length > 0) {
        const snapshot = {
          items,
          at: Date.now(),
          recovered: false,
        }
        localStorage.setItem(ABANDONED_KEY, JSON.stringify(snapshot))
      } else {
        localStorage.removeItem(ABANDONED_KEY)
      }
    } catch {}
  }, [items])

  const add = useCallback((productId: string, qty = 1, size?: string) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.productId === productId && i.size === size)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + qty }
        return next
      }
      return [...prev, { productId, qty, size }]
    })
    setOpen(true)
  }, [])

  const remove = useCallback((productId: string, size?: string) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)))
  }, [])

  const setQty = useCallback((productId: string, qty: number, size?: string) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)))
      return
    }
    setItems(prev =>
      prev.map(i => (i.productId === productId && i.size === size ? { ...i, qty } : i))
    )
  }, [])

  const clear = useCallback(() => {
    setItems([])
    try {
      localStorage.removeItem(ABANDONED_KEY)
      localStorage.removeItem(ABANDONED_EMAIL_SENT_KEY)
    } catch {}
  }, [])

  const count = items.reduce((n, i) => n + i.qty, 0)
  const lineItems = items
    .map(i => ({ ...i, product: getMerchProduct(i.productId) }))
    .filter((i): i is CartItem & { product: MerchProduct } => Boolean(i.product))
  const subtotal = lineItems.reduce((sum, i) => sum + i.product.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items, open, setOpen, add, remove, setQty, clear, count, subtotal, lineItems }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}