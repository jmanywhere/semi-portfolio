// Split pixel-art mascot SVGs into base + moving-part SVGs so each moving
// part can be animated as its own Lottie image layer. Also draws fresh
// pixel-art assets (glasses, sleepy "Z") that overlay the base.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const SRC = "/Users/semi/dev/semi-portfolio/public/mascot";
const OUT = `${SRC}/parts`;
mkdirSync(OUT, { recursive: true });

// ── SVG helpers ─────────────────────────────────────────────────────────────

const RECT_RE = /<rect\s+x="(\d+)"\s+y="(\d+)"\s+width="(\d+)"\s+height="(\d+)"\s+fill="([^"]+)"\/>/g;

function parseRects(svg) {
  const out = [];
  for (const m of svg.matchAll(RECT_RE)) {
    out.push({ x: +m[1], y: +m[2], w: +m[3], h: +m[4], fill: m[5] });
  }
  return out;
}

function wrapSvg(rects, w = 256, h = 256) {
  const body = rects
    .map(r => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill}"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges">${body}</svg>`;
}

function inBox(r, bbox) {
  const rx2 = r.x + r.w, ry2 = r.y + r.h;
  return r.x >= bbox.x1 && ry2 <= bbox.y2 && rx2 <= bbox.x2 && r.y >= bbox.y1;
}

/**
 * Split an SVG into (inside-bbox, outside-bbox) rects. Any rect that straddles
 * the bbox is clipped: the portion inside goes to "inside", the portion
 * outside stays in "outside". `exclude` lets us subtract a secondary region
 * (e.g. face/snout) from the "inside" set so the final `part` layer is just
 * the limb we actually want to animate.
 */
function splitByBbox(rects, bbox, exclude) {
  const inside = [], outside = [];
  const passes = (px1, py1, px2, py2, fill, target) => {
    if (!exclude) { target.push({ x: px1, y: py1, w: px2 - px1, h: py2 - py1, fill }); return; }
    // Clip against exclude rect; the overlap goes to `outside`, rest to target.
    const ex1 = Math.max(px1, exclude.x1);
    const ey1 = Math.max(py1, exclude.y1);
    const ex2 = Math.min(px2, exclude.x2);
    const ey2 = Math.min(py2, exclude.y2);
    const ov  = ex1 < ex2 && ey1 < ey2;
    if (!ov) { target.push({ x: px1, y: py1, w: px2 - px1, h: py2 - py1, fill }); return; }
    // Emit target pieces outside the exclude region.
    if (px1 < ex1) target.push({ x: px1, y: py1, w: ex1 - px1, h: py2 - py1, fill });
    if (px2 > ex2) target.push({ x: ex2, y: py1, w: px2 - ex2, h: py2 - py1, fill });
    if (py1 < ey1) target.push({ x: ex1, y: py1, w: ex2 - ex1, h: ey1 - py1, fill });
    if (py2 > ey2) target.push({ x: ex1, y: ey2, w: ex2 - ex1, h: py2 - ey2, fill });
    // Overlap with exclude → goes back into outside (stays on base image).
    outside.push({ x: ex1, y: ey1, w: ex2 - ex1, h: ey2 - ey1, fill });
  };

  for (const r of rects) {
    const rx1 = r.x, ry1 = r.y, rx2 = r.x + r.w, ry2 = r.y + r.h;
    const ix1 = Math.max(rx1, bbox.x1);
    const iy1 = Math.max(ry1, bbox.y1);
    const ix2 = Math.min(rx2, bbox.x2);
    const iy2 = Math.min(ry2, bbox.y2);
    const intersects = ix1 < ix2 && iy1 < iy2;
    if (!intersects) { outside.push(r); continue; }
    // The portion inside the bbox — run through the exclude filter.
    passes(ix1, iy1, ix2, iy2, r.fill, inside);
    // The portion outside the bbox stays on base.
    if (rx1 < ix1) outside.push({ x: rx1, y: ry1, w: ix1 - rx1, h: r.h, fill: r.fill });
    if (rx2 > ix2) outside.push({ x: ix2, y: ry1, w: rx2 - ix2, h: r.h, fill: r.fill });
    if (ry1 < iy1) outside.push({ x: ix1, y: ry1, w: ix2 - ix1, h: iy1 - ry1, fill: r.fill });
    if (ry2 > iy2) outside.push({ x: ix1, y: iy2, w: ix2 - ix1, h: ry2 - iy2, fill: r.fill });
  }
  return { inside, outside };
}

// ── Split source SVGs ──────────────────────────────────────────────────────

function splitSource(name, bbox, exclude) {
  const src = readFileSync(`${SRC}/${name}.svg`, "utf8");
  const rects = parseRects(src);
  const { inside, outside } = splitByBbox(rects, bbox, exclude);
  writeFileSync(`${OUT}/${name}-base.svg`, wrapSvg(outside));
  writeFileSync(`${OUT}/${name}-part.svg`, wrapSvg(inside));
  console.log(
    `${name}: ${rects.length} rects → ${outside.length} base + ${inside.length} part`
  );
}

// Raised arm + paw. Exclude the snout region so the base image keeps the
// face intact while the arm layer contains only arm/paw pixels. Shoulder
// pivot (for rotation) is the bottom-left of the kept region: ~(165, 144).
splitSource(
  "wave-hero",
  { x1: 148, y1: 88, x2: 206, y2: 148 },
  { x1: 148, y1: 94, x2: 170, y2: 140 }, // face/snout guard
);

// Coffee cup + the paw curled around it. Base split looks clean — no face
// overlap to worry about, so no exclude rect needed.
splitSource("coffee", { x1: 150, y1: 146, x2: 204, y2: 200 });

// ── Draw new pixel-art assets ──────────────────────────────────────────────

/**
 * Stamp a pattern at (x0, y0). Pattern is an array of strings; each "1"
 * character is a 2×2 pixel cell filled with `color`.
 */
function stamp(pattern, x0, y0, color) {
  const rects = [];
  pattern.forEach((row, j) => {
    [...row].forEach((ch, i) => {
      if (ch === "1") {
        rects.push({ x: x0 + i * 2, y: y0 + j * 2, w: 2, h: 2, fill: color });
      }
    });
  });
  return rects;
}

// Glasses — round frames with a bridge, sized for the eyes of the reading pose.
// Eye centres land around (118, 100) and (152, 100). Keep the design rounded
// so it reads as friendly specs rather than blocky cyborg goggles.
const GLASSES_LENS_DARK = "#12132c";
const GLASSES_GLINT     = "#f5c34b";

function buildGlasses() {
  const rects = [];
  // Left lens (ring)
  const leftLens = [
    " 11111 ",
    "1     1",
    "1     1",
    "1     1",
    "1     1",
    "1     1",
    " 11111 ",
  ];
  // Right lens (ring)
  const rightLens = leftLens;
  // Left lens at (106, 92), right lens at (142, 92). Each lens is 14px wide.
  rects.push(...stamp(leftLens,  106, 92, GLASSES_LENS_DARK));
  rects.push(...stamp(rightLens, 142, 92, GLASSES_LENS_DARK));
  // Bridge between lenses
  rects.push({ x: 120, y: 98, w: 22, h: 2, fill: GLASSES_LENS_DARK });
  // Single glint highlight on each lens
  rects.push({ x: 110, y: 96, w: 2, h: 2, fill: GLASSES_GLINT });
  rects.push({ x: 146, y: 96, w: 2, h: 2, fill: GLASSES_GLINT });
  // Thin earpiece stubs so the glasses don't look like they're floating
  rects.push({ x: 104, y: 96, w: 2, h: 2, fill: GLASSES_LENS_DARK });
  rects.push({ x: 156, y: 96, w: 2, h: 2, fill: GLASSES_LENS_DARK });
  return rects;
}
writeFileSync(`${OUT}/glasses.svg`, wrapSvg(buildGlasses()));

// Sleepy "Z" — 7x7 block letter, intentionally chunky so it reads at 28px.
// Two sizes: big Z and small Z, so the sleep animation can stack them.
function buildZ(size) {
  // size in pixels (always odd multiple of 2 for pixel-perfect). 14 or 20.
  const s = size;
  const rects = [];
  const color = "#1c1b39";
  // Top bar
  rects.push({ x: 0, y: 0, w: s, h: 2, fill: color });
  // Bottom bar
  rects.push({ x: 0, y: s - 2, w: s, h: 2, fill: color });
  // Diagonal (stairstep from top-right to bottom-left)
  const steps = (s - 2) / 2;
  for (let i = 0; i < steps; i++) {
    const x = s - 2 - i * 2;
    const y = 2 + i * 2;
    rects.push({ x, y, w: 2, h: 2, fill: color });
  }
  // Outline bottom of diagonal for readability
  // (already covered)
  // Wrap in a tight svg sized to the letter so Lottie transforms land cleanly.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" shape-rendering="crispEdges">${rects
    .map(r => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill}"/>`)
    .join("")}</svg>`;
}

writeFileSync(`${OUT}/z-big.svg`,   buildZ(20));
writeFileSync(`${OUT}/z-small.svg`, buildZ(14));

console.log(`wrote ${OUT}/glasses.svg, z-big.svg, z-small.svg`);

// ── Previews for visual verification ────────────────────────────────────────

async function preview(name) {
  const buf = readFileSync(`${OUT}/${name}.svg`);
  const out = `/tmp/mascot-preview/${name}.png`;
  await sharp(buf, { density: 288 })
    .resize(1024, 1024, { kernel: "nearest", fit: "contain", background: "#ffffff" })
    .png().toFile(out);
  console.log("preview", out);
}

await preview("wave-hero-base");
await preview("wave-hero-part");
await preview("coffee-base");
await preview("coffee-part");
await preview("glasses");
await preview("z-big");
