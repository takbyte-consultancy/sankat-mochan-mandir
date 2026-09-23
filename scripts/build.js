// Copies the static site into dist/ (what server.js serves).
// No dependencies — plain Node.js (CommonJS).
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const out = path.resolve(root, "dist");

// Everything the live site needs. README, package.json, scripts etc. are left out.
const FILES = ["index.html", "robots.txt", ".htaccess", "assets"];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of FILES) {
  const src = path.resolve(root, f);
  if (fs.existsSync(src)) fs.cpSync(src, path.resolve(out, f), { recursive: true });
  else console.warn("skip (not found):", f);
}
console.log("Built site into dist/");
