// Tiny static file server for Hostinger Node.js hosting (no dependencies).
// CommonJS on purpose: Hostinger's LiteSpeed Node loader starts the entry
// file with require(), which cannot load an ES module on Node 18.
// Serves dist/ after `npm run build`, or the project folder with `npm run dev`.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const here = __dirname;
const argRoot = process.argv.indexOf("--root");
const ROOT = argRoot > -1
  ? path.resolve(here, process.argv[argRoot + 1] || ".")
  : fs.existsSync(path.join(here, "dist", "index.html")) ? path.join(here, "dist") : here;
const PORT = process.env.PORT || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2", ".woff": "font/woff", ".pdf": "application/pdf"
};
const BLOCKED = /(^|[\\/])(\.|node_modules|scripts|package(-lock)?\.json|server\.js|README\.md|stderr\.log)/i;

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let reqPath = decodeURIComponent(url.pathname);
    if (reqPath.endsWith("/")) reqPath += "index.html";
    const file = path.normalize(path.join(ROOT, reqPath));
    if (!file.startsWith(ROOT + path.sep) && file !== ROOT) { res.writeHead(403).end("Forbidden"); return; }
    if (BLOCKED.test(file.slice(ROOT.length))) { res.writeHead(404).end("Not found"); return; }

    let target = file;
    const info = await fs.promises.stat(target).catch(() => null);
    if (!info || info.isDirectory()) target = path.join(ROOT, "index.html"); // single-page fallback

    const body = await fs.promises.readFile(target);
    const type = TYPES[path.extname(target).toLowerCase()] || "application/octet-stream";
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
});

server.listen(PORT, () => console.log(`Sankat Mochan Mandir site running on port ${PORT} (serving ${ROOT})`));
module.exports = server;
