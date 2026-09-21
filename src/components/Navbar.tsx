'use client'

import { useState } from 'react'
import { Menu, X, Zap, Lock, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/components/CartContext'

function FlowellLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src="/images/flowell-logo.jpg"
      alt="FLOWELL"
      className={className}
      style={{ objectFit: 'cover', display: 'block' }}
    />
  )
}

const navLinks = [
  { href: '/merch/', label: 'Merch', primary: true },
  { href: '/packs/', label: 'Packs' },
  { href: '/vault/', label: 'The Vault', premium: true },
  { href: '/music/', label: 'Music' },
  { href: '/about/', label: 'About' },
  { href: '/press/', label: 'Press' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, setOpen } = useCart()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      {/* Logo pinned to far left */}
      <Link href="/" className="absolute left-0 top-0 h-16 flex items-center pl-4 z-10">
        <FlowellLogo className="h-14 w-14 rounded-none" />
      </Link>

      {/* Nav links centered */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-center">
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors flex items-center gap-1.5 ${
                link.premium
                  ? 'text-[#f1c40f] hover:text-white'
                  : 'text-white/60 hover:text-[#f1c40f]'
              }`}
            >
              {link.premium && <Lock className="w-3 h-3" />}
              {link.label}
            </Link>
          ))}
          <Link
            href="/subscribe/"
            className="text-xs font-bold tracking-[0.2em] uppercase text-[#f1c40f] hover:text-white transition-colors"
          >
            Free Beat
          </Link>
          <Link
            href="/beats/"
            className="btn-primary text-xs py-2 px-4"
          >
            <Zap className="w-3 h-3" />
            Shop Beats
          </Link>

          {/* Cart icon with live count */}
          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center justify-center w-9 h-9 border border-white/10 hover:border-[#f1c40f] transition-colors ml-2"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-4 h-4 text-white/70 hover:text-[#f1c40f]" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#f1c40f] text-black text-[10px] font-black flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-black border-b border-white/10 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block text-sm font-bold tracking-wider uppercase transition-colors flex items-center gap-2 ${
                link.premium
                  ? 'text-[#f1c40f] hover:text-white'
                  : 'text-white/60 hover:text-[#f1c40f]'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.premium && <Lock className="w-3.5 h-3.5" />}
              {link.label}
            </Link>
          ))}
          <Link
            href="/subscribe/"
            className="block text-sm font-bold tracking-wider uppercase text-[#f1c40f] hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            Free Beat
          </Link>
          <button
            onClick={() => { setMobileOpen(false); setOpen(true) }}
            className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-white/60 hover:text-[#f1c40f]"
          >
            <ShoppingBag className="w-4 h-4" />
            Cart {count > 0 && `(${count})`}
          </button>
        </div>
      )}
    </nav>
  )
}
