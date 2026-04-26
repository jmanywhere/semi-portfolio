// Generate Lottie JSON for every mascot pose.
//
// The 6 "simple" poses (idle, calm, curious, offering, attentive-{left,right})
// are single-layer animations that just transform the full SVG.
//
// The 4 "character" poses have been split into a static base + one or more
// moving parts so we can actually animate the dog:
//   • wave-hero      — the raised arm rotates around the shoulder pivot
//   • coffee         — the mug + curled paw translate up toward the snout
//   • reading        — glasses slide on over the eyes and retract at the end
//   • sleeping-away  — two "Z"s drift up and fade out over breathing
//
// Each Lottie references its SVG asset(s) by URL (`/mascot/...`). The JSON
// itself stays tiny — only keyframe data.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT_DIR = "/Users/semi/dev/semi-portfolio/public/mascot/lottie";
const FPS = 30;
const W = 256;
const H = 256;
const CENTER = [W / 2, H / 2, 0];

// ── Keyframe helpers ────────────────────────────────────────────────────────

const EASE_IN_3  = { x: [0.42, 0.42, 0.42], y: [1, 1, 1] };
const EASE_OUT_3 = { x: [0.58, 0.58, 0.58], y: [0, 0, 0] };
const EASE_IN_1  = { x: 0.42, y: 1 };
const EASE_OUT_1 = { x: 0.58, y: 0 };

function kf3(values) {
  return {
    a: 1,
    k: values.map((kf, i) =>
      i === values.length - 1
        ? { t: kf.t, s: kf.v }
        : { i: EASE_IN_3, o: EASE_OUT_3, t: kf.t, s: kf.v }
    ),
    ix: 2,
  };
}

function kf1(values, ix) {
  return {
    a: 1,
    k: values.map((kf, i) =>
      i === values.length - 1
        ? { t: kf.t, s: [kf.v] }
        : { i: EASE_IN_1, o: EASE_OUT_1, t: kf.t, s: [kf.v] }
    ),
    ix,
  };
}

const staticProp = (value, ix) => ({ a: 0, k: value, ix });

// ── Layer factory ───────────────────────────────────────────────────────────

/**
 * Build an image layer.
 * - `size`: [w, h] of the referenced asset (defaults to full 256×256).
 * - `anchor`: rotation / scale pivot (defaults to the asset centre).
 * - `position`: where on the 256×256 canvas the anchor sits.
 * - `rotation`/`scale`/`opacity`: static value or a kf1/kf3 animation.
 */
function imageLayer({
  id, assetId, size = [W, H], anchor, position, rotation, scale, opacity, op,
}) {
  const anch = anchor ?? [size[0] / 2, size[1] / 2, 0];
  const pos  = position ?? CENTER;
  return {
    ddd: 0,
    ind: id,
    ty: 2,
    nm: assetId,
    refId: assetId,
    sr: 1,
    ks: {
      o: typeof opacity === "object" ? opacity : staticProp(opacity ?? 100, 11),
      r: typeof rotation === "object" ? rotation : staticProp(rotation ?? 0, 10),
      p: typeof position === "object" ? position : staticProp(pos, 2),
      a: staticProp(anch, 1),
      s: typeof scale === "object" ? scale : staticProp(scale ?? [100, 100, 100], 6),
    },
    ao: 0,
    ip: 0,
    op,
    st: 0,
    bm: 0,
  };
}

function buildLottie({ name, duration, assets, layers }) {
  const op = Math.round(duration * FPS);
  return {
    v: "5.9.0",
    fr: FPS,
    ip: 0,
    op,
    w: W,
    h: H,
    nm: name,
    ddd: 0,
    assets,
    fonts: { list: [] },
    layers: layers.map(l => ({ ...l, op })),
    markers: [],
    meta: { g: "semi-portfolio" },
  };
}

const svgAsset = (id, path, w = W, h = H) => ({ id, w, h, u: "", p: path, e: 0 });

// ── Simple poses (single layer, transform-only) ─────────────────────────────

function simplePose({ name, duration, rotation, position, scale }) {
  return buildLottie({
    name,
    duration,
    assets: [svgAsset("mascot", `/mascot/${name}.svg`)],
    layers: [imageLayer({
      id: 1, assetId: "mascot", anchor: CENTER,
      rotation, position, scale,
    })],
  });
}

