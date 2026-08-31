'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Play, Pause, ShoppingBag, Plus, SlidersHorizontal, X, Music, Clock, Tag, DollarSign, Link as LinkIcon, Upload, ExternalLink } from 'lucide-react'
import { supabase, Beat } from '@/lib/supabase'
import { UniversalPlayer, useUniversalPlayer, type PlayerTrack } from '@/components/UniversalPlayer'

const allStyles = ['Afrobeats', 'R&B', 'Hip-Hop', 'Trap', 'Afro-Fusion', 'Lo-Fi', 'Pop']
const allMoods = ['Energetic', 'Chill', 'Dark', 'Uplifting', 'Melancholic', 'Aggressive', 'Sexy', 'Dreamy']

const demoBeats: Beat[] = [
  { id: '1', title: 'DRIFT CODE', bpm: 101, key: 'Gm', mood: ['Dark','Chill'], style: 'Afro-Fusion', tags: ['guitar','percussion','burna boy'], price: 49, store_url: 'https://buy.stripe.com/bJeaEW7nX0gv9IpdKbgA80c', cover_url: '/images/beats/drift_code.jpg', audio_url: '/beats/drift_code.mp3', created_at: '2026-04-07' },
  { id: '2', title: 'ISLAND CODE', bpm: 103, key: 'Bbm', mood: ['Dark','Energetic'], style: 'Afro-Fusion', tags: ['808','percussion','burna boy'], price: 49, store_url: 'https://buy.stripe.com/fZu5kC6jT9R5g6NeOfgA80e', cover_url: '/images/beats/island_code.jpg', audio_url: '/beats/island_code.mp3', created_at: '2026-04-06' },
  { id: '3', title: 'JETLAG', bpm: 101, key: 'C#m', mood: ['Energetic','Uplifting'], style: 'Afrobeats', tags: ['plucks','melodic','rema'], price: 49, store_url: 'https://buy.stripe.com/dRmeVcdMl6ET6wd35xgA809', cover_url: '/images/beats/jetlag.jpg', audio_url: '/beats/jetlag.mp3', created_at: '2026-04-05' },
  { id: '4', title: 'MIDNIGHT BOUNCE', bpm: 101, key: 'Bbm', mood: ['Dark','Sexy'], style: 'Afro-Fusion', tags: ['808','club','burna boy'], price: 49, store_url: 'https://buy.stripe.com/9B6dR87nX6ET4o5cG7gA80h', cover_url: '/images/beats/midnight_bounce.jpg', audio_url: '/beats/midnight_bounce.mp3', created_at: '2026-04-04' },
  { id: '5', title: 'NEON RAIN', bpm: 101, key: 'Gm', mood: ['Dark','Dreamy'], style: 'Afro-Fusion', tags: ['melodic','smooth','wizkid'], price: 49, store_url: 'https://buy.stripe.com/00w7sK9w5fbp9Ip0XpgA808', cover_url: '/images/beats/neon_rain.jpg', audio_url: '/beats/neon_rain.mp3', created_at: '2026-04-03' },
  { id: '6', title: 'NO SLEEP', bpm: 101, key: 'F', mood: ['Energetic','Uplifting'], style: 'Afrobeats', tags: ['bright','club','rema'], price: 49, store_url: 'https://buy.stripe.com/cNieVc9w55AP2fX6hJgA80b', cover_url: '/images/beats/no_sleep.jpg', audio_url: '/beats/no_sleep.mp3', created_at: '2026-04-02' },
  { id: '7', title: 'PALM SMOKE', bpm: 103, key: 'Dm', mood: ['Chill','Sexy'], style: 'Afro-Fusion', tags: ['warm','moody','burna boy'], price: 49, store_url: 'https://buy.stripe.com/14A6oG7nX7IX1bTdKbgA80f', cover_url: '/images/beats/palm_smoke.jpg', audio_url: '/beats/palm_smoke.mp3', created_at: '2026-04-01' },
  { id: '8', title: 'PRESSURE MOVE', bpm: 103, key: 'C#m', mood: ['Aggressive','Energetic'], style: 'Afrobeats', tags: ['punchy','club','rema'], price: 49, store_url: 'https://buy.stripe.com/28EbJ0eQpaV98El49BgA80g', cover_url: '/images/beats/pressure_move.jpg', audio_url: '/beats/pressure_move.mp3', created_at: '2026-03-31' },
  { id: '9', title: 'VELVET RUSH', bpm: 101, key: 'Bb', mood: ['Sexy','Dreamy'], style: 'Afrobeats', tags: ['smooth','melodic','rema'], price: 49, store_url: 'https://buy.stripe.com/00w9AS9w57IX5s935xgA80a', cover_url: '/images/beats/velvet_rush.jpg', audio_url: '/beats/velvet_rush.mp3', created_at: '2026-03-30' },
  { id: '10', title: 'STAZ', bpm: 101, key: 'C#m', mood: ['Chill','Dreamy'], style: 'Afrobeats', tags: ['clean','smooth','wizkid'], price: 49, store_url: 'https://buy.stripe.com/4gM00ieQp1kzcUB35xgA80d', cover_url: '/images/beats/staz.jpg', audio_url: '/beats/staz.mp3', created_at: '2026-03-29' },
]

