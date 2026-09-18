const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
http.createServer((req, res) => {
  if (req.url.startsWith('/api/search')) {
    let raw = '';
    req.on('data', chunk => raw += chunk);
    req.on('end', () => {
      let payload = {};
      try { payload = JSON.parse(raw || '{}'); } catch (_) {}
      const query = payload.q || new URL(req.url, 'http://localhost').searchParams.get('q') || 'ofertas';
      const token = String(payload.accessToken || '').trim();
      const target = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=40`;
      const headers = { 'User-Agent': 'PromoZone/1.0 (catalog lookup)', 'Accept': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      https.get(target, { headers }, upstream => {
        res.writeHead(upstream.statusCode || 502, { 'Content-Type': 'application/json; charset=utf-8' });
        upstream.pipe(res);
      }).on('error', error => res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' }).end(JSON.stringify({ error: 'Mercado Livre indisponível', detail: error.message })));
    });
    return;
  }
  const requested = req.url === '/' ? 'index.html' : req.url.replace(/^\//, '');
  const file = path.resolve(__dirname, requested);
  if (!file.startsWith(__dirname)) return res.writeHead(403).end();
  fs.readFile(file, (error, data) => error ? res.writeHead(404).end('Not found') : res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(data));
}).listen(4173, () => console.log('PromoZone em http://localhost:4173'));
