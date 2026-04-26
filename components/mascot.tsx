"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";

// Each pose is a Lottie that references its pixel-art SVG as an external
// image asset (`/mascot/<pose>.svg`). The Lottie itself is tiny (~1KB) — it
// just carries keyframe data for transform-level motion (subtle bobbing,
// breathing, head tilt, etc.) so the mascot feels alive instead of swapping
// between still frames like a GIF.
import waveHero       from "@/public/mascot/lottie/wave-hero.json";
import idle           from "@/public/mascot/lottie/idle.json";
import attentiveLeft  from "@/public/mascot/lottie/attentive-left.json";
import attentiveRight from "@/public/mascot/lottie/attentive-right.json";
import curious        from "@/public/mascot/lottie/curious.json";
import offering       from "@/public/mascot/lottie/offering.json";
import coffee         from "@/public/mascot/lottie/coffee.json";
import sleepingAway   from "@/public/mascot/lottie/sleeping-away.json";
import reading        from "@/public/mascot/lottie/reading.json";
import calm           from "@/public/mascot/lottie/calm.json";

// ── Types ─────────────────────────────────────────────────────────────────────

type Pose =
  | "wave-hero"
  | "idle"
  | "attentive-left"
  | "attentive-right"
  | "curious"
  | "offering"
  | "coffee"
  | "sleeping-away"
  | "reading"
  | "calm";

/** Lottie animationData, keyed by pose. */
const LOTTIE_DATA: Record<Pose, object> = {
  "wave-hero":       waveHero,
  "idle":            idle,
  "attentive-left":  attentiveLeft,
  "attentive-right": attentiveRight,
  "curious":         curious,
  "offering":        offering,
  "coffee":          coffee,
  "sleeping-away":   sleepingAway,
  "reading":         reading,
  "calm":            calm,
};

/** Every pose, pre-declared so all Lotties mount from the start. */
const ALL_POSES: Pose[] = [
  "wave-hero", "idle", "attentive-left", "attentive-right",
  "curious", "offering", "coffee", "sleeping-away", "reading", "calm",
];

// ── Section map ───────────────────────────────────────────────────────────────

/** Map each section id → the pose shown while that section dominates the viewport */
const SECTION_POSE: Record<string, Pose> = {
  hero:    "wave-hero",
  skills:  "curious",
  work:    "curious",
  about:   "reading",
  values:  "calm",
  contact: "offering",
};
const SECTION_IDS = ["hero", "skills", "work", "about", "values", "contact"];

/** ms of inactivity before the mascot reaches for coffee */
const COFFEE_MS = 20_000;
/** ms after coffee before the mascot falls asleep */
const SLEEP_MS  = 45_000;

// ── PoseLayer ─────────────────────────────────────────────────────────────────

/**
 * One Lottie per pose. Non-active layers are paused so only one animation
 * runs at a time — keeps the per-frame cost tiny even though every pose is
 * mounted.
 */