const simple = {
  idle: () => simplePose({
    name: "idle", duration: 3,
    position: kf3([
      { t: 0,  v: [128, 128, 0] },
      { t: 45, v: [128, 126, 0] },
      { t: 90, v: [128, 128, 0] },
    ]),
  }),
  calm: () => simplePose({
    name: "calm", duration: 4,
    position: kf3([
      { t: 0,   v: [128, 128, 0] },
      { t: 60,  v: [128, 125, 0] },
      { t: 120, v: [128, 128, 0] },
    ]),
  }),
  curious: () => simplePose({
    name: "curious", duration: 2,
    rotation: kf1([
      { t: 0,  v: 0 },
      { t: 12, v: 5 },
      { t: 30, v: -3 },
      { t: 48, v: 2 },
      { t: 60, v: 0 },
    ], 10),
    scale: kf3([
      { t: 0,  v: [100, 100, 100] },
      { t: 20, v: [103, 103, 100] },
      { t: 40, v: [101, 101, 100] },
      { t: 60, v: [100, 100, 100] },
    ]),
  }),
  offering: () => simplePose({
    name: "offering", duration: 2.6,
    position: kf3([
      { t: 0,  v: [128, 128, 0] },
      { t: 39, v: [128, 124, 0] },
      { t: 78, v: [128, 128, 0] },
    ]),
    scale: kf3([
      { t: 0,  v: [100, 100, 100] },
      { t: 39, v: [102, 102, 100] },
      { t: 78, v: [100, 100, 100] },
    ]),
  }),
  "attentive-left": () => simplePose({
    name: "attentive-left", duration: 3.5,
    rotation: kf1([
      { t: 0,   v: 0 },
      { t: 25,  v: -2.5 },
      { t: 80,  v: -2 },
      { t: 105, v: 0 },
    ], 10),
    position: kf3([
      { t: 0,   v: [128, 128, 0] },
      { t: 25,  v: [127, 127, 0] },
      { t: 80,  v: [127, 127, 0] },
      { t: 105, v: [128, 128, 0] },
    ]),
  }),
  "attentive-right": () => simplePose({
    name: "attentive-right", duration: 3.5,
    rotation: kf1([
      { t: 0,   v: 0 },
      { t: 25,  v: 2.5 },
      { t: 80,  v: 2 },
      { t: 105, v: 0 },
    ], 10),
    position: kf3([
      { t: 0,   v: [128, 128, 0] },
      { t: 25,  v: [129, 127, 0] },
      { t: 80,  v: [129, 127, 0] },
      { t: 105, v: [128, 128, 0] },
    ]),
  }),
};

// ── Character poses (multi-layer) ───────────────────────────────────────────

// WAVE-HERO: two layers. Base is the full dog minus arm. Arm rotates around
// the shoulder pivot at ~(168, 142). Every arm-image rect still lives in the
// 256×256 canvas, so the layer's anchor/position is in canvas coordinates,
// not arm-local. Rotation happens around the anchor.
function buildWaveHero() {
  const duration = 2;
  const shoulder = [168, 142, 0];
  return buildLottie({
    name: "wave-hero",
    duration,
    assets: [
      svgAsset("base", "/mascot/parts/wave-hero-base.svg"),
      svgAsset("arm",  "/mascot/parts/wave-hero-part.svg"),
    ],
    layers: [
      // Arm on top so it occludes the base hole.
      imageLayer({
        id: 1, assetId: "arm",
        anchor: shoulder,
        position: shoulder,
        rotation: kf1([
          { t: 0,  v: 0 },
          { t: 15, v: -22 },   // wave out
          { t: 30, v: 10 },    // wave back
          { t: 45, v: -18 },   // wave out
          { t: 60, v: 0 },     // settle
        ], 10),
      }),
      imageLayer({
        id: 2, assetId: "base",
        anchor: CENTER, position: CENTER,
        // Subtle body bob so the wave feels full-body.
        position: kf3([
          { t: 0,  v: [128, 128, 0] },
          { t: 30, v: [128, 127, 0] },
          { t: 60, v: [128, 128, 0] },
        ]),
      }),
    ],
  });
}

