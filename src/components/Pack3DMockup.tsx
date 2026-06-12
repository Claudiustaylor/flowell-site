"use client";

interface Pack3DMockupProps {
  name: string;
  tagline: string;
  accent: string;
  gradient: string;
  badge?: string;
}

export function Pack3DMockup({ name, tagline, accent, gradient, badge }: Pack3DMockupProps) {
  // Split name: "OASIS VOL. 1" → "OASIS VOL." + "1"
  const nameParts = name.split(" ");
  const lastWord = nameParts.pop() || "";
  const firstPart = nameParts.join(" ");

  return (
    <div className="pack-3d-container w-full h-full flex items-center justify-center p-4 md:p-6">
      <div className="pack-3d-box relative w-full max-w-[300px] aspect-[3/4]">
        {/* Main Front Face */}
        <div
          className="absolute inset-0 pack-face-front bg-neutral-950 border border-white/10 flex flex-col items-center justify-center text-center p-5 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #0a0a0a 0%, ${accent}12 50%, #0a0a0a 100%)`,
            boxShadow: `0 20px 50px -10px ${accent}25, inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        >
          {/* Subtle grid pattern */}
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

          {/* Top section: icon + tagline */}
          <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
            <div className="mb-4">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="mx-auto drop-shadow-lg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={accent} opacity="0.9" />
              </svg>
            </div>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30 mb-6">{tagline}</p>
          </div>

          {/* Middle: Title */}
          <div className="z-10 mb-auto mt-2">
            <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter leading-none" style={{ color: accent }}>
              {firstPart}
            </h3>
            <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter leading-none text-white">
              {lastWord}
            </h3>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 py-3 border-t border-white/5 z-10">
            <div className="text-[8px] font-mono text-white/20 uppercase tracking-wider">
              WAV · MIDI · STEMS
            </div>
            <div className="text-[10px] font-black" style={{ color: accent }}>
              VOL. 1
            </div>
          </div>
        </div>

        {/* Right edge (thickness) */}
        <div
          className="absolute top-0 bottom-0 right-0 w-[40px] bg-neutral-900 border-r border-white/5"
          style={{
            transform: "rotateY(90deg)",
            transformOrigin: "right center",
            background: `linear-gradient(to bottom, #111 0%, ${accent}08 100%)`,
          }}
        />

        {/* Bottom edge (thickness) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[40px] bg-neutral-900 border-b border-white/5"
          style={{
            transform: "rotateX(-90deg)",
            transformOrigin: "bottom center",
            background: `linear-gradient(to right, #111 0%, ${accent}05 100%)`,
          }}
        />

        {/* Back face */}
        <div
          className="absolute inset-0 bg-neutral-950 border border-white/5 flex items-center justify-center"
          style={{
            transform: "rotateY(180deg) translateZ(40px)",
            background: "linear-gradient(135deg, #050505 0%, #0a0a0a 100%)",
          }}
        >
          <div className="text-center opacity-20 px-6">
            <p className="text-[8px] font-mono tracking-wider uppercase text-white/30 mb-3">Tracklist</p>
            <div className="space-y-1.5">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[7px] font-mono text-white/20">{String(i).padStart(2,'0')}</span>
                  <div className="w-20 h-px bg-white/10" />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-[7px] font-mono text-white/15">FLOWELL SOUND STUDIOS</p>
            </div>
          </div>
        </div>

        {/* Shadow plane */}
        <div
          className="absolute left-[10%] right-[10%] bottom-[-60px] h-[60px] bg-black/50 blur-2xl"
          style={{ transform: "rotateX(90deg)", transformOrigin: "center top" }}
        />
      </div>
    </div>
  );
}
