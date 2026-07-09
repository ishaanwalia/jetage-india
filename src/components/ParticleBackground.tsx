"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  colorIndex: number;
  glow: number;
}

const COLORS = ["#0891b2", "#22d3ee", "#0e7490", "#67e8f9", "#06b6d4", "#a5f3fc"];
const CONNECT_DIST = 70;
const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;

// Pre-render one glow sprite per color so the animation loop only does cheap
// drawImage calls instead of building a radial gradient per particle per frame.
function createGlowSprites(size: number): HTMLCanvasElement[] {
  return COLORS.map((color) => {
    const sprite = document.createElement("canvas");
    sprite.width = size;
    sprite.height = size;
    const sctx = sprite.getContext("2d")!;
    const half = size / 2;
    const gradient = sctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "transparent");
    sctx.fillStyle = gradient;
    sctx.fillRect(0, 0, size, size);
    return sprite;
  });
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Keep the count low: the connection pass below compares every pair of
    // particles, so cost grows with the square of this number.
    const particleCount = Math.min(140, Math.floor((window.innerWidth * window.innerHeight) / 14000));
    const glowSprites = createGlowSprites(48);

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: Math.random() * 3 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      colorIndex: Math.floor(Math.random() * COLORS.length),
      glow: Math.random() * 12 + 6,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mDistSq = mdx * mdx + mdy * mdy;
        if (mDistSq < 90000 && mDistSq > 1) {
          const mDist = Math.sqrt(mDistSq);
          const force = (300 - mDist) / 300;
          p.vx += (mdx / mDist) * force * 0.05;
          p.vy += (mdy / mDist) * force * 0.05;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Wrap around edges
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;

        // Glow (pre-rendered sprite)
        ctx.globalAlpha = p.opacity * 0.15;
        ctx.drawImage(glowSprites[p.colorIndex], p.x - p.glow, p.y - p.glow, p.glow * 2, p.glow * 2);

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[p.colorIndex];
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECT_DIST_SQ) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = COLORS[p.colorIndex];
            ctx.globalAlpha = (1 - dist / CONNECT_DIST) * 0.3;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleVisibility = () => {
      cancelAnimationFrame(animationRef.current);
      if (!document.hidden && !reducedMotion) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    if (!reducedMotion) animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.9 }}
      />
      {/* Custom cursor glow — moved via transform so it never triggers layout */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-8 h-8 rounded-full border-2 border-jet-primary/50 hidden lg:block"
        style={{
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
          transition: "transform 0.08s linear",
          boxShadow: "0 0 20px rgba(8, 145, 178, 0.4), 0 0 40px rgba(8, 145, 178, 0.2)",
        }}
      />
    </>
  );
}
