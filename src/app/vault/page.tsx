'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock, Music, Download, Headphones, Users, TrendingUp, Check, ArrowRight } from 'lucide-react'
import { SubscribeForm } from '@/components/SubscribeForm'

export default function VaultPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  const features = [
    { icon: Music, title: '1,000+ Beats', desc: 'The complete Flowell archive. Every beat I\'ve ever produced, from type beats to unreleased sessions.' },
    { icon: Download, title: 'Unlimited Downloads', desc: 'Download and stream every beat in the vault. No per-track fees, no limits, no catch.' },
    { icon: Headphones, title: 'Studio Quality', desc: 'WAV files, professionally mixed and mastered. Ready for your recording sessions.' },
    { icon: Users, title: 'Producer Marketplace', desc: 'Other producers will be able to sell their beats in The Vault. I take 5% of every sale.' },
  ]

  const tiers = [
    {
      name: 'The Vault',
      price: 50,
      period: 'month',
      desc: 'Full access to 1,000+ beats. Cancel anytime.',
      features: [
        '1,000+ beats in the archive',
        'Unlimited downloads and streaming',
        'WAV quality audio files',
        'New beats added weekly',
        'Cancel anytime',
      ],
      cta: 'Get Early Access',
      highlighted: true,
    },
  ]

  return (
    <div className="bg-black min-h-screen">
      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.08)_0%,_transparent_70%)]" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f1c40f]/10 border border-[#f1c40f]/30 mb-8">
            <Lock className="w-3 h-3 text-[#f1c40f]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#f1c40f]">Coming Soon</span>
          </div>

          <h1 className="text-[14vw] md:text-[10vw] font-black italic leading-[0.85] tracking-tighter mb-6">
            THE <span className="text-[#f1c40f]">VAULT</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-light tracking-wide">
            The holy grail of every beat I&apos;ve ever made. 1,000+ tracks, unlimited downloads, one subscription.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="#early-access"
              className="btn-primary text-sm"
            >
              <Lock className="w-4 h-4" />
              Get Early Access
            </a>
            <Link href="/beats/" className="btn-outline text-sm">
              <Music className="w-4 h-4" />
              Preview Free Beats
            </Link>
          </div>

          <p className="text-sm text-white/55 tracking-wide">
            $50/month. Cancel anytime. Launching soon.
          </p>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="py-24 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="section-label">What&apos;s Inside</p>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter">
              EVERYTHING.<br />
              <span className="text-[#f1c40f]">ALL OF IT.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-white/5">
            {features.map((feat) => (
              <div key={feat.title} className="bg-black p-8 md:p-10">
                <feat.icon className="w-6 h-6 text-[#f1c40f] mb-6" />
                <h3 className="text-xl font-black italic tracking-tight mb-3">{feat.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-md">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.04)_0%,_transparent_70%)]" />
        <div className="relative max-w-2xl mx-auto text-center">
          <p className="section-label">Pricing</p>
          <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-6">
            ONE PLAN. <span className="text-[#f1c40f]">NO BS.</span>
          </h2>

          <div className="border border-[#f1c40f]/30 bg-neutral-950/50 p-10 md:p-12 text-left glow-yellow">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black italic tracking-tight">The Vault</h3>
                <p className="text-sm text-white/60 mt-1">Full access subscription</p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-black tracking-tighter">$50</p>
                <p className="text-xs text-white/55 tracking-wide uppercase mt-1">per month</p>
              </div>
            </div>

            <div className="space-y-3 mb-10">
              {tiers[0].features.map((feat) => (
                <div key={feat} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#f1c40f] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white/60">{feat}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-xs text-white/55 leading-relaxed mb-2">
                Starting at launch with 1,000+ of my own beats. The Vault will grow into a marketplace where other producers can sell their beats, and I take 5% of every sale.
              </p>
            </div>
          </div>

          <p className="text-xs text-white/45 tracking-wide mt-6">
            Subscription billing handled securely via Stripe. Cancel anytime, no questions asked.
          </p>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="py-24 px-6 border-y border-white/5 bg-neutral-950/30">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <p className="section-label">The Roadmap</p>
            <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter">
              PHASE <span className="text-[#f1c40f]">ONE.</span><br />
              THEN <span className="text-[#f1c40f]">TWO.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-white/5">
            <div className="bg-black p-8 md:p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f1c40f]/10 border border-[#f1c40f]/20 mb-6">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#f1c40f]">Phase 1 — Launch</span>
              </div>
              <h3 className="text-xl font-black italic tracking-tight mb-4">The Archive</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                The Vault opens with the holy grail: every beat I have ever made. 1,000+ tracks, fully downloadable, studio quality. This is the complete Flowell collection in one place.
              </p>
              <ul className="space-y-2">
                {['1,000+ beats from the archive', 'Unlimited downloads', 'WAV quality', 'New beats added weekly'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-3.5 h-3.5 text-[#f1c40f] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black p-8 md:p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 mb-6">
                <TrendingUp className="w-3 h-3 text-white/60" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/60">Phase 2 — Growth</span>
              </div>
              <h3 className="text-xl font-black italic tracking-tight mb-4">The Marketplace</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                The Vault becomes a two-sided marketplace. Other producers can upload and sell their beats. I take 5% of every sale. The catalog grows beyond my own archive into a collective.
              </p>
              <ul className="space-y-2">
                {['Producers upload and sell beats', '5% platform fee on every sale', 'Growing catalog beyond 1,000+', 'Producer discovery and ratings'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-3.5 h-3.5 text-[#f1c40f] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EARLY ACCESS */}
      <section id="early-access" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.06)_0%,_transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f1c40f]/10 border border-[#f1c40f]/20 mb-8">
            <Lock className="w-3 h-3 text-[#f1c40f]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#f1c40f]">Early Access</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">
            BE FIRST IN.
          </h2>
          <p className="text-white/70 mb-10 max-w-md mx-auto">
            Join the list. Get notified the moment The Vault opens, plus exclusive early-access pricing.
          </p>
          <SubscribeForm source="vault-early-access" />
        </div>
      </section>

      {/* FAQ-STYLE CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-white/55 max-w-xl mx-auto leading-relaxed mb-8">
            The Vault is a subscription service giving you access to 1,000+ beats for $50/month. Download, stream, and use them in your sessions. At launch, it&apos;s my complete archive. Later, other producers join and sell their beats too.
          </p>
          <Link href="/beats/" className="text-sm font-bold tracking-wider uppercase text-[#f1c40f] hover:text-white transition-colors inline-flex items-center gap-2">
            Browse Free Beats While You Wait <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}