// COFFEE: two layers. Mug + paw translate up toward the snout, pause (sip),
// return down. Rest of the dog stays still with a faint breath.
function buildCoffee() {
  const duration = 3.5;
  return buildLottie({
    name: "coffee",
    duration,
    assets: [
      svgAsset("base", "/mascot/parts/coffee-base.svg"),
      svgAsset("mug",  "/mascot/parts/coffee-part.svg"),
    ],
    layers: [
      // Mug on top.
      imageLayer({
        id: 1, assetId: "mug",
        anchor: CENTER,
        position: kf3([
          { t: 0,   v: [128, 128, 0] },   // rest
          { t: 30,  v: [128, 110, 0] },   // lift to snout
          { t: 55,  v: [128, 108, 0] },   // hold (sip)
          { t: 80,  v: [128, 110, 0] },   // hold continues
          { t: 105, v: [128, 128, 0] },   // lower
        ]),
        // Slight tilt on the way up — it's a mug, not a weight-lift.
        rotation: kf1([
          { t: 0,   v: 0 },
          { t: 30,  v: -4 },
          { t: 80,  v: -4 },
          { t: 105, v: 0 },
        ], 10),
      }),
      imageLayer({
        id: 2, assetId: "base",
        anchor: CENTER,
        position: kf3([
          { t: 0,   v: [128, 128, 0] },
          { t: 55,  v: [128, 127, 0] },
          { t: 105, v: [128, 128, 0] },
        ]),
      }),
    ],
  });
}

// READING: full dog base + glasses. Glasses slide down from above the head,
// settle onto the eyes, stay for the bulk of the loop, then lift off.
// Parts SVG is still 256×256 — the glasses are drawn at their target position
// inside that canvas — so we animate the layer's position delta, not absolute.
function buildReading() {
  const duration = 5;
  // Glasses start above their target (simulate lowering them on).
  return buildLottie({
    name: "reading",
    duration,
    assets: [
      svgAsset("base",    "/mascot/reading.svg"),
      svgAsset("glasses", "/mascot/parts/glasses.svg"),
    ],
    layers: [
      imageLayer({
        id: 1, assetId: "glasses",
        anchor: CENTER,
        position: kf3([
          { t: 0,   v: [128, 92, 0]  },   // offscreen above
          { t: 20,  v: [128, 128, 0] },   // seated on eyes
          { t: 120, v: [128, 128, 0] },   // hold for reading
          { t: 140, v: [128, 92, 0]  },   // lift off
          { t: 150, v: [128, 128, 0] },   // reset out-of-sight
        ]),
        opacity: kf1([
          { t: 0,   v: 0   },
          { t: 10,  v: 100 },
          { t: 130, v: 100 },
          { t: 140, v: 0   },
          { t: 150, v: 0   },
        ], 11),
      }),
      // Faint rocking head-tilt while reading.
      imageLayer({
        id: 2, assetId: "base",
        anchor: CENTER,
        rotation: kf1([
          { t: 0,   v: 0 },
          { t: 50,  v: -1.5 },
          { t: 100, v: 1 },
          { t: 150, v: 0 },
        ], 10),
      }),
    ],
  });
}

