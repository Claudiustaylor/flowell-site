'use client'

import Link from 'next/link'
import { Zap, Play, ArrowRight, Music, ShoppingBag, Star } from 'lucide-react'
import { useState, useEffect } from 'react'

const packs = [
  {
    id: 'oasis-vol-1',
    name: 'OASIS VOL. 1',
    tagline: 'Afrobeats & Afro-Fusion Essentials',
    description: '85 loops · 40 one-shots · 15 MIDI · 5 project files. Inspired by the warmth of Tems, Wizkid, Burna Boy. Pure tropical energy.',
    price: 49,
    image: '/images/pack-oasis.jpg',
    badge: 'BESTSELLER',
    colors: 'from-amber-500/20 to-yellow-500/10',
  },
  {
    id: 'nocturnal',
    name: 'NOCTURNAL',
    tagline: 'Dark R&B & Trapsoul Textures',
    description: '60 loops · 35 one-shots · 10 MIDI · 3 project files. Late-night melodies, 808s that hit different, and textures for the after-hours.',
    price: 49,
    image: '/images/pack-nocturnal.jpg',
    badge: 'NEW',
    colors: 'from-purple-500/20 to-violet-500/10',
  },
  {
    id: 'flowell-club',
    name: 'FLOWELL CLUB',
    tagline: 'Monthly Producer Membership',
    description: 'New pack every month + live cook-up sessions + project files + exclusive Discord access. Cancel anytime.',
    price: 10,
    image: '/images/pack-club.jpg',
    badge: 'RECURRING',
    colors: 'from-[#f1c40f]/20 to-yellow-600/10',
  },
]

const beatPreviews = [
  { title: 'MIDNIGHT IN LAGOS', bpm: 118, key: 'F#m', style: 'Afrobeats', duration: '2:34' },
  { title: 'NOCTURNE', bpm: 142, key: 'Am', style: 'R&B Trap', duration: '2:18' },
  { title: 'GOLD RUSH', bpm: 128, key: 'Dm', style: 'Hip-Hop', duration: '2:45' },
  { title: 'PALM WINE', bpm: 105, key: 'Gm', style: 'Afro-Fusion', duration: '3:02' },
]

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="bg-black">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-neutral-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.08)_0%,_transparent_70%)]" />

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${scrolled ? 'opacity-0 -translate-y-8' : 'opacity-100'}`}>
            <p className="section-label mb-6">Afrobeats · R&B · Hip-Hop Production</p>

            <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter italic mb-8">
              <span className="text-white">FLOW</span>
              <span className="text-[#f1c40f]">ELL</span>
            </h1>

            <p className="text-lg md:text-xl text-white/40 max-w-xl mx-auto mb-12 font-light tracking-wide">
              400+ beats. Producer packs. Custom production. Built for artists who move the culture.
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

      {/* MARQUEE */}
      <div className="border-y border-white/10 py-4 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content text-xs font-bold tracking-[0.3em] uppercase text-white/20">
            <span className="inline-block px-8">400+ BEATS</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">300+ SONGS</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">PRODUCER PACKS</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">CUSTOM PRODUCTION</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">AFROBEATS · R&B · HIP-HOP</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">400+ BEATS</span>
            <span className="inline-block px-8 text-[#f1c40f]">★</span>
            <span className="inline-block px-8">300+ SONGS</span>
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

      {/* PACKS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="section-label">Producer Tools</p>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter">PACKS</h2>
          </div>
          <Link href="/packs/" className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-white/40 hover:text-[#f1c40f] transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <Link
              key={pack.id}
              href={`/packs/#${pack.id}`}
              className="group relative bg-neutral-950 border border-white/10 overflow-hidden card-hover block"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${pack.colors} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="w-12 h-12 text-[#f1c40f]/30 mx-auto mb-2" />
                    <p className="text-xs font-bold tracking-widest uppercase text-white/20">{pack.name}</p>
                  </div>
                </div>
                {pack.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#f1c40f] text-black text-xs font-bold tracking-wider uppercase">
                      {pack.badge}
                    </span>
                  </div>
                )}
              </div>

              <div className="relative p-6">
                <h3 className="text-2xl font-black italic tracking-tight mb-1">{pack.name}</h3>
                <p className="text-sm text-[#f1c40f] font-medium mb-3">{pack.tagline}</p>
                <p className="text-sm text-white/40 leading-relaxed mb-4">{pack.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black">${pack.price}</span>
                  <span className="text-xs font-bold tracking-wider uppercase text-white/30 group-hover:text-[#f1c40f] transition-colors flex items-center gap-1">
                    Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEAT PREVIEWS */}
      <section className="py-24 px-6 bg-neutral-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="section-label">Latest Drops</p>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter">BEATS</h2>
            </div>
            <Link href="/beats/" className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-white/40 hover:text-[#f1c40f] transition-colors">
              All Beats <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-1">
            {beatPreviews.map((beat, i) => (
              <div
                key={beat.title}
                className="group flex items-center gap-4 md:gap-8 p-4 md:p-6 border border-white/5 hover:border-[#f1c40f]/30 bg-black/50 hover:bg-neutral-900/50 transition-all cursor-pointer"
              >
                <span className="text-xs font-mono text-white/20 w-6">{String(i + 1).padStart(2, '0')}</span>

                <button className="w-10 h-10 flex items-center justify-center border border-white/20 group-hover:border-[#f1c40f] group-hover:text-[#f1c40f] transition-all">
                  <Play className="w-4 h-4 fill-current" />
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm md:text-base tracking-wide truncate">{beat.title}</h3>
                </div>

                <div className="hidden md:flex items-center gap-6 text-xs font-mono text-white/30">
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

      {/* CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.06)_0%,_transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto">
          <p className="section-label mb-6">Custom Work</p>
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6">
            LET&apos;S BUILD
          </h2>
          <p className="text-lg text-white/40 mb-10 max-w-lg mx-auto">
            Need a custom beat? Full production? Mixing? I work with artists who are serious about their sound.
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
