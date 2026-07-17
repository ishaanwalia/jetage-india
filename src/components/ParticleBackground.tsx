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

// Two-tone cyan only — one calm color family instead of six competing brights.
const COLORS = ["#0891b2", "#22d3ee"];
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
    const particleCount = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 20000));
    const glowSprites = createGlowSprites(48);

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.15,
      colorIndex: Math.floor(Math.random() * COLORS.length),
      glow: Math.random() * 10 + 5,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Only run while the hero is on screen: fade out over the first viewport
    // of scroll and stop the loop entirely once fully faded.
    let running = false;

    const heroFade = () =>
      Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.9));

    const animate = () => {
      const fade = heroFade();
      if (fade <= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        running = false;
        return;
      }

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
          p.vx += (mdx / mDist) * force * 0.03;
          p.vy += (mdy / mDist) * force * 0.03;
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
        ctx.globalAlpha = p.opacity * 0.12 * fade;
        ctx.drawImage(glowSprites[p.colorIndex], p.x - p.glow, p.y - p.glow, p.glow * 2, p.glow * 2);

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[p.colorIndex];
        ctx.globalAlpha = p.opacity * fade;
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
            ctx.globalAlpha = (1 - dist / CONNECT_DIST) * 0.15 * fade;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    const start = () => {
      if (running || reducedMotion || document.hidden) return;
      running = true;
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      // Restart the loop when the user scrolls back up into the hero.
      if (heroFade() > 0) start();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleVisibility = () => {
      cancelAnimationFrame(animationRef.current);
      running = false;
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    start();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(animationRef.current);
      running = false;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.55 }}
    />
  );
}
