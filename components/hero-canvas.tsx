"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

type Bolt = {
  points: Point[];
  branches: Point[][];
  spawnedAt: number;
  duration: number;
};

/** Midpoint-displacement lightning path */
function jaggedPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  depth: number,
  spread: number
): Point[] {
  if (depth === 0) return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * spread;
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * spread * 0.15;
  const left = jaggedPath(x1, y1, mx, my, depth - 1, spread * 0.55);
  const right = jaggedPath(mx, my, x2, y2, depth - 1, spread * 0.55);
  return [...left.slice(0, -1), ...right];
}

/** Spawn a top-down bolt from a random x position */
function spawnBolt(w: number, h: number, now: number): Bolt {
  const x = w * 0.1 + Math.random() * w * 0.8;
  const endX = x + (Math.random() - 0.5) * w * 0.25;
  const endY = h * (0.35 + Math.random() * 0.5);
  const pts = jaggedPath(x, 0, endX, endY, 6, w * 0.28);

  const branches: Point[][] = [];
  for (let i = 4; i < pts.length - 4; i++) {
    if (Math.random() < 0.09) {
      const p = pts[i];
      branches.push(
        jaggedPath(
          p.x, p.y,
          p.x + (Math.random() - 0.5) * w * 0.18,
          p.y + Math.random() * h * 0.15,
          4, w * 0.1
        )
      );
    }
  }

  return { points: pts, branches, spawnedAt: now, duration: 500 + Math.random() * 400 };
}

/** Spawn bolts radiating from a click position */
function spawnClickBolts(cx: number, cy: number, w: number, h: number, now: number): Bolt[] {
  const count = 2 + Math.floor(Math.random() * 2); // 2–3 bolts
  const bolts: Bolt[] = [];
  for (let i = 0; i < count; i++) {
    // Bias upward, spread in random directions
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
    const len = h * (0.25 + Math.random() * 0.35);
    const endX = cx + Math.cos(angle) * len;
    const endY = cy + Math.sin(angle) * len;
    const pts = jaggedPath(cx, cy, endX, endY, 5, w * 0.2);

    const branches: Point[][] = [];
    for (let j = 3; j < pts.length - 3; j++) {
      if (Math.random() < 0.12) {
        const p = pts[j];
        const bAngle = angle + (Math.random() - 0.5) * 1.2;
        const bLen = len * 0.25;
        branches.push(
          jaggedPath(p.x, p.y, p.x + Math.cos(bAngle) * bLen, p.y + Math.sin(bAngle) * bLen, 3, w * 0.08)
        );
      }
    }
    bolts.push({ points: pts, branches, spawnedAt: now, duration: 600 + Math.random() * 300 });
  }
  return bolts;
}

function drawBolt(
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  alpha: number,
  lineWidth: number,
  glowColor: string,
  coreColor: string,
  glowBlur: number
) {
  if (pts.length < 2) return;

  ctx.save();
  ctx.globalAlpha = alpha * 0.55;
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = lineWidth + 3;
  ctx.shadowBlur = glowBlur;
  ctx.shadowColor = glowColor;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = coreColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
  ctx.restore();
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Point>({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bolts: Bolt[] = [];
    let nextBolt = 800; // delay first auto bolt slightly
    let raf = 0;

    // ── Sizing ───────────────────────────────────────────────────────────
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Mouse + click on parent section (canvas is pointer-events-none) ──
    const section = canvas.parentElement;

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      const now = performance.now();
      bolts.push(...spawnClickBolts(cx, cy, canvas.width, canvas.height, now));
    };

    section?.addEventListener("mousemove", onMove);
    section?.addEventListener("mouseleave", onLeave);
    section?.addEventListener("click", onClick);

    // ── Color helpers ────────────────────────────────────────────────────
    const isDark = () => document.documentElement.classList.contains("dark");

    // ── Main loop ────────────────────────────────────────────────────────
    const tick = (ts: number) => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      const dark = isDark();
      const boltCore   = dark ? "rgba(210,225,255,0.95)" : "rgba(70,110,210,0.90)";
      const boltGlow   = dark ? "rgba(110,160,255,0.8)"  : "rgba(100,140,255,0.55)";
      const branchGlow = dark ? "rgba(100,150,255,0.5)"  : "rgba(90,130,220,0.4)";

      // ── Auto-spawn lightning ─────────────────────────────────────────
      if (ts >= nextBolt) {
        bolts.push(spawnBolt(W, H, ts));
        if (Math.random() < 0.2) bolts.push(spawnBolt(W, H, ts));
        nextBolt = ts + 2200 + Math.random() * 3800;
      }

      // ── Draw lightning ───────────────────────────────────────────────
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        const t = (ts - b.spawnedAt) / b.duration;
        if (t > 1) { bolts.splice(i, 1); continue; }

        const alpha = t < 0.12
          ? t / 0.12
          : Math.pow(1 - (t - 0.12) / 0.88, 1.6);

        drawBolt(ctx, b.points, alpha, 1.5, boltGlow, boltCore, 18);
        for (const br of b.branches) {
          drawBolt(ctx, br, alpha * 0.65, 1, branchGlow, branchGlow, 10);
        }
      }

      // ── Magnetic needle vector field ─────────────────────────────────
      // Each grid point is a small ellipse that stretches and rotates
      // toward the mouse — like compass needles or iron filings.
      const { x: mx, y: my } = mouseRef.current;
      const hasMouse = mx > -1000;
      const SPACING = 58;
      const MAX_DIST = 300;

      for (let gy = SPACING * 0.5; gy < H; gy += SPACING) {
        for (let gx = SPACING * 0.5; gx < W; gx += SPACING) {
          const dx = mx - gx;
          const dy = my - gy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = hasMouse && dist < MAX_DIST ? 1 - dist / MAX_DIST : 0;

          // Ellipse radii: stretches from circle → needle as influence grows
          const rX = 1.8 + influence * 9;   // elongates toward mouse
          const rY = 1.8 - influence * 0.9; // stays slim
          const angle = influence > 0 ? Math.atan2(dy, dx) : 0;

          const baseAlpha = dark ? 0.13 : 0.11;
          const alpha = baseAlpha + influence * (dark ? 0.38 : 0.30);
          const fillColor = dark
            ? `rgba(120,170,255,${alpha})`
            : `rgba(70,110,215,${alpha})`;

          ctx.save();
          ctx.translate(gx, gy);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, rX, Math.max(rY, 0.8), 0, 0, Math.PI * 2);
          ctx.fillStyle = fillColor;
          ctx.fill();
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section?.removeEventListener("mousemove", onMove);
      section?.removeEventListener("mouseleave", onLeave);
      section?.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
