"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  "rgba(255, 230, 0, 0.7)",   // bright yellow
  "rgba(255, 214, 0, 0.6)",    // warm yellow
  "rgba(255, 255, 255, 0.4)",  // white
  "rgba(255, 230, 0, 0.5)",    // yellow glow
  "rgba(241, 196, 15, 0.6)",   // gold
];

interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  pulse: number;
  pulseSpeed: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ParticleData[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(dpr, dpr);
    };

    const createParticle = (): ParticleData => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 3 + 1.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: Math.random() * 400 + 200,
        maxLife: 0,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      };
    };

    const resetParticle = (p: ParticleData) => {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.vx = (Math.random() - 0.5) * 0.6;
      p.vy = (Math.random() - 0.5) * 0.6;
      p.size = Math.random() * 3 + 1.5;
      p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      p.life = Math.random() * 400 + 200;
      p.maxLife = p.life;
      p.pulse = Math.random() * Math.PI * 2;
    };

    const init = () => {
      resize();
      particlesRef.current = [];
      for (let i = 0; i < 60; i++) {
        const p = createParticle();
        p.maxLife = p.life;
        particlesRef.current.push(p);
      }
    };

    const update = (p: ParticleData) => {
      const angle =
        (Math.sin(p.x * 0.002) + Math.cos(p.y * 0.002)) * Math.PI * 2;
      p.vx += Math.cos(angle) * 0.01;
      p.vy += Math.sin(angle) * 0.01;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.pulse += p.pulseSpeed;

      // Mouse interaction - particles flee from mouse
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = ((200 - dist) / 200) * 0.05;
        p.vx += dx * force;
        p.vy += dy * force;
      }

      if (
        p.life <= 0 ||
        p.x < -50 ||
        p.x > width + 50 ||
        p.y < -50 ||
        p.y > height + 50
      ) {
        resetParticle(p);
      }
    };

    const draw = (p: ParticleData) => {
      const alpha = p.life / p.maxLife;
      const pulseSize = p.size * (1 + Math.sin(p.pulse) * 0.3);
      const glowSize = pulseSize * 4;

      // Draw glow
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
      const baseColor = p.color.replace(/[\d.]+\)$/, '');
      glow.addColorStop(0, baseColor + `${alpha * 0.5})`);
      glow.addColorStop(0.5, baseColor + `${alpha * 0.15})`);
      glow.addColorStop(1, baseColor + `0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Draw core
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseSize * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = baseColor + `${alpha})`;
      ctx.fill();
    };

    const animate = () => {
      // Clear with very slight fade for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        update(p);
        draw(p);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    init();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1, zIndex: 1 }}
    />
  );
}
