'use client'

import Link from 'next/link'
import { ArrowLeft, Zap, ShoppingBag, Play, Check, Star } from 'lucide-react'
import { Pack3DMockup } from '@/components/Pack3DMockup'

const packs = [
  {
    id: 'oasis-vol-1',
    name: 'OASIS VOL. 1',
    tagline: 'Afrobeats & Afro-Fusion Essentials',
    price: 49,
    originalPrice: 199,
    image: '/images/packs/oasis-vol-1.jpg',
    badge: 'BESTSELLER',
    description: 'The definitive Afrobeats toolkit. 85 original loops, 40 one-shots, 15 MIDI progressions, and 5 full project files. Every sound handcrafted for modern Afro-fusion production.',
    contents: [
      { item: 'Original Loops', count: '85', detail: 'Vocal chops, guitar licks, synth melodies, percussion loops' },
      { item: 'One-Shots', count: '40', detail: 'Kicks, snares, hi-hats, 808s, FX hits' },
      { item: 'MIDI Files', count: '15', detail: 'Chord progressions, basslines, melody patterns' },
      { item: 'Project Files', count: '5', detail: 'Full DAW sessions with mixing chains' },
    ],
    specs: [
      '24-bit / 44.1kHz WAV',
      '100% royalty-free',
      'Compatible with all DAWs',
      'Instant digital download',
    ],
    colors: {
      bg: 'from-amber-900/30 to-yellow-900/20',
      accent: '#f1c40f',
    },
    gumroadUrl: 'https://buy.stripe.com/8x228q23D6ET9Ip6hJgA800',
  },
  {
    id: 'nocturnal',
    name: 'NOCTURNAL',
    tagline: 'Dark R&B & Trapsoul Textures',
    price: 49,
    originalPrice: 199,
    image: '/images/packs/nocturnal.jpg',
    badge: 'NEW',
    description: 'After-hours production. Moody pads, detuned pianos, distorted 808s, and vocal textures designed for late-night R&B and dark trap.',
    contents: [
      { item: 'Dark Loops', count: '60', detail: 'Pads, pianos, bells, atmospheric textures' },
      { item: 'One-Shots', count: '35', detail: '808s, kicks, percs, vocal chops, FX' },
      { item: 'MIDI Files', count: '10', detail: 'Melancholic progressions, trap patterns' },
      { item: 'Project Files', count: '3', detail: 'DAW sessions with vocal processing chains' },
    ],
    specs: [
      '24-bit / 44.1kHz WAV',
      '100% royalty-free',
      'Key & BPM labeled',
      'Instant digital download',
    ],
    colors: {
      bg: 'from-purple-900/30 to-violet-900/20',
      accent: '#a855f7',
    },
    gumroadUrl: 'https://buy.stripe.com/3cI4gygYx6ET8El35xgA801',
  },
  {
    id: 'flowell-club',
    name: 'FLOWELL CLUB',
    tagline: 'Producer Community Access',
    price: 50,
    originalPrice: null,
    image: '/images/packs/flowell-club.jpg',
    badge: 'COMMUNITY',
    description: 'Join the inner circle. One-time access fee gets you into the Flowell community — cook-up sessions, project file breakdowns, and the private Discord server.',
    contents: [
      { item: 'Monthly Pack', count: '1x/mo', detail: 'Full loop kit, one-shots, MIDI, project file' },
      { item: 'Live Sessions', count: '2x/mo', detail: 'Real-time beat making + Q&A streams' },
      { item: 'Project Files', count: 'Unlimited', detail: 'Access to all past project files' },
      { item: 'Community', count: 'Discord', detail: 'Private server with feedback channels' },
    ],
    specs: [
      'One-time payment',
      'Past packs included',
      'Priority support',
      'Exclusive previews',
    ],
    colors: {
      bg: 'from-yellow-900/30 to-amber-900/20',
      accent: '#f1c40f',
    },
    gumroadUrl: 'https://buy.stripe.com/dRm9AS6jT5APdYF35xgA804',
  },
]

export default function PacksPage() {
  return (
    <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-white/55 hover:text-[#f1c40f] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <p className="section-label">Producer Tools</p>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter">PACKS</h1>
        <p className="text-lg text-white/55 mt-4 max-w-lg">
          Premium sound kits for producers who demand quality. Every sound is original, mixed, and ready to drop.
        </p>
      </div>

      <div className="space-y-24">
        {packs.map((pack) => (
          <div key={pack.id} id={pack.id} className="scroll-mt-24">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Product Image */}
              <div className="relative aspect-[4/3] bg-neutral-950 border border-white/10 overflow-hidden flex items-center justify-center p-6 md:p-10">
                <Pack3DMockup
                  name={pack.name}
                  tagline={pack.tagline}
                  accent={pack.colors.accent}
                  gradient={pack.colors.bg}
                  badge={pack.badge}
                  image={pack.image}
                />
              </div>

              {/* Product Info */}
              <div className="lg:pt-8">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-5xl font-black">${pack.price}</span>
                  {pack.originalPrice && (
                    <span className="text-xl text-white/55 line-through">${pack.originalPrice}</span>
                  )}
                </div>
                <p className="text-sm text-white/55 mb-8">One-time payment · Instant download</p>

                <p className="text-white/60 leading-relaxed mb-8">{pack.description}</p>

                <a
                  href={pack.gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center mb-8"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Buy Now
                </a>

                {/* Contents */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/55 mb-4">What&apos;s Inside</h3>
                  <div className="space-y-3">
                    {pack.contents.map((c) => (
                      <div key={c.item} className="flex items-start gap-4 p-3 border border-white/5 bg-white/[0.02]">
                        <span className="text-lg font-black tabular-nums" style={{ color: pack.colors.accent }}>{c.count}</span>
                        <div>
                          <p className="font-bold text-sm">{c.item}</p>
                          <p className="text-xs text-white/55">{c.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specs */}
                <div>
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/55 mb-4">Specs</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {pack.specs.map((spec) => (
                      <div key={spec} className="flex items-center gap-2 text-xs text-white/60">
                        <Check className="w-3 h-3 flex-shrink-0" style={{ color: pack.colors.accent }} />
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
