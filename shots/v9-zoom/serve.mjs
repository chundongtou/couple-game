/* V9 fe-zoom · 极简静态服务器（仅测试用；Node 无外部依赖）
 * 用法: node serve.mjs [port] [root]
 * 默认 port=8795, root=couple-game 仓库根
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(process.argv[3] || path.join(HERE, '..', '..'));
const PORT = Number(process.argv[2] || 8795);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  try {
    const u = new URL(req.url, 'http://127.0.0.1');
    let p = decodeURIComponent(u.pathname);
    if (p.endsWith('/')) p += 'index.html';
    const abs = path.resolve(ROOT, '.' + p);
    if (!abs.startsWith(ROOT)) { res.writeHead(403); res.end('forbidden'); return; }
    fs.readFile(abs, (err, buf) => {
      if (err) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); res.end('404 ' + p); return; }
      res.writeHead(200, {
        'content-type': MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream',
        'cache-control': 'no-store',
        'access-control-allow-origin': '*'
      });
      res.end(buf);
    });
  } catch (e) {
    res.writeHead(500); res.end('server error');
  }
});
server.listen(PORT, '127.0.0.1', () => console.log('serve ' + ROOT + ' @ http://127.0.0.1:' + PORT));