function PoseLayer({ pose, active }: { pose: Pose; active: boolean }) {
  const ref = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    const api = ref.current;
    if (!api) return;
    if (active) api.play();
    else        api.pause();
  }, [active]);

  return (
    <Lottie
      lottieRef={ref}
      animationData={LOTTIE_DATA[pose]}
      loop
      autoplay={active}
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
      className="w-full h-full drop-shadow-lg"
    />
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Mascot() {
  const [pose, setPose] = useState<Pose>("wave-hero");

  /** The pose driven by the currently visible section */
  const sectionPoseRef = useRef<Pose>("wave-hero");
  /** Whether the hero section is currently dominant */
  const inHeroRef      = useRef(true);
  /**
   * Track which half of the viewport the cursor is in while in hero,
   * so we only switch between attentive-left / attentive-right on crossing,
   * not on every mousemove event.
   */
  const heroSideRef    = useRef<"left" | "right" | null>(null);

  const coffeeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const sleepTimerRef  = useRef<ReturnType<typeof setTimeout>>(undefined);

  // ── Idle timers ────────────────────────────────────────────────────────────

  const resetIdle = useCallback(() => {
    clearTimeout(coffeeTimerRef.current);
    clearTimeout(sleepTimerRef.current);

    coffeeTimerRef.current = setTimeout(() => {
      setPose("coffee");
      sleepTimerRef.current = setTimeout(
        () => setPose("sleeping-away"),
        SLEEP_MS - COFFEE_MS
      );
    }, COFFEE_MS);
  }, []);

  // ── Section intersection tracker ───────────────────────────────────────────

  useEffect(() => {
    const ratioMap = new Map<string, number>();
    const observers: IntersectionObserver[] = [];

    const refresh = () => {
      let best   = 0;
      let winner = "hero";
      ratioMap.forEach((r, id) => {
        if (r > best) { best = r; winner = id; }
      });

      const nextPose: Pose = SECTION_POSE[winner] ?? "idle";
      sectionPoseRef.current = nextPose;
      inHeroRef.current      = winner === "hero";

      // Clear attentive side tracking when leaving hero
      if (winner !== "hero") heroSideRef.current = null;

      // Don't interrupt self-driven states (coffee / sleep)
      setPose(prev =>
        prev === "coffee" || prev === "sleeping-away" ? prev : nextPose
      );
    };

    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          ratioMap.set(id, entry.intersectionRatio);
          refresh();
        },
        { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  // ── Mouse tracker ──────────────────────────────────────────────────────────

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPose(prev => {
        // Don't interrupt sleep / coffee without a click
        if (prev === "sleeping-away" || prev === "coffee") return prev;

        if (inHeroRef.current) {
          // Throttle: only switch on crossing the midpoint
          const side = e.clientX < window.innerWidth / 2 ? "left" : "right";
          if (heroSideRef.current === side) return prev;
          heroSideRef.current = side;
          return side === "left" ? "attentive-left" : "attentive-right";
        }

        // Outside hero: section observer owns the pose
        return prev;
      });

      resetIdle();
    };

    // Scrolling counts as activity — prevents sleeping while browsing on mobile
    const onScroll = () => resetIdle();

    window.addEventListener("mousemove", onMove,   { passive: true });
    window.addEventListener("scroll",    onScroll, { passive: true });
    resetIdle(); // start idle clock on mount

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll",    onScroll);
      clearTimeout(coffeeTimerRef.current);
      clearTimeout(sleepTimerRef.current);
    };
  }, [resetIdle]);

  // ── Click interaction ──────────────────────────────────────────────────────

  const handleClick = useCallback(() => {
    if (pose === "sleeping-away" || pose === "coffee") {
      // Wake up — return to whatever section the user is in
      setPose(sectionPoseRef.current);
      resetIdle();
    } else {
      // Poke → toggle curious
      setPose(p => (p === "curious" ? sectionPoseRef.current : "curious"));
    }
  }, [pose, resetIdle]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed right-5 top-20 z-30 hidden cursor-pointer select-none touch-none md:block"
      onClick={handleClick}
      role="img"
      aria-label="Mascot"
    >
      {/* Continuous gentle float */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
      >
        {/*
         * All poses are always mounted so every SVG / Lottie is fetched once
         * and stays in the browser cache. Switching poses only toggles
         * opacity and play/pause — no unmount, no re-fetch, no flicker.
         *
         * `image-rendering: pixelated` keeps the pixel art crisp when the
         * referenced SVG gets rasterised inside Lottie's SVG renderer.
         */}
        <div
          className="relative h-20 w-20 opacity-90 transition-opacity hover:opacity-100 lg:h-24 lg:w-24 [&_image]:[image-rendering:pixelated]"
          style={{ imageRendering: "pixelated" }}
        >
          {ALL_POSES.map(p => (
            <motion.div
              key={p}
              className="absolute inset-0"
              animate={
                p === pose
                  ? { opacity: 1, scale: 1,    y: 0 }
                  : { opacity: 0, scale: 0.88, y: 8 }
              }
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            >
              <PoseLayer pose={p} active={p === pose} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
