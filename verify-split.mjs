import sharp from "sharp";
import { readFileSync } from "node:fs";

// Glasses overlaid on reading
const read = await sharp(readFileSync("/Users/semi/dev/semi-portfolio/public/mascot/reading.svg"), { density: 288 }).resize(1024, 1024, { kernel: "nearest" }).png().toBuffer();
const glasses = await sharp(readFileSync("/Users/semi/dev/semi-portfolio/public/mascot/parts/glasses.svg"), { density: 288 }).resize(1024, 1024, { kernel: "nearest" }).png().toBuffer();
await sharp(read).composite([{ input: glasses }]).flatten({ background: "#ffffff" }).png().toFile("/tmp/mascot-preview/reading-with-glasses.png");

// Z overlaid on sleep at a reasonable spot
const sleep = await sharp(readFileSync("/Users/semi/dev/semi-portfolio/public/mascot/sleeping-away.svg"), { density: 288 }).resize(1024, 1024, { kernel: "nearest" }).png().toBuffer();
const zbig = await sharp(readFileSync("/Users/semi/dev/semi-portfolio/public/mascot/parts/z-big.svg"), { density: 288 }).resize(80, 80, { kernel: "nearest" }).png().toBuffer();
const zsmall = await sharp(readFileSync("/Users/semi/dev/semi-portfolio/public/mascot/parts/z-small.svg"), { density: 288 }).resize(56, 56, { kernel: "nearest" }).png().toBuffer();
await sharp(sleep).composite([
  { input: zbig,   left: 560, top: 420 },
  { input: zsmall, left: 640, top: 340 },
]).flatten({ background: "#ffffff" }).png().toFile("/tmp/mascot-preview/sleep-with-zs.png");
console.log("done");
