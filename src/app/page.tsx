'use client'

import Link from 'next/link'
import { Zap, Play, Pause, ArrowRight, ShoppingBag, Lock, Music, Download, Headphones, Disc3, Disc, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { ParticleCanvas } from '@/components/ParticleCanvas'
import { Pack3DMockup } from '@/components/Pack3DMockup'
import { SubscribeForm } from '@/components/SubscribeForm'
import { getMerchProduct } from '@/lib/merch'
import { useCart } from '@/components/CartContext'

const packs = [
  {
    id: 'oasis-vol-1',
    name: 'OASIS VOL. 1',
    tagline: 'Afrobeats & Afro-Fusion Essentials',
    description: 'The definitive Afrobeats toolkit. 85 original loops, 40 one-shots, 15 MIDI progressions, and 5 full project files. Every sound handcrafted for modern Afro-fusion production.',
    price: 49,
    originalPrice: 199,
    badge: 'BESTSELLER',
    colors: 'from-amber-500/20 to-yellow-500/10',
    accent: '#f1c40f',
    image: '/images/packs/oasis-vol-1.jpg',
    stripeUrl: 'https://buy.stripe.com/8x228q23D6ET9Ip6hJgA800',
  },
  {
    id: 'nocturnal',
    name: 'NOCTURNAL',
    tagline: 'Dark R&B & Trapsoul Textures',
    description: 'After-hours production. Moody pads, detuned pianos, distorted 808s, and vocal textures designed for late-night R&B and dark trap.',
    price: 49,
    originalPrice: 199,
    badge: 'NEW',
    colors: 'from-purple-500/20 to-violet-500/10',
    accent: '#a855f7',
    image: '/images/packs/nocturnal.jpg',
    stripeUrl: 'https://buy.stripe.com/3cI4gygYx6ET8El35xgA801',
  },
  {
    id: 'flowell-club',
    name: 'FLOWELL CLUB',
    tagline: 'Producer Community Access',
    description: 'Join the inner circle. One-time access fee gets you into the Flowell community — cook-up sessions, project file breakdowns, and the private Discord server.',
    price: 50,
    badge: 'COMMUNITY',
    colors: 'from-[#f1c40f]/20 to-yellow-600/10',
    accent: '#f1c40f',
    image: '/images/packs/flowell-club.jpg',
    stripeUrl: 'https://buy.stripe.com/dRm9AS6jT5APdYF35xgA804',
  },
]

const beatPreviews = [
  { title: 'DRIFT CODE', bpm: 101, key: 'Gm', style: 'Afro-Fusion', duration: '2:34', audio: '/beats/drift_code.mp3' },
  { title: 'ISLAND CODE', bpm: 103, key: 'Bbm', style: 'Afro-Fusion', duration: '2:05', audio: '/beats/island_code.mp3' },
  { title: 'JETLAG', bpm: 101, key: 'C#m', style: 'Afrobeats', duration: '2:31', audio: '/beats/jetlag.mp3' },
  { title: 'NEON RAIN', bpm: 101, key: 'Gm', style: 'Afro-Fusion', duration: '2:10', audio: '/beats/neon_rain.mp3' },
]

export default function HomePage() {
  const { add } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [playing, setPlaying] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function togglePlay(audioUrl: string, title: string) {
    if (playing === title) {
      audioRef.current?.pause()
      setPlaying(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      const a = new Audio(audioUrl)
      a.play().catch(() => {})
      audioRef.current = a
      a.onended = () => setPlaying(null)
      setPlaying(title)
    }
  }

  return (
    <div className="bg-black">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Fireflies particle effect */}
        <div className="absolute inset-0 z-[1]">
          <ParticleCanvas />
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-neutral-900/80 z-[2]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.08)_0%,_transparent_70%)] z-[2]" />

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${scrolled ? 'opacity-0 -translate-y-8' : 'opacity-100'}`}>
            <p className="section-label mb-6">Afrobeats · R&B · Hip-Hop Production</p>

            <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter italic mb-8">
              <span className="text-white">FLOW</span>
              <span className="text-[#f1c40f]">ELL</span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-12 font-light tracking-wide">
              Producer packs. Custom production. Built for artists who move the culture.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/packs/" className="btn-primary text-sm">
                <ShoppingBag className="w-4 h-4" />
                Shop Packs
              </Link>
              <Link href="/beats/" className="btn-outline text-sm">
                <Play className="w-4 h-4" />
                Browse Beats
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        </div>
      </section>

      {/* FEARS — OUT NOW */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden border-b border-white/10">
        {/* Textured background — film grain via layered gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(241,196,15,0.07)_0%,_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(241,196,15,0.05)_0%,_transparent_70%)] blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          {/* Status line */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#f1c40f]/60" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f1c40f] text-black">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
              <span className="text-[11px] font-black tracking-[0.25em] uppercase">Out Now</span>
            </div>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#f1c40f]/60" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Album artwork */}
            <div className="relative max-w-md w-full mx-auto">
              <div className="absolute -inset-6 bg-[radial-gradient(circle,_rgba(241,196,15,0.12)_0%,_transparent_70%)] blur-2xl" />
              <div className="relative border border-white/10 group">
                {/* Corner accents — handcrafted frame feel */}
                <span className="absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-[#f1c40f]" />
                <span className="absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-[#f1c40f]" />
                <span className="absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-[#f1c40f]" />
                <span className="absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-[#f1c40f]" />
                <img
                  src="/images/fears-cover.jpg"
                  alt="FEARS — Flowell"
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>

            {/* Copy + actions */}
            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/55 mb-3">
                The Debut Album · 2026
              </p>
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.85] mb-6">
                FEARS
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-3">
                The fear was never the beats.
              </p>
              <p className="text-lg text-white/70 leading-relaxed italic mb-8">
                It was whether anyone would hear <span className="text-[#f1c40f] font-bold not-italic">ME</span>.
              </p>
              <p className="text-sm text-white/55 leading-relaxed mb-8 max-w-md">
                Eight tracks. Shad, Carl B &amp; Lexy Priest. The producer steps from behind the boards.
              </p>

              {/* Stream buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <a href="https://ditto.fm/fears-flowell" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                  Stream FEARS
                </a>
                <a href="https://www.youtube.com/watch?v=lZcG8dWsPCI" target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
                  Watch the Visualizer
                </a>
              </div>

              {/* Spotify embed — on-site plays count as streams */}
              <div className="mb-10">
                <iframe
                  src="https://open.spotify.com/embed/album/5S2cu1e2S1uH2Re9igSCu?utm_source=generator&theme=0"
                  title="FEARS — Flowell on Spotify"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full border border-white/10"
                />
              </div>

              {/* Physical + exclusive offers */}
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => add('fears-record-pack')}
                  className="group text-left border border-[#f1c40f]/40 bg-[#f1c40f]/[0.04] p-5 hover:bg-[#f1c40f]/[0.08] hover:border-[#f1c40f] transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Disc3 className="w-4 h-4 text-[#f1c40f]" />
                    <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[#f1c40f]">Limited</span>
                  </div>
                  <h3 className="text-base font-bold italic mb-1">Exclusive Record Pack — $2,500</h3>
                  <p className="text-xs text-white/55 leading-relaxed">
                    Stems, trackouts &amp; the full session files. One owner per beat. When it&apos;s gone, it&apos;s gone.
                  </p>
                </button>
                <button
                  onClick={() => add('fears-vinyl')}
                  className="group text-left border border-white/15 p-5 hover:border-[#f1c40f]/60 hover:bg-white/[0.03] transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Disc className="w-4 h-4 text-[#f1c40f]" />
                    <span className="text-[11px] font-black tracking-[0.2em] uppercase text-white/55">Collector</span>
                  </div>
                  <h3 className="text-base font-bold italic mb-1">FEARS on Vinyl — $45</h3>
                  <p className="text-xs text-white/55 leading-relaxed">
                    The album pressed to 180g vinyl. Hand-numbered. First pressing only.
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-white/10 py-4 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content text-xs font-bold tracking-[0.3em] uppercase text-white/45">
            <span className="inline-block px-8">BEATS</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">SONGS</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">PRODUCER PACKS</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">CUSTOM PRODUCTION</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">AFROBEATS · R&B · HIP-HOP</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">BEATS</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">SONGS</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">PRODUCER PACKS</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">CUSTOM PRODUCTION</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">AFROBEATS · R&B · HIP-HOP</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
          </div>
        </div>
      </div>

      {/* THE VAULT — Coming Soon */}
      <section className="relative py-24 px-6 border-y border-[#f1c40f]/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.06)_0%,_transparent_70%)]" />
        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f1c40f]/10 border border-[#f1c40f]/30 mb-6">
                <Lock className="w-3 h-3 text-[#f1c40f]" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#f1c40f]">Coming Soon</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4">
                THE <span className="text-[#f1c40f]">VAULT</span>
              </h2>
              <p className="text-lg text-white/70 max-w-xl leading-relaxed">
                1,000+ beats. Every track I&apos;ve ever made. One subscription.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/55 mb-1">Monthly</p>
              <p className="text-5xl font-black tracking-tighter">$50<span className="text-lg text-white/55 font-normal">/mo</span></p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: Music, title: '1,000+ Beats', desc: 'The complete archive. Every beat I\'ve ever produced, all in one place.' },
              { icon: Download, title: 'Unlimited Downloads', desc: 'Download and stream every beat in the vault. No per-track fees.' },
              { icon: Headphones, title: 'Studio Quality', desc: 'WAV files, professionally mixed and mastered. Ready for your sessions.' },
            ].map((feat) => (
              <div key={feat.title} className="border border-white/10 p-6 bg-neutral-950/50">
                <feat.icon className="w-5 h-5 text-[#f1c40f] mb-4" />
                <h3 className="text-sm font-bold tracking-wide uppercase mb-2">{feat.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/vault/" className="btn-primary text-sm">
              <Lock className="w-4 h-4" />
              Explore The Vault
            </Link>
            <p className="text-xs text-white/55 tracking-wide">
              Launching soon. Join the list for early access.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED VIDEO — New Release */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f1c40f]/10 border border-[#f1c40f]/20 mb-6">
            <span className="w-2 h-2 bg-[#f1c40f] rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#f1c40f]">Lead Single</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">
            FEAR OF GOD
          </h2>
          <p className="text-sm text-white/60 mb-8 max-w-md mx-auto">
            The lead single from <span className="text-[#f1c40f]">FEARS</span> — out now everywhere.
          </p>
        </div>

        <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/lZcG8dWsPCI"
            title="Flowell — Fear of God"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <a
            href="https://too.fm/fog"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
          >
            <Play className="w-4 h-4" />
            Stream Everywhere
          </a>
          <Link href="/subscribe/" className="btn-outline text-sm">
          <Zap className="w-4 h-4" />
          Get the Free Beat
          </Link>
        </div>
      </section>

      {/* ── MERCH — Official Store ─────────────────────────────────────── */}
      <section className="relative py-24 px-6 border-t border-white/10 overflow-hidden">
        {/* Textured backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(241,196,15,0.07) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 20% 80%, rgba(241,196,15,0.05) 0%, transparent 65%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="section-label">Official Store</p>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter">
                MERCH
              </h2>
            </div>
            <Link href="/merch/" className="btn-outline text-xs whitespace-nowrap">
              Shop All Merch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-white/65 max-w-xl mb-10">
            The FEARS first pressing — vinyl, apparel, and collectibles built to outlast the moment.
            Limited runs. Hand-numbered. Once they&apos;re gone, they&apos;re gone.
          </p>

          {/* Featured 3-up: vinyl + record pack + hoodie */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { id: 'fears-vinyl', label: 'First Pressing' },
              { id: 'fears-record-pack', label: 'One Owner Only' },
              { id: 'fears-hoodie', label: 'Heavyweight' },
            ].map(({ id, label }) => {
              const p = getMerchProduct(id)
              if (!p) return null
              return (
                <Link
                  key={id}
                  href="/merch/"
                  className="group border border-white/10 hover:border-[#f1c40f]/40 transition-all bg-black flex flex-col"
                >
                  <div className="relative aspect-square bg-neutral-950 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.08)_0%,_transparent_70%)]" />
                    {p.category === 'vinyl' && <Disc3 className="relative w-28 h-28 text-[#f1c40f]/70 group-hover:scale-105 group-hover:rotate-12 transition-all duration-700" />}
                    {p.category === 'digital' && <Zap className="relative w-24 h-24 text-[#f1c40f]/70 group-hover:scale-105 transition-transform" />}
                    {p.category === 'apparel' && <ShoppingBag className="relative w-24 h-24 text-[#f1c40f]/70 group-hover:scale-105 transition-transform" />}
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black tracking-[0.15em] uppercase bg-[#f1c40f] text-black">
                      {label}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold italic tracking-tight">{p.name}</h3>
                    <p className="text-xs text-white/55 leading-relaxed mt-1 mb-4 flex-1">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-[#f1c40f]">${p.price}</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 group-hover:text-[#f1c40f] transition-colors flex items-center gap-1">
                        Shop now
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {[
              { icon: Truck, label: 'Free US shipping over $75' },
              { icon: ShieldCheck, label: 'Secure Stripe checkout' },
              { icon: RotateCcw, label: '30-day returns' },
              { icon: Disc3, label: 'Hand-numbered first pressing' },
            ].map(t => (
              <div key={t.label} className="flex items-center gap-2.5 border border-white/10 px-4 py-3">
                <t.icon className="w-4 h-4 text-[#f1c40f] flex-shrink-0" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-white/55">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="section-label">Producer Tools</p>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter">PACKS</h2>
          </div>
          <Link href="/packs/" className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-white/60 hover:text-[#f1c40f] transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <div key={pack.id}
              className="group relative bg-neutral-950 border border-white/10 overflow-hidden card-hover flex flex-col"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${pack.colors} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900 flex-shrink-0">
                <Pack3DMockup
                  name={pack.name}
                  tagline={pack.tagline}
                  accent={pack.accent}
                  gradient={pack.colors}
                  badge={pack.badge}
                  image={pack.image}
                />
              </div>

              <div className="relative p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-black italic tracking-tight mb-1">{pack.name}</h3>
                <p className="text-sm text-[#f1c40f] font-medium mb-3">{pack.tagline}</p>
                <p className="text-sm text-white/60 leading-relaxed mb-4 flex-1">{pack.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black">${pack.price}</span>
                    {pack.originalPrice && (
                      <span className="text-sm text-white/55 line-through">${pack.originalPrice}</span>
                    )}
                  </div>
                </div>
                <a
                  href={pack.stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-xs justify-center"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEAT PREVIEWS — Now playable */}
      <section className="py-24 px-6 bg-neutral-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="section-label">Latest Drops</p>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter">BEATS</h2>
            </div>
            <Link href="/beats/" className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-white/60 hover:text-[#f1c40f] transition-colors">
              All Beats <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-1">
            {beatPreviews.map((beat, i) => (
              <div
                key={beat.title}
                className="group flex items-center gap-4 md:gap-8 p-4 md:p-6 border border-white/5 hover:border-[#f1c40f]/30 bg-black/50 hover:bg-neutral-900/50 transition-all"
              >
                <span className="text-xs font-mono text-white/45 w-6">{String(i + 1).padStart(2, '0')}</span>

                <button
                  onClick={() => togglePlay(beat.audio, beat.title)}
                  className="w-10 h-10 flex items-center justify-center border border-white/20 group-hover:border-[#f1c40f] group-hover:text-[#f1c40f] transition-all flex-shrink-0"
                >
                  {playing === beat.title ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm md:text-base tracking-wide truncate">{beat.title}</h3>
                </div>

                <div className="hidden md:flex items-center gap-6 text-xs font-mono text-white/55">
                  <span>{beat.bpm} BPM</span>
                  <span>{beat.key}</span>
                  <span className="text-[#f1c40f]/60">{beat.style}</span>
                  <span>{beat.duration}</span>
                </div>

                <Link
                  href="/beats/"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[#f1c40f]"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="py-24 px-6 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.04)_0%,_transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f1c40f]/10 border border-[#f1c40f]/20 mb-6">
            <Zap className="w-3 h-3 text-[#f1c40f]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#f1c40f]">FEARS · Out Now</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">
            GET A FREE BEAT.<br />
            <span className="text-[#f1c40f]">HEAR FEARS FIRST.</span>
          </h2>
          <p className="text-white/70 mb-10 max-w-md mx-auto">
            Join the list. Get an exclusive beat download instantly. Plus first word on vinyl drops, exclusive packs and everything after FEARS.
          </p>
          <SubscribeForm source="homepage" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.06)_0%,_transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto">
          <p className="section-label mb-6">Custom Work</p>
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6">
            LET&apos;S BUILD
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-lg mx-auto">
            Need a custom beat? Mixing and mastering? I work with artists who are serious about their sound.
          </p>
          <Link href="/contact/" className="btn-primary">
            <Zap className="w-4 h-4" />
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  )
}