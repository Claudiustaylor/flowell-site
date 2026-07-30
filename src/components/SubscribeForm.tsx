'use client'

import { useState } from 'react'
import { Mail, Check, Loader2, AlertCircle } from 'lucide-react'

type Props = {
  source?: string
  variant?: 'full' | 'compact'
  className?: string
}

export function SubscribeForm({ source = 'website', variant = 'full', className = '' }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong.')
        return
      }

      setStatus('success')
      setEmail('')

      // Track signup conversion in Google Analytics
      const w = window as unknown as { gtag?: (...args: unknown[]) => void }
      if (typeof window !== 'undefined' && w.gtag) {
        w.gtag('event', 'subscribe', {
          event_category: 'engagement',
          event_label: source,
          value: 1,
        })
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="w-16 h-16 flex items-center justify-center bg-[#f1c40f]/10 border border-[#f1c40f]/30 mb-6">
          <Check className="w-8 h-8 text-[#f1c40f]" />
        </div>
        <h3 className="text-2xl font-black italic tracking-tight mb-2">You&apos;re in.</h3>
        <p className="text-white/50 text-sm max-w-xs">
          Check your inbox for the free beat download. FEARS drops September 4 — you&apos;ll hear it first.
        </p>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`w-full ${className}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={status === 'loading'}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 focus:border-[#f1c40f] text-white placeholder-white/30 text-sm outline-none transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary text-xs whitespace-nowrap disabled:opacity-50"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Mail className="w-3 h-3" />
                Get the Free Beat
              </>
            )}
          </button>
        </div>
        {status === 'error' && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errorMsg}
          </p>
        )}
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-md ${className}`}>
      <div className="flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={status === 'loading'}
          className="w-full px-5 py-4 bg-white/5 border border-white/10 focus:border-[#f1c40f] text-white placeholder-white/30 text-base outline-none transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary w-full text-sm justify-center disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding you to the list...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Get the Free Beat + Early Access
            </>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errorMsg}
        </p>
      )}
      <p className="text-white/20 text-xs mt-4 text-center">
        No spam. Just beats, updates, and early access. Unsubscribe anytime.
      </p>
    </form>
  )
}