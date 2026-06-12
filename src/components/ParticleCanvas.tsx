"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  "rgba(255, 230, 0, 0.3)",
  "rgba(255, 214, 0, 0.25)",
  "rgba(255, 255, 255, 0.08)",
  "rgba(255, 230, 0, 0.15)",
  "rgba(200, 200, 200, 0.06)",
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
  trail: { x: number; y: number }[];
  trailLength: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ParticleData[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const createParticle = (): ParticleData => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: Math.random() * 200 + 100,
        maxLife: 0,
        trail: [],
        trailLength: Math.floor(Math.random() * 20 + 10),
      };
    };

    const resetParticle = (p: ParticleData) => {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.vx = (Math.random() - 0.5) * 0.4;
      p.vy = (Math.random() - 0.5) * 0.4;
      p.size = Math.random() * 1.5 + 0.5;
      p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      p.life = Math.random() * 200 + 100;
      p.maxLife = p.life;
      p.trail = [];
      p.trailLength = Math.floor(Math.random() * 20 + 10);
    };

    const init = () => {
      resize();
      particlesRef.current = [];
      for (let i = 0; i < 80; i++) {
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

      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > p.trailLength) {
        p.trail.shift();
      }

      // Mouse interaction
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const dx = mx - p.x;
      const dy = my - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = ((200 - dist) / 200) * 0.02;
        p.vx += dx * force * 0.01;
        p.vy += dy * force * 0.01;
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

      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        ctx.strokeStyle = p.color.replace(/[\d.]+\)$/, `${alpha * 0.5})`);
        ctx.lineWidth = p.size * 0.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha})`);
      ctx.fill();
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
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

    init();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