function detectFromTitle(title: string) {
  const t = title.toLowerCase()
  let bpm = 120, mood = ['Chill'], style = 'Hip-Hop'
  if (t.includes('afro') || t.includes('lagos') || t.includes('palm')) { style = 'Afrobeats'; bpm = 110; mood = ['Energetic','Uplifting'] }
  if (t.includes('noct') || t.includes('dark') || t.includes('night')) { style = 'R&B'; bpm = 140; mood = ['Dark','Melancholic'] }
  if (t.includes('trap') || t.includes('after')) { style = 'Trap'; bpm = 140; mood = ['Dark','Aggressive'] }
  if (t.includes('lo') || t.includes('sunset') || t.includes('chill')) { style = 'Lo-Fi'; bpm = 90; mood = ['Chill','Dreamy'] }
  return { bpm, mood, style }
}

export default function BeatsPage() {
  const [beats, setBeats] = useState<Beat[]>([])
  const [search, setSearch] = useState('')
  const [styleFilter, setStyleFilter] = useState<string[]>([])
  const [moodFilter, setMoodFilter] = useState<string[]>([])
  const [bpmRange, setBpmRange] = useState([60, 200])
  const [playing, setPlaying] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const player = useUniversalPlayer()

  // Upload form state
  const [upTitle, setUpTitle] = useState('')
  const [upBpm, setUpBpm] = useState('')
  const [upKey, setUpKey] = useState('')
  const [upStyle, setUpStyle] = useState('Afrobeats')
  const [upMood, setUpMood] = useState('Chill')
  const [upPrice, setUpPrice] = useState('49')
  const [upUrl, setUpUrl] = useState('https://traktrain.com/flowell')

  useEffect(() => {
    setBeats(demoBeats)
    loadFromSupabase()
  }, [])

  async function loadFromSupabase() {
    try {
      const { data, error } = await supabase.from('beats').select('*').order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        setBeats(data as Beat[])
      }
    } catch {
      // fallback to demo beats
    }
  }

  const filtered = beats.filter((beat) => {
    const q = search.toLowerCase()
    const matchesSearch = beat.title.toLowerCase().includes(q) || beat.tags.some(t => t.toLowerCase().includes(q))
    const matchesStyle = styleFilter.length === 0 || styleFilter.includes(beat.style)
    const matchesMood = moodFilter.length === 0 || beat.mood.some(m => moodFilter.includes(m))
    const matchesBpm = beat.bpm >= bpmRange[0] && beat.bpm <= bpmRange[1]
    return matchesSearch && matchesStyle && matchesMood && matchesBpm
  })

  function handleUpload() {
    const detected = detectFromTitle(upTitle)
    const newBeat: Beat = {
      id: Date.now().toString(),
      title: upTitle || 'UNTITLED BEAT',
      bpm: parseInt(upBpm) || detected.bpm,
      key: upKey || 'Am',
      mood: upMood ? upMood.split(',').map(s => s.trim()) : detected.mood,
      style: upStyle || detected.style,
      tags: [],
      price: parseInt(upPrice) || 49,
      store_url: upUrl,
      cover_url: null,
      audio_url: null,
      created_at: new Date().toISOString(),
    }
    setBeats(prev => [newBeat, ...prev])
    // Try Supabase
    try {
      supabase.from('beats').insert([newBeat]).then(() => {})
    } catch {}
    setAdminOpen(false)
    setUpTitle('')
    setUpBpm('')
    setUpKey('')
    setUpMood('')
  }

  function toggleFilter(arr: string[], val: string, setter: (v: string[]) => void) {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="section-label">Catalog</p>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter">BEATS</h1>
          <p className="text-white/55 mt-2">{filtered.length} tracks available</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/55" />
            <input
              type="text"
              placeholder="Search beats..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-sm focus:border-[#f1c40f] focus:outline-none w-64"
            />
          </div>

          <button onClick={() => setShowFilters(!showFilters)} className="btn-outline py-2 px-3 text-xs">
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
            <DialogTrigger>
              <button className="btn-primary py-2 px-3 text-xs">
                <Plus className="w-4 h-4" />
                Upload
              </button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-950 border border-white/10 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-black italic">Upload Beat</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold tracking-wider uppercase text-white/55">Title</label>
                  <input value={upTitle} onChange={e => setUpTitle(e.target.value)} className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 text-sm focus:border-[#f1c40f] focus:outline-none" placeholder="e.g. MIDNIGHT IN LAGOS" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase text-white/55">BPM</label>
                    <input value={upBpm} onChange={e => setUpBpm(e.target.value)} type="number" className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 text-sm focus:border-[#f1c40f] focus:outline-none" placeholder="120" />
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase text-white/55">Key</label>
                    <input value={upKey} onChange={e => setUpKey(e.target.value)} className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 text-sm focus:border-[#f1c40f] focus:outline-none" placeholder="Am" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase text-white/55">Style</label>
                    <select value={upStyle} onChange={e => setUpStyle(e.target.value)} className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 text-sm focus:border-[#f1c40f] focus:outline-none">
                      {allStyles.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase text-white/55">Mood</label>
                    <input value={upMood} onChange={e => setUpMood(e.target.value)} className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 text-sm focus:border-[#f1c40f] focus:outline-none" placeholder="Chill, Sexy" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase text-white/55">Price ($)</label>
                    <input value={upPrice} onChange={e => setUpPrice(e.target.value)} type="number" className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 text-sm focus:border-[#f1c40f] focus:outline-none" placeholder="49" />
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase text-white/55">Store URL</label>
                    <input value={upUrl} onChange={e => setUpUrl(e.target.value)} className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 text-sm focus:border-[#f1c40f] focus:outline-none" placeholder="https://..." />
                  </div>
                </div>
                <button onClick={handleUpload} className="btn-primary w-full justify-center mt-4">
                  <Upload className="w-4 h-4" />
                  Upload Beat
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showFilters && (
        <div className="mb-8 p-6 border border-white/10 bg-white/[0.02]">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-xs font-bold tracking-wider uppercase text-white/55 mb-3">Style</h4>
              <div className="flex flex-wrap gap-2">
                {allStyles.map(s => (
                  <button key={s} onClick={() => toggleFilter(styleFilter, s, setStyleFilter)} className={`px-3 py-1 text-xs font-bold tracking-wider uppercase border transition-colors ${styleFilter.includes(s) ? 'border-[#f1c40f] text-[#f1c40f]' : 'border-white/10 text-white/60 hover:border-white/30'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wider uppercase text-white/55 mb-3">Mood</h4>
              <div className="flex flex-wrap gap-2">
                {allMoods.map(m => (
                  <button key={m} onClick={() => toggleFilter(moodFilter, m, setMoodFilter)} className={`px-3 py-1 text-xs font-bold tracking-wider uppercase border transition-colors ${moodFilter.includes(m) ? 'border-[#f1c40f] text-[#f1c40f]' : 'border-white/10 text-white/60 hover:border-white/30'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wider uppercase text-white/55 mb-3">BPM Range</h4>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-white/55 w-8">{bpmRange[0]}</span>
                <input type="range" min="60" max="200" value={bpmRange[0]} onChange={e => setBpmRange([parseInt(e.target.value), bpmRange[1]])} className="flex-1 accent-[#f1c40f]" />
                <span className="text-xs font-mono text-white/55">-</span>
                <input type="range" min="60" max="200" value={bpmRange[1]} onChange={e => setBpmRange([bpmRange[0], parseInt(e.target.value)])} className="flex-1 accent-[#f1c40f]" />
                <span className="text-xs font-mono text-white/55 w-10">{bpmRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Beat list */}
      <div className="space-y-1">
        {filtered.map((beat, i) => (
          <div key={beat.id} className="group flex items-center gap-4 md:gap-6 p-4 md:p-5 border border-white/5 hover:border-[#f1c40f]/30 bg-black hover:bg-neutral-900/30 transition-all">
            <span className="text-xs font-mono text-white/45 w-6">{String(i + 1).padStart(2, '0')}</span>
            {beat.audio_url ? (
              <button onClick={() => {
                const track: PlayerTrack = {
                  id: beat.id,
                  title: beat.title,
                  artist: 'FLOWELL',
                  audio_url: beat.audio_url!,
                  cover_url: beat.cover_url,
                  bpm: beat.bpm,
                  key: beat.key,
                }
                const queue: PlayerTrack[] = filtered
                  .filter(b => b.audio_url)
                  .map(b => ({ id: b.id, title: b.title, artist: 'FLOWELL', audio_url: b.audio_url!, cover_url: b.cover_url, bpm: b.bpm, key: b.key }))
                if (playing === beat.id) {
                  player?.togglePlay()
                } else {
                  player?.playTrack(track, queue)
                  setPlaying(beat.id)
                }
                // Update playing state based on player state
                const state = player?.getState()
                if (state?.currentTrack?.id === beat.id && !state.isPlaying) {
                  setPlaying(null)
                } else if (state?.currentTrack?.id === beat.id && state.isPlaying) {
                  setPlaying(beat.id)
                }
              }} className="w-10 h-10 flex items-center justify-center border border-white/20 group-hover:border-[#f1c40f] group-hover:text-[#f1c40f] transition-all flex-shrink-0">
                {playing === beat.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
            ) : (
              <button className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/45 flex-shrink-0 cursor-not-allowed" title="Preview unavailable">
                <Play className="w-4 h-4 fill-current" />
              </button>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm md:text-base tracking-wide truncate">{beat.title}</h3>
            </div>
            <div className="hidden md:flex items-center gap-6 text-xs font-mono text-white/55">
              <span>{beat.bpm} BPM</span>
              <span>{beat.key}</span>
              <span className="text-[#f1c40f]/60">{beat.style}</span>
              <span>{beat.mood.join(', ')}</span>
            </div>
            <span className="text-sm font-black tabular-nums">${beat.price}</span>
            <a href={beat.store_url} target="_blank" rel="noopener noreferrer" className="btn-primary py-2 px-3 text-xs whitespace-nowrap">
              <ShoppingBag className="w-3 h-3" />
              Buy
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 text-white/45">
          <Music className="w-12 h-12 mx-auto mb-4" />
          <p className="text-sm">No beats match your filters.</p>
        </div>
      )}

      {/* Browse More Beats CTA */}
      <div className="mt-16 relative overflow-hidden rounded-lg border border-[#f1c40f]/30 bg-gradient-to-r from-[#f1c40f]/10 via-black to-black p-8 md:p-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.06)_0%,_transparent_70%)]" />
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-4">
            BROWSE MORE BEATS
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Stream every beat, lease instantly, and download your files in seconds.
          </p>
          <a
            href="https://traktrain.com/flowellbeats"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            <ExternalLink className="w-4 h-4" />
            Explore Full Catalog
          </a>
        </div>
      </div>

      {/* Universal Player Bar */}
      <UniversalPlayer />
    </div>
  )
}

function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => onOpenChange(false)}>
      <div className="absolute inset-0 bg-black/80" />
      <div onClick={e => e.stopPropagation()} className="relative z-10">
        {children}
      </div>
    </div>
  )
}
function DialogTrigger({ children }: { children: React.ReactNode }) { return <>{children}</> }
function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}
function DialogHeader({ children }: { children: React.ReactNode }) { return <div className="mb-2">{children}</div> }
function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) { return <h2 className={className}>{children}</h2> }
