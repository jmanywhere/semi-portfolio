// Rasterises each mascot SVG to a 4x-upscaled PNG with a grid overlay so we
// can read pixel coordinates by eye. Output at /tmp/mascot-preview/<name>-grid.png.
import sharp from "sharp";
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC  = "/Users/semi/dev/semi-portfolio/public/mascot";
const OUT  = "/tmp/mascot-preview";
const SIZE = 256;
const UP   = 4;
const W    = SIZE * UP;
mkdirSync(OUT, { recursive: true });

// Grid overlay: light 16-px cells + heavier 64-px lines + labels every 32.
function gridSvg() {
  const lines = [];
  for (let i = 0; i <= SIZE; i += 16) {
    const major = i % 64 === 0;
    const stroke = major ? "#ff006688" : "#88888844";
    const sw = major ? 1 : 0.5;
    lines.push(`<line x1="${i}" y1="0" x2="${i}" y2="${SIZE}" stroke="${stroke}" stroke-width="${sw}"/>`);
    lines.push(`<line x1="0" y1="${i}" x2="${SIZE}" y2="${i}" stroke="${stroke}" stroke-width="${sw}"/>`);
  }
  const labels = [];
  for (let i = 0; i <= SIZE; i += 32) {
    labels.push(`<text x="${i+1}" y="7" font-size="6" fill="#ff0066">${i}</text>`);
    labels.push(`<text x="1" y="${i+6}" font-size="6" fill="#ff0066">${i}</text>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${lines.join("")}${labels.join("")}</svg>`;
}

const svgs = readdirSync(SRC).filter(f => f.endsWith(".svg"));
for (const name of svgs) {
  const base = await sharp(readFileSync(join(SRC, name)), { density: 288 })
    .resize(W, W, { kernel: "nearest" })
    .png().toBuffer();
  const grid = await sharp(Buffer.from(gridSvg()), { density: 288 })
    .resize(W, W, { kernel: "nearest" })
    .png().toBuffer();
  const out = join(OUT, name.replace(".svg", "-grid.png"));
  await sharp(base).composite([{ input: grid }]).png().toFile(out);
  console.log("wrote", out);
}
