const https = require('https');

function mercadoLivreSearch(query, token) {
  return new Promise((resolve, reject) => {
    const target = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=40`;
    const headers = {
      'User-Agent': 'PromoZone/1.0 (catalog lookup)',
      Accept: 'application/json'
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    https.get(target, { headers }, upstream => {
      let body = '';
      upstream.setEncoding('utf8');
      upstream.on('data', chunk => { body += chunk; });
      upstream.on('end', () => {
        resolve({ statusCode: upstream.statusCode || 502, body });
      });
    }).on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método não permitido' });
  }

  let payload = req.body || {};
  if (typeof payload === 'string') {
    try { payload = JSON.parse(payload || '{}'); } catch (_) { payload = {}; }
  }

  const query = payload.q || req.query?.q || 'ofertas';
  const token = String(payload.accessToken || '').trim();

  try {
    const upstream = await mercadoLivreSearch(query, token);
    res.status(upstream.statusCode).setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.send(upstream.body);
  } catch (error) {
    return res.status(502).json({ error: 'Mercado Livre indisponível', detail: error.message });
  }
};
