import Link from 'next/link'
import { Zap, Music, Globe, Headphones } from 'lucide-react'

const stats = [
  { number: 'Beats', label: 'Produced' },
  { number: 'Songs', label: 'Released' },
  { number: '6', label: 'Genres' },
  { number: '∞', label: 'Vibes' },
]

export default function AboutPage() {
  return (
    <div className="pt-24 pb-24">
      {/* Hero */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-6">The Producer</p>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6">
              FLOWELL
            </h1>
            <p className="text-lg text-white/40 leading-relaxed mb-8">
              Independent producer crafting worlds in sound. At the intersection of 
              Afrobeats, R&B, hip-hop, and trap — building for artists who move the culture.
            </p>
            <div className="flex gap-4">
              <Link href="/packs/" className="btn-primary text-sm">
                <Zap className="w-4 h-4" />
                Shop Packs
              </Link>
              <Link href="/contact/" className="btn-outline text-sm">
                Work With Me
              </Link>
            </div>
          </div>

          <div className="aspect-[4/5] bg-neutral-950 border border-white/10 overflow-hidden relative">
            <img
              src="/images/flowell-spotify-profile-640.jpg"
              alt="Flowell"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-5xl md:text-6xl font-black italic tracking-tighter text-[#f1c40f]">{s.number}</p>
              <p className="text-xs font-bold tracking-wider uppercase text-white/30 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bio */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="space-y-12">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/30">01 — The Sound</h3>
            </div>
            <div className="md:col-span-8">
              <p className="text-white/60 leading-relaxed text-lg">
                Flowell (also known as Flowellbeats) is an independent music producer and recording 
                artist crafting instrumental landscapes at the intersection of hip-hop, trap, 
                Afrobeat, and afroswing. Every track is built from the ground up — original 
                compositions, custom drum programming, and layered synth work.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/30">02 — The Approach</h3>
            </div>
            <div className="md:col-span-8">
              <p className="text-white/60 leading-relaxed text-lg">
                Drawing from the rhythmic cadences of West African percussion, the 808-driven 
                intensity of Atlanta trap, and the melodic sensibility of UK afroswing, Flowell 
                creates beats that hit hard and stick with you. Whether you are an artist looking 
                for your next single, a content creator needing original music, or a producer 
                studying the craft — the catalog spans type beats, instrumental EPs, and exclusive 
                custom production.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/30">03 — The Catalog</h3>
            </div>
            <div className="md:col-span-8">
              <p className="text-white/60 leading-relaxed text-lg mb-6">
                With 400+ beats and 300+ songs, the catalog is deep and diverse. From festival-ready 
                Afrobeats to late-night R&B, every track is mixed and mastered for professional use.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Hip-Hop', 'Trap', 'Afrobeat', 'Afroswing', 'R&B', 'Lo-Fi'].map(g => (
                  <span key={g} className="px-4 py-2 border border-white/10 text-xs font-bold tracking-wider uppercase text-white/40">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}