"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

// ── Types ────────────────────────────────────────────────────────────────────

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

// ── Constants ─────────────────────────────────────────────────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

export function Mascot() {
  const [pose, setPose] = useState<Pose>("wave-hero");

  /** The pose driven by the currently visible section */
  const sectionPoseRef = useRef<Pose>("wave-hero");

  /** Whether the hero section is the dominant section on screen */
  const inHeroRef = useRef(true);

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
        // Don't interrupt sleep / coffee without an explicit click
        if (prev === "sleeping-away" || prev === "coffee") return prev;

        // In the hero: look toward the cursor
        if (inHeroRef.current) {
          return e.clientX < window.innerWidth / 2
            ? "attentive-left"
            : "attentive-right";
        }

        // Outside hero: keep the section pose (section observer owns this)
        return prev;
      });

      resetIdle();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    resetIdle(); // start the idle clock on mount

    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(coffeeTimerRef.current);
      clearTimeout(sleepTimerRef.current);
    };
  }, [resetIdle]);

  // ── Click interaction ──────────────────────────────────────────────────────

  const handleClick = useCallback(() => {
    if (pose === "sleeping-away" || pose === "coffee") {
      // Wake up
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
      className="fixed bottom-4 right-4 z-50 cursor-pointer select-none touch-none"
      onClick={handleClick}
      role="img"
      aria-label="Mascot"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={pose}
          initial={{ opacity: 0, scale: 0.82, y: 8 }}
          animate={{ opacity: 1, scale: 1,    y: 0 }}
          exit={   { opacity: 0, scale: 0.82, y: 8 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          <Image
            src={`/mascot/${pose}.svg`}
            alt=""
            aria-hidden
            width={128}
            height={128}
            className="w-20 h-20 sm:w-28 sm:h-28 drop-shadow-lg"
            priority={pose === "wave-hero"}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
