let https = require('https');
let express = require('express');
let router = express.Router();

const forwardCacheHeaders = (proxyRes, res) => {
  [
    'content-type',
    'cache-control',
    'expires',
    'last-modified',
    'etag'
  ].forEach(h => {
    if (proxyRes.headers[h]) {
      res.set(h, proxyRes.headers[h]);
    }
  });
}

const proxyTo = (targetUrl, req, res) => {
  const parsed = new URL(targetUrl);
  const options = {
    hostname: parsed.hostname,
    path: parsed.pathname + parsed.search,
    method: 'GET',
    headers: {
      'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept': req.headers['accept'] || '*/*',
      'Accept-Encoding': 'identity',
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    const contentType = proxyRes.headers['content-type'] || '';
    forwardCacheHeaders(proxyRes, res);
    res.status(proxyRes.statusCode);

    if (contentType.includes('text/css')) {
      let body = '';
      proxyRes.setEncoding('utf8');
      proxyRes.on('data', chunk => { body += chunk; });
      proxyRes.on('end', () => {
        body = body.replace(/https:\/\/fonts\.gstatic\.com/g, '/font/gstatic');
        res.send(body);
      });
    } else {
      proxyRes.pipe(res);
    }
  });

  proxyReq.on('error', (err) => {
    console.error('[font-proxy]', err.message);
    res.status(502).end();
  });

  proxyReq.end();
}

router.get('/css2', (req, res) => {
  const query = new URLSearchParams(req.query).toString();
  proxyTo(`https://fonts.googleapis.com/css2?${query}`, req, res);
});

router.get('/gstatic/*', (req, res) => {
  const fontPath = req.params[0];
  const querys = req.url.includes('?')
    ? '?' + req.url.split('?').slice(1).join('?')
    : '';
  proxyTo(`https://fonts.gstatic.com/${fontPath}${querys}`, req, res);
});

module.exports = router;
