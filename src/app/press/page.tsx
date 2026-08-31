import Link from 'next/link'
import { ArrowLeft, ExternalLink, Play, Zap } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Press: Fear of God — Grammy Weekly Feature | FLOWELL',
  description:
    'Flowell steps from behind the boards on "Fear of God," the lead single from his debut album Fears. Featured in Grammy Weekly.',
  openGraph: {
    title: 'Flowell Steps From Behind the Boards on "Fear of God" — Grammy Weekly',
    description:
      'The DMV producer turned artist puts his own voice on the mic for the first time. Lead single from the debut album Fears, out September 9.',
    type: 'article',
  },
}

export default function PressPage() {
  return (
    <div className="pt-24 pb-24">
      {/* Back link */}
      <div className="px-6 max-w-3xl mx-auto mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-white/60 hover:text-[#f1c40f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Article header */}
      <article className="px-6 max-w-3xl mx-auto">
        {/* Category badge */}
        <div className="flex items-center gap-3 mb-8">
          <span className="px-3 py-1 bg-[#f1c40f]/10 border border-[#f1c40f]/20 text-xs font-bold tracking-[0.2em] uppercase text-[#f1c40f]">
            Music News
          </span>
          <span className="text-xs text-white/55">July 29, 2026</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-4 leading-tight">
          Flowell Steps From Behind the Boards on &ldquo;Fear of God,&rdquo; the Lead Single From His Debut Album{' '}
          <span className="text-[#f1c40f]">Fears</span>
        </h1>

        <p className="text-lg text-white/70 mb-8">
          The DMV producer turned artist puts his own voice on the mic for the first time
        </p>

        {/* Source attribution */}
        <div className="flex items-center gap-3 pb-8 border-b border-white/10 mb-12">
          <div className="w-10 h-10 bg-neutral-950 border border-white/10 flex items-center justify-center text-sm font-black italic text-[#f1c40f]">
            GW
          </div>
          <div>
            <p className="text-sm font-bold text-white/60">Grammy Weekly</p>
            <p className="text-xs text-white/55">Written by Rosselia</p>
          </div>
          <a
            href="https://grammyweekly.com/flowell-steps-from-behind-the-boards-on-fear-of-god-the-lead-single-from-his-debut-album-fears/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-xs text-white/55 hover:text-[#f1c40f] transition-colors"
          >
            Original Article
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Article body */}
        <div className="space-y-6 text-white/70 leading-relaxed">
          <p className="text-lg text-white/80">
            Flowell has spent years building other people&rsquo;s sound. Now he is putting his own name on the label.
          </p>

          <p>
            The DMV based producer and recording artist releases &ldquo;Fear of God&rdquo; as the lead single from his
            debut album <span className="text-[#f1c40f]">Fears</span>, out September 9. It is the first time Flowell
            steps out from behind the boards and puts his own voice front and center on a project built entirely around
            his own story.
          </p>

          {/* Section: A Producer's Catalog */}
          <h2 className="text-xl font-black italic tracking-tight text-white mt-12 mb-4">
            A Producer&rsquo;s Catalog, an Artist&rsquo;s Arrival
          </h2>
          <p>
            Flowell has built his name at the intersection of Afrobeats, R&amp;B, hip hop, trap, Afroswing, and Lo Fi,
            a genre blend that has carried his production work across hundreds of beats and placements. His sound draws
            from West African percussion cadences, Atlanta trap intensity, UK Afroswing melody, and late night{' '}
            R&amp;B texture, all built from scratch with original composition, custom drum programming, and layered
            synth work. No uncleared samples, no shortcuts, just a catalog built one record at a time.
          </p>
          <p>
            That same attention to detail defines Fear of God. The track carries two meanings at once, reverence and
            warning, and the production is built to make both land. It is a hard, confident opener with no wasted space,
            the kind of record that makes clear Flowell&rsquo;s move from the producer&rsquo;s chair to the
            artist&rsquo;s seat is not a side project. It is the plan.
          </p>

          {/* Section: The Sound of Fears */}
          <h2 className="text-xl font-black italic tracking-tight text-white mt-12 mb-4">
            The Sound of Fears
          </h2>
          <p>
            Fear of God sets the tone for what Fears is building toward. Where most producer to artist transitions play
            it safe, Flowell is using this album to put his full range on display, pulling from every corner of his
            catalog rather than narrowing his sound to fit a single lane. Expect the same genre blending that has
            defined his beats, now shaped around verses, hooks, and a body of work meant to be heard start to finish
            rather than sampled in pieces.
          </p>

          {/* Section: A Stacked Supporting Cast */}
          <h2 className="text-xl font-black italic tracking-tight text-white mt-12 mb-4">
            A Stacked Supporting Cast
          </h2>
          <p>
            Fears brings a strong lineup of collaborators into the fold. R&amp;B vocalist{' '}
            <span className="text-white">Carl B</span> lends his voice to the project, adding a polished, emotive edge
            that rounds out the album&rsquo;s sound.
          </p>
          <p>
            <span className="text-white">Lexy Priest</span> brings raw energy and a sharp pen to his feature, reflecting
            the strength of the DMV&rsquo;s rising underground scene. <span className="text-white">Shad</span> also
            appears on the album, contributing a voice that adds range and depth to the tracklist. Behind the boards,
            producer <span className="text-white">Runitup AD</span> rounds out a stellar production cast, bringing an
            additional layer of polish and punch to the record. Together the features and production team give Fears a
            fuller, more dynamic sound without pulling focus from Flowell&rsquo;s own arrival as an artist.
          </p>

          {/* Section: From Type Beats to a Full Body of Work */}
          <h2 className="text-xl font-black italic tracking-tight text-white mt-12 mb-4">
            From Type Beats to a Full Body of Work
          </h2>
          <p>
            Flowell has spent his career treating every release as a foundation for what comes next, and Fears is the
            biggest one he has built. His YouTube channel has become a hub for that process, pairing type beat content
            and visualizers with a growing audience that has followed his evolution from beatmaker to full artist. Fear
            of God is the bridge between those two chapters, a record built with a producer&rsquo;s precision and an
            artist&rsquo;s stakes.
          </p>

          {/* Section: What's Next */}
          <h2 className="text-xl font-black italic tracking-tight text-white mt-12 mb-4">
            What&rsquo;s Next for Flowell
          </h2>
          <p>
            With Fears landing September 9, Fear of God is the marker that starts the countdown. Flowell has made it
            clear that this album is not about easing into a new lane, it is about arriving in it fully formed. Expect
            the rollout to carry the same energy that has defined his catalog so far: layered, deliberate, and built
            for repeat plays.
          </p>

          <p className="text-lg text-white/80">
            Stream &ldquo;Fear of God&rdquo; now and get familiar before Fears arrives in full on September 9.
          </p>
        </div>

        {/* Links */}
        <div className="mt-12 space-y-3 border-y border-white/10 py-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/55 mb-4">Listen & Follow</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'Stream "Fear of God"', href: 'https://too.fm/fog' },
              { label: 'YouTube — @FlowellBeats', href: 'https://www.youtube.com/@flowellbeats' },
              { label: 'Instagram — @iamflowell', href: 'https://www.instagram.com/iamflowell/' },
              { label: 'TikTok — @flowellhype', href: 'https://www.tiktok.com/@flowellhype' },
              { label: 'Spotify — Flowell', href: 'https://open.spotify.com/artist/1Vswo3zB5kwT95O0mQVZH9' },
              { label: 'Official Website — iamflowell.com', href: 'https://iamflowell.com' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-[#f1c40f] transition-colors group"
              >
                <span className="w-1 h-1 bg-[#f1c40f] group-hover:scale-150 transition-transform" />
                {link.label}
                <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://too.fm/fog"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
          >
            <Play className="w-4 h-4" />
            Stream Fear of God
          </a>
          <Link href="/subscribe/" className="btn-outline text-sm">
            <Zap className="w-4 h-4" />
            Get FEARS Early
          </Link>
        </div>

        <p className="text-center text-xs text-white/55 mt-8">
          <span className="text-[#f1c40f]">Fears</span> drops September 9, 2026.
        </p>
      </article>
    </div>
  )
}