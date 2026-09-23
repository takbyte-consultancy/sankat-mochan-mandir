// Tiny static file server for Hostinger Node.js hosting (no dependencies).
// Serves dist/ after `npm run build`, or the project folder with `npm run dev`.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const argRoot = process.argv.indexOf("--root");
const ROOT = argRoot > -1
  ? resolve(here, process.argv[argRoot + 1] || ".")
  : existsSync(join(here, "dist", "index.html")) ? join(here, "dist") : here;
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2", ".woff": "font/woff", ".pdf": "application/pdf"
};
const BLOCKED = /(^|[\\/])(\.|node_modules|scripts|package(-lock)?\.json|server\.js|README\.md)/i;

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith("/")) path += "index.html";
    const file = normalize(join(ROOT, path));
    if (!file.startsWith(ROOT + sep) && file !== ROOT) { res.writeHead(403).end("Forbidden"); return; }
    if (BLOCKED.test(file.slice(ROOT.length))) { res.writeHead(404).end("Not found"); return; }

    let target = file;
    const info = await stat(target).catch(() => null);
    if (!info || info.isDirectory()) target = join(ROOT, "index.html"); // single-page fallback

    const body = await readFile(target);
    const type = TYPES[extname(target).toLowerCase()] || "application/octet-stream";
    const isHtml = type.startsWith("text/html");
    res.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": isHtml ? "no-cache" : "public, max-age=604800",
      "X-Content-Type-Options": "nosniff"
    });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch (err) {
    console.error(err);
    res.writeHead(500).end("Server error");
  }
}).listen(PORT, () => console.log(`Sankat Mochan Mandir site on http://localhost:${PORT} (serving ${ROOT})`));
