"use client";

interface Pack3DMockupProps {
  name: string;
  tagline: string;
  accent: string;
  gradient: string;
  badge?: string;
  image?: string;
}

export function Pack3DMockup({ name, tagline, accent, gradient, badge, image }: Pack3DMockupProps) {
  const nameParts = name.split(" ");
  const lastWord = nameParts.pop() || "";
  const firstPart = nameParts.join(" ");

  // Depth is fixed in px for 3D perspective effect
  const D = 60;

  return (
    <div className="pack-3d-container w-full h-full flex items-center justify-center">
      <div className="pack-3d-box relative aspect-[3/4] w-[min(100%,300px)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 bg-neutral-950 border border-white/10 flex flex-col items-center justify-center text-center p-5 overflow-hidden"
          style={{
            transform: `translateZ(${D/2}px)`,
            background: image
              ? `linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.4) 100%), url(${image}) center / cover`
              : `linear-gradient(135deg, #0a0a0a 0%, ${accent}12 50%, #0a0a0a 100%)`,
            boxShadow: `0 20px 50px -10px ${accent}25, inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        >
          {image && (
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                background: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)`,
              }}
            />
          )}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(${accent}20 1px, transparent 1px), linear-gradient(90deg, ${accent}20 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />

          {badge && (
            <div
              className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-black tracking-[0.2em] uppercase z-10"
              style={{ background: accent, color: "#000" }}
            >
              {badge}
            </div>
          )}

          {/* When image is present, the cover art already has text — skip HTML overlay */}
          {!image && (
            <>
              <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
                <div className="mb-4">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="mx-auto drop-shadow-lg">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={accent} opacity="0.9" />
                  </svg>
                </div>
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/55 mb-6">{tagline}</p>
              </div>

              <div className="z-10 mb-auto mt-2">
                <h3 className="text-xl font-black italic tracking-tighter leading-none" style={{ color: accent }}>
                  {firstPart}
                </h3>
                <h3 className="text-xl font-black italic tracking-tighter leading-none text-white">
                  {lastWord}
                </h3>
              </div>
            </>
          )}

          {/* When image is present, add a subtle gradient at bottom for the bar to sit on */}
          {image && (
            <div
              className="absolute bottom-0 left-0 right-0 h-20 z-[5] pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
            />
          )}

          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 py-3 border-t border-white/5 z-10">
            <div className="text-[8px] font-mono text-white/45 uppercase tracking-wider">
              WAV · MIDI · STEMS
            </div>
            <div className="text-[10px] font-black" style={{ color: accent }}>
              {name.includes('CLUB') ? 'ACCESS' : 'VOL. 1'}
            </div>
          </div>
        </div>

        {/* Right Face */}
        <div
          className="absolute bg-neutral-900 border border-white/5"
          style={{
            width: D,
            height: '100%',
            right: -D/2,
            top: 0,
            transform: `rotateY(90deg)`,
            transformOrigin: 'center center',
            background: `linear-gradient(to bottom, #111 0%, ${accent}08 100%)`,
          }}
        />

        {/* Top Face */}
        <div
          className="absolute bg-neutral-900 border border-white/5"
          style={{
            width: '100%',
            height: D,
            left: 0,
            top: -D/2,
            transform: `rotateX(90deg)`,
            transformOrigin: 'center center',
            background: `linear-gradient(to right, #111 0%, ${accent}05 100%)`,
          }}
        />

        {/* Bottom Face */}
        <div
          className="absolute bg-neutral-900 border border-white/5"
          style={{
            width: '100%',
            height: D,
            left: 0,
            bottom: -D/2,
            transform: `rotateX(-90deg)`,
            transformOrigin: 'center center',
            background: `linear-gradient(to right, #111 0%, ${accent}05 100%)`,
          }}
        />

        {/* Back Face */}
        <div
          className="absolute inset-0 bg-neutral-950 border border-white/5 flex items-center justify-center"
          style={{
            transform: `rotateY(180deg) translateZ(${D/2}px)`,
            background: "linear-gradient(135deg, #050505 0%, #0a0a0a 100%)",
          }}
        >
          <div className="text-center opacity-20 px-6">
            <p className="text-[8px] font-mono tracking-wider uppercase text-white/55 mb-3">Tracklist</p>
            <div className="space-y-1.5">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[7px] font-mono text-white/45">{String(i).padStart(2,'0')}</span>
                  <div className="w-20 h-px bg-white/10" />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-[7px] font-mono text-white/60">FLOWELL SOUND STUDIOS</p>
            </div>
          </div>
        </div>

        {/* Shadow */}
        <div
          className="absolute bg-black/40 blur-2xl"
          style={{
            width: '80%',
            height: 40,
            left: '10%',
            bottom: -30,
            transform: `rotateX(90deg)`,
            transformOrigin: 'center top',
          }}
        />
      </div>
    </div>
  );
}