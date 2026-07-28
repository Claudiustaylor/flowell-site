'use client'

import { Music, Zap, Gift, Mail } from 'lucide-react'
import { SubscribeForm } from '@/components/SubscribeForm'

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-20">
      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.06)_0%,_transparent_70%)]" />

      <div className="relative max-w-2xl w-full text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f1c40f]/10 border border-[#f1c40f]/20 mb-8">
          <Zap className="w-3 h-3 text-[#f1c40f]" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#f1c40f]">FEARS · September 4</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6">
          GET A FREE BEAT.<br />
          <span className="text-[#f1c40f]">HEAR FEARS FIRST.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-white/50 mb-10 max-w-lg mx-auto leading-relaxed">
          Join the list and get an exclusive beat download instantly. Plus early access to the FEARS album before it drops September 4.
        </p>

        {/* Value props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-lg mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10">
              <Gift className="w-5 h-5 text-[#f1c40f]" />
            </div>
            <p className="text-xs text-white/40">Free beat<br />download</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10">
              <Music className="w-5 h-5 text-[#f1c40f]" />
            </div>
            <p className="text-xs text-white/40">Early FEARS<br />access</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10">
              <Mail className="w-5 h-5 text-[#f1c40f]" />
            </div>
            <p className="text-xs text-white/40">No spam.<br />Unsubscribe anytime</p>
          </div>
        </div>

        {/* Form */}
        <SubscribeForm source="subscribe-page" />

        {/* Trust line */}
        <p className="text-white/20 text-xs mt-8">
          The fear was never the beats. It was whether anyone would hear ME.
        </p>
      </div>
    </div>
  )
}