// SLEEPING-AWAY: full sleep base + floating "Z"s. Two Zs spawn near the snout,
// drift up-right, grow a bit, fade out. Staggered so there's always one in
// view. Base gets a slow breathing pulse.
function buildSleeping() {
  const duration = 5; // 150 frames
  // Reference points — the snout sits around (125, 150) in this pose.
  const snout = { x: 135, y: 140 };
  // Z start near snout, drift to upper-right, fade.
  function zLayer(id, asset, startFrame, sizeStart, sizeEnd, drift) {
    const F  = (t) => (startFrame + t) % 150;
    const f0 = F(0), f1 = F(25), f2 = F(55), f3 = F(75);
    // Lottie keyframes must be monotonic, so we author them monotonically and
    // pin the layer to loop by op/ip — but easier: just express the whole life
    // in one linear span and let the Lottie loop restart the layer.
    return imageLayer({
      id, assetId: asset,
      size: [14, 14],
      anchor: [7, 7, 0],
      position: kf3([
        { t: 0,  v: [snout.x, snout.y, 0] },
        { t: 25, v: [snout.x + drift.x * 0.3, snout.y - 10, 0] },
        { t: 55, v: [snout.x + drift.x, snout.y - drift.y, 0] },
        { t: 75, v: [snout.x + drift.x * 1.1, snout.y - drift.y - 6, 0] },
      ]),
      scale: kf3([
        { t: 0,  v: [sizeStart, sizeStart, 100] },
        { t: 25, v: [(sizeStart + sizeEnd) / 2, (sizeStart + sizeEnd) / 2, 100] },
        { t: 55, v: [sizeEnd, sizeEnd, 100] },
        { t: 75, v: [sizeEnd, sizeEnd, 100] },
      ]),
      opacity: kf1([
        { t: 0,  v: 0   },
        { t: 10, v: 100 },
        { t: 55, v: 100 },
        { t: 75, v: 0   },
      ], 11),
      rotation: kf1([
        { t: 0,  v: -4 },
        { t: 75, v: 6 },
      ], 10),
    });
  }

  // Two overlapping Zs staggered ~half a loop apart.
  const zA = zLayer(1, "z_big",   0,   100, 140, { x: 40, y: 50 });
  const zB = zLayer(2, "z_small", 0,   80,  120, { x: 55, y: 70 });
  // Stagger zB by 37 frames by shifting its keyframe `t`.
  for (const prop of [zB.ks.p, zB.ks.s, zB.ks.o, zB.ks.r]) {
    for (const k of prop.k) k.t = (k.t + 37);
  }
  // And make zB start as invisible (its first keyframe must be at t=0).
  // We prepend an invisible keyframe at t=0 with the same spatial starting
  // value so the layer is properly initialised before its real lifecycle.
  const prependFirst = (prop, firstVal) => {
    prop.k.unshift({
      i: EASE_IN_1, o: EASE_OUT_1, t: 0,
      s: Array.isArray(firstVal) ? firstVal : [firstVal],
    });
    // The new keyframe at t=0 needs an `i`/`o` that matches the dimension.
    if (Array.isArray(firstVal)) {
      prop.k[0].i = EASE_IN_3;
      prop.k[0].o = EASE_OUT_3;
    }
  };
  prependFirst(zB.ks.p, [snout.x, snout.y, 0]);
  prependFirst(zB.ks.s, [80, 80, 100]);
  prependFirst(zB.ks.o, 0);
  prependFirst(zB.ks.r, -4);

  return buildLottie({
    name: "sleeping-away",
    duration,
    assets: [
      svgAsset("base",    "/mascot/sleeping-away.svg"),
      svgAsset("z_big",   "/mascot/parts/z-big.svg",   20, 20),
      svgAsset("z_small", "/mascot/parts/z-small.svg", 14, 14),
    ],
    layers: [
      zA,
      zB,
      // Slow breathing on the base — tiny scale + drift.
      imageLayer({
        id: 3, assetId: "base",
        anchor: CENTER,
        scale: kf3([
          { t: 0,   v: [100, 100, 100] },
          { t: 75,  v: [101, 101, 100] },
          { t: 150, v: [100, 100, 100] },
        ]),
        position: kf3([
          { t: 0,   v: [128, 128, 0] },
          { t: 75,  v: [128, 127, 0] },
          { t: 150, v: [128, 128, 0] },
        ]),
      }),
    ],
  });
}

// ── Emit ────────────────────────────────────────────────────────────────────

const recipes = {
  ...simple,
  "wave-hero":     buildWaveHero,
  coffee:          buildCoffee,
  reading:         buildReading,
  "sleeping-away": buildSleeping,
};

for (const [name, make] of Object.entries(recipes)) {
  const json = make();
  const path = resolve(OUT_DIR, `${name}.json`);
  writeFileSync(path, JSON.stringify(json));
  console.log(`wrote ${name}.json  (${JSON.stringify(json).length}b, ${json.op}f @ ${FPS}fps, ${json.layers.length} layer${json.layers.length === 1 ? "" : "s"})`);
}
