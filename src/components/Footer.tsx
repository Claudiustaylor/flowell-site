import Link from 'next/link'
import { Zap, ArrowUpRight } from 'lucide-react'
import { InstagramIcon, YoutubeIcon } from '@/components/BrandIcons'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <svg viewBox="0 0 600 200" className="h-10 w-auto mb-4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="600" height="200" fill="black"/>
              <g fontFamily="system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif" fontStyle="italic" fontWeight="900" fontSize="96" fill="white">
                <text x="40" y="135" letterSpacing="-2">FLOWELL</text>
              </g>
              <polygon points="258,45 320,82 285,85 345,125 270,95 295,92 235,55" fill="#F1C40F"/>
            </svg>
            <p className="text-white/30 text-sm leading-relaxed max-w-sm">
              Afrobeats, R&B, and hip-hop production. Custom beats, producer packs, and full production services.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 mb-4">Navigate</h4>
            <div className="space-y-2">
              {[
                { href: '/beats/', label: 'Beats' },
                { href: '/packs/', label: 'Packs' },
                { href: '/music/', label: 'Music' },
                { href: '/about/', label: 'About' },
                { href: '/contact/', label: 'Contact' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-sm text-white/40 hover:text-[#f1c40f] transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 mb-4">Social</h4>
            <div className="space-y-2">
              <a href="https://www.instagram.com/iamflowell/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/40 hover:text-[#f1c40f] transition-colors">
                <InstagramIcon className="w-4 h-4" /> Instagram
              </a>
              <a href="https://www.youtube.com/@IamFlowell" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/40 hover:text-[#f1c40f] transition-colors">
                <YoutubeIcon className="w-4 h-4" /> YouTube
              </a>
              <a href="https://www.tiktok.com/@flowell2x" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/40 hover:text-[#f1c40f] transition-colors">
                <Zap className="w-4 h-4" /> TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">© 2025 FLOWELL. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://traktrain.com/iamflowell" target="_blank" rel="noopener noreferrer" className="text-xs text-white/20 hover:text-[#f1c40f] transition-colors">Traktrain</a>
            <a href="https://www.beatstars.com/iamflowell/feed" target="_blank" rel="noopener noreferrer" className="text-xs text-white/20 hover:text-[#f1c40f] transition-colors">BeatStars</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
