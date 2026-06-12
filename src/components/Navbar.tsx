'use client'

import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import Link from 'next/link'

function FlowellLogo({ className = 'w-32' }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="200" fill="black"/>
      <g fontFamily="system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif" fontStyle="italic" fontWeight="900" fontSize="96" fill="white">
        <text x="40" y="135" letterSpacing="-2">FLOWELL</text>
      </g>
      <polygon points="258,45 320,82 285,85 345,125 270,95 295,92 235,55" fill="#F1C40F"/>
    </svg>
  )
}

const navLinks = [
  { href: '/beats/', label: 'Beats' },
  { href: '/packs/', label: 'Packs' },
  { href: '/music/', label: 'Music' },
  { href: '/about/', label: 'About' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <FlowellLogo className="h-8 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-bold tracking-[0.2em] uppercase text-white/60 hover:text-[#f1c40f] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/beats/"
            className="btn-primary text-xs py-2 px-4"
          >
            <Zap className="w-3 h-3" />
            Shop Beats
          </Link>
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
              className="block text-sm font-bold tracking-wider uppercase text-white/60 hover:text-[#f1c40f]"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
