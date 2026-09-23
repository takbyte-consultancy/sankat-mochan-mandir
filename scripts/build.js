// Copies the static site into dist/ (the folder Hostinger publishes).
// No dependencies — plain Node.js.
import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "dist");

// Everything the live site needs. README, package.json, scripts etc. are left out.
const FILES = ["index.html", "robots.txt", ".htaccess", "assets"];

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of FILES) {
  const src = resolve(root, f);
  if (existsSync(src)) cpSync(src, resolve(out, f), { recursive: true });
  else console.warn("skip (not found):", f);
}
console.log("Built site into dist/");
