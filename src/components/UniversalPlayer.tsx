'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react'

export type PlayerTrack = {
  id: string
  title: string
  artist?: string
  audio_url: string
  cover_url?: string | null
  bpm?: number
  key?: string
}

type PlayerState = {
  currentTrack: PlayerTrack | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
}

let globalPlayerRef: UniversalPlayerRef | null = null

export type UniversalPlayerRef = {
  playTrack: (track: PlayerTrack, queue?: PlayerTrack[]) => void
  togglePlay: () => void
  stop: () => void
  getState: () => PlayerState
}

export function useUniversalPlayer() {
  return globalPlayerRef
}

export function UniversalPlayer({ tracks }: { tracks?: PlayerTrack[] }) {
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null)
  const [queue, setQueue] = useState<PlayerTrack[]>(tracks || [])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio()
    audio.volume = volume
    audioRef.current = audio

    const onTime = () => setCurrentTime(audio.currentTime)
    const onDur = () => setDuration(audio.duration || 0)
    const onEnd = () => {
      setIsPlaying(false)
      // Auto-advance to next track
      handleNext()
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDur)
    audio.addEventListener('durationchange', onDur)
    audio.addEventListener('ended', onEnd)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDur)
      audio.removeEventListener('durationchange', onDur)
      audio.removeEventListener('ended', onEnd)
      audio.pause()
    }
  }, [])

  const playTrack = useCallback((track: PlayerTrack, newQueue?: PlayerTrack[]) => {
    if (newQueue) setQueue(newQueue)
    const audio = audioRef.current
    if (!audio) return

    // Same track — toggle
    if (currentTrack?.id === track.id && audio.src) {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        audio.play().catch(() => {})
        setIsPlaying(true)
      }
      return
    }

    // New track
    setCurrentTrack(track)
    audio.src = track.audio_url
    audio.currentTime = 0
    audio.play().catch(() => {})
    setIsPlaying(true)
  }, [currentTrack, isPlaying])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [isPlaying, currentTrack])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setCurrentTrack(null)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  const handleNext = useCallback(() => {
    if (!currentTrack || queue.length === 0) return
    const idx = queue.findIndex(t => t.id === currentTrack.id)
    if (idx === -1 || idx >= queue.length - 1) return
    const next = queue[idx + 1]
    const audio = audioRef.current
    if (!audio) return
    setCurrentTrack(next)
    audio.src = next.audio_url
    audio.currentTime = 0
    audio.play().catch(() => {})
    setIsPlaying(true)
  }, [currentTrack, queue])

  const handlePrev = useCallback(() => {
    if (!currentTrack || queue.length === 0) return
    const audio = audioRef.current
    if (!audio) return
    // If more than 3 seconds in, restart current
    if (audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    const idx = queue.findIndex(t => t.id === currentTrack.id)
    if (idx <= 0) {
      audio.currentTime = 0
      return
    }
    const prev = queue[idx - 1]
    setCurrentTrack(prev)
    audio.src = prev.audio_url
    audio.currentTime = 0
    audio.play().catch(() => {})
    setIsPlaying(true)
  }, [currentTrack, queue])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
    setCurrentTime(time)
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }, [])

  const changeVolume = useCallback((v: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = v
    setVolume(v)
    if (v > 0 && isMuted) {
      audio.muted = false
      setIsMuted(false)
    }
  }, [isMuted])

  // Expose ref for external control
  const ref: UniversalPlayerRef = {
    playTrack,
    togglePlay,
    stop,
    getState: () => ({ currentTrack, isPlaying, currentTime, duration, volume, isMuted }),
  }
  globalPlayerRef = ref

  if (!currentTrack) return null

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      {/* Fixed bottom player bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 backdrop-blur-md border-t border-white/10">
        {/* Progress bar (full width, clickable) */}
        <div
          className="group h-1.5 bg-white/10 cursor-pointer relative"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const pct = (e.clientX - rect.left) / rect.width
            seek(pct * duration)
          }}
        >
          <div
            className="absolute top-0 left-0 h-full bg-[#f1c40f] transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
          {/* Hover indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#f1c40f] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Main player controls */}
        <div className="flex items-center gap-4 px-4 md:px-6 py-3">
          {/* Track info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {currentTrack.cover_url ? (
              <img
                src={currentTrack.cover_url}
                alt={currentTrack.title}
                className="w-12 h-12 object-cover flex-shrink-0 border border-white/10"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-[#f1c40f]/10 border border-[#f1c40f]/20 flex-shrink-0">
                <Music className="w-5 h-5 text-[#f1c40f]" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold tracking-wide truncate text-white">
                {currentTrack.title}
              </p>
              <p className="text-xs text-white/55 truncate">
                {currentTrack.artist || 'FLOWELL'}
                {currentTrack.bpm ? ` · ${currentTrack.bpm} BPM` : ''}
                {currentTrack.key ? ` · ${currentTrack.key}` : ''}
              </p>
            </div>
          </div>

          {/* Center controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handlePrev}
              className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-[#f1c40f] transition-colors"
              title="Previous track"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center bg-[#f1c40f] text-black hover:bg-[#f1c40f]/90 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-[#f1c40f] transition-colors"
              title="Next track"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Right controls — time + volume */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <span className="text-xs font-mono text-white/55 hidden md:block tabular-nums">
              {fmt(currentTime)} / {fmt(duration)}
            </span>

            {/* Volume control */}
            <div
              className="flex items-center gap-2 relative"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
              <button
                onClick={toggleMute}
                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-[#f1c40f] transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              {showVolume && (
                <div className="absolute bottom-full right-0 mb-2 p-3 bg-neutral-950 border border-white/10 rounded">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="w-24 accent-[#f1c40f]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}