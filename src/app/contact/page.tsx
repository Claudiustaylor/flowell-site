import { Zap, Music2, Mail, MapPin, Clock } from 'lucide-react'
import { InstagramIcon, YoutubeIcon } from '@/components/BrandIcons'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="pt-16 pb-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-20 pt-16">
        <p className="section-label">Get In Touch</p>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6">CONTACT</h1>
        <p className="text-lg text-white/30 max-w-lg mx-auto">
          Bookings, beat inquiries, collaborations, and everything else.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-black italic mb-4">Let&apos;s Work</h2>
            <p className="text-white/40 leading-relaxed mb-8">
              Whether you&apos;re an artist looking for your next single, a promoter booking shows, 
              or a brand seeking sync licensing — get in touch.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-white/10">
                  <Mail className="w-4 h-4 text-[#f1c40f]" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider uppercase text-white/30">Email</p>
                  <a href="mailto:flowellbeats@gmail.com" className="text-white/60 hover:text-[#f1c40f] transition-colors">
                    flowellbeats@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-white/10">
                  <MapPin className="w-4 h-4 text-[#f1c40f]" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider uppercase text-white/30">Location</p>
                  <p className="text-white/60">DMV Area, USA</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-white/10">
                  <Clock className="w-4 h-4 text-[#f1c40f]" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider uppercase text-white/30">Response Time</p>
                  <p className="text-white/60">Within 24-48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-950 border border-white/10 p-8">
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 mb-6">Services</h3>
          <div className="space-y-4">
            {[
              { name: 'Custom Beat', price: 'From $200', desc: 'Original composition tailored to your sound' },
              { name: 'Mixing', price: 'From $150/track', desc: 'Professional mix with analog emulation' },
              { name: 'Full Production', price: 'From $1,000', desc: 'Beat + recording + mix + master' },
              { name: 'Sync Licensing', price: 'Custom', desc: 'Film, TV, game, and commercial placement' },
            ].map(s => (
              <div key={s.name} className="flex items-start justify-between py-4 border-b border-white/5">
                <div>
                  <p className="font-bold">{s.name}</p>
                  <p className="text-xs text-white/30">{s.desc}</p>
                </div>
                <span className="text-sm font-black text-[#f1c40f]">{s.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="text-center border-t border-white/10 pt-16">
        <p className="section-label mb-8">Connect</p>
        <div className="flex items-center justify-center gap-6">
          <a href="https://www.instagram.com/iamflowell/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 flex items-center justify-center border border-white/10 hover:border-[#f1c40f] hover:text-[#f1c40f] transition-all">
            <InstagramIcon className="w-5 h-5" />
          </a>
          <a href="https://www.youtube.com/@IamFlowell" target="_blank" rel="noopener noreferrer" className="w-14 h-14 flex items-center justify-center border border-white/10 hover:border-[#f1c40f] hover:text-[#f1c40f] transition-all">
            <YoutubeIcon className="w-5 h-5" />
          </a>
          <a href="https://www.tiktok.com/@flowell2x" target="_blank" rel="noopener noreferrer" className="w-14 h-14 flex items-center justify-center border border-white/10 hover:border-[#f1c40f] hover:text-[#f1c40f] transition-all">
            <Zap className="w-5 h-5" />
          </a>
          <a href="https://open.spotify.com/artist/1Vswo3zB5kwT95O0mQVZH9" target="_blank" rel="noopener noreferrer" className="w-14 h-14 flex items-center justify-center border border-white/10 hover:border-[#f1c40f] hover:text-[#f1c40f] transition-all">
            <Music2 className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  )
}
