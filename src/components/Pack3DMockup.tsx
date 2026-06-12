"use client";

interface Pack3DMockupProps {
  name: string;
  tagline: string;
  accent: string;
  gradient: string;
  badge?: string;
}

export function Pack3DMockup({ name, tagline, accent, gradient, badge }: Pack3DMockupProps) {
  return (
    <div className="relative w-full aspect-square perspective-[1200px] group">
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out preserve-3d group-hover:rotate-y-12 group-hover:rotate-x-[-8deg]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Main box front face */}
        <div
          className="absolute w-[70%] h-[80%] bg-neutral-950 border border-white/10 flex flex-col items-center justify-center text-center p-6 shadow-2xl"
          style={{
            transform: "translateZ(60px)",
            background: `linear-gradient(135deg, #0a0a0a 0%, ${accent}15 50%, #0a0a0a 100%)`,
            boxShadow: `0 25px 60px -15px ${accent}30, 0 0 80px -40px ${accent}20`,
          }}
        >
          {badge && (
            <div
              className="absolute top-4 left-4 px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase"
              style={{ background: accent, color: "#000" }}
            >
              {badge}
            </div>
          )}
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto">
              <polygon points="12,2 20,8 16,9 22,14 14,10 16,9.5 8,4" fill={accent} opacity="0.6" />
            </svg>
          </div>
          <h3 className="text-2xl font-black italic tracking-tight leading-none mb-2" style={{ color: accent }}>
            {name.split(" ").slice(0, -1).join(" ")}
          </h3>
          <h3 className="text-2xl font-black italic tracking-tight leading-none mb-4 text-white">
            {name.split(" ").slice(-1)[0]}
          </h3>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/40">{tagline}</p>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider">
              WAV · MIDI · PROJECT
            </div>
            <div className="text-xs font-black" style={{ color: accent }}>
              VOL. 1
            </div>
          </div>
        </div>

        {/* Right side face */}
        <div
          className="absolute w-[20%] h-[80%] bg-neutral-900 border border-white/5"
          style={{
            transform: "rotateY(90deg) translateZ(60px)",
            right: "15%",
            background: `linear-gradient(to bottom, #111 0%, ${accent}08 100%)`,
          }}
        />

        {/* Top face */}
        <div
          className="absolute w-[70%] h-[20%] bg-neutral-900 border border-white/5"
          style={{
            transform: "rotateX(90deg) translateZ(60px)",
            top: "10%",
            background: `linear-gradient(to right, #111 0%, ${accent}05 100%)`,
          }}
        />

        {/* Back face */}
        <div
          className="absolute w-[70%] h-[80%] bg-neutral-950 border border-white/5 flex items-center justify-center"
          style={{
            transform: "rotateY(180deg) translateZ(60px)",
            background: "linear-gradient(135deg, #050505 0%, #0a0a0a 100%)",
          }}
        >
          <div className="text-center opacity-30">
            <p className="text-[8px] font-mono tracking-wider uppercase text-white/40 mb-2">Tracklist</p>
            <div className="space-y-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[7px] font-mono text-white/20">{String(i).padStart(2,'0')}</span>
                  <div className="w-16 h-px bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shadow/reflection plane */}
        <div
          className="absolute w-[70%] h-[20%] bg-black/40 blur-xl"
          style={{
            transform: "rotateX(90deg) translateZ(-100px)",
            bottom: "0%",
          }}
        />
      </div>
    </div>
  );
}
