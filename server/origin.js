// use configured public addresses
// never request Host / X-Forwarded-* headers
const createOriginPolicy = (env = process.env) => {
  const origins = new Set();
  const addOrigin = (value) => {
    const url = new URL(value);
    if (
      !['http:', 'https:'].includes(url.protocol)
        || url.username
        || url.password
        || url.pathname !== '/'
        || url.search
        || url.hash
    ) {
      throw new Error(`Invalid Seraph origin: ${value}`);
    }
    origins.add(url.origin);
  };

  if (env.ALLOWED_ORIGINS !== undefined) {
    env.ALLOWED_ORIGINS
      .split(',')
      .map(value => value.trim())
      .filter(Boolean)
      .forEach(addOrigin);
  } else {
    const hostname = env.REACT_APP_HOSTNAME;
    if (hostname) {
      const loopback =
        hostname === 'localhost'
          || hostname === '::1'
          || hostname === '[::1]'
          || /^127(\.\d{1,3}){3}$/.test(hostname);
      const host = hostname.includes(':') && !hostname.startsWith('[')
        ? `[${hostname}]`
        : hostname;
      const port = env.REACT_APP_SSLCERT === 'nginx'
        ? env.REACT_APP_NPORT
        : env.REACT_APP_SPORT;

      addOrigin(`${loopback ? 'http' : 'https'}://${host}${port ? `:${port}` : ''}`);
      if (loopback && env.PORT) {
        addOrigin(`http://${host}:${env.PORT}`);
      }
    }
  }
  if (!origins.size) {
    throw new Error('Configure REACT_APP_HOSTNAME / ALLOWED_ORIGINS');
  }

  const isAllowedOrigin = origin => typeof origin === 'string' && origins.has(origin);
  const requireTrustedOrigin = (req, res, next) => {
    if (
      ['GET', 'HEAD', 'OPTIONS'].includes(req.method)
        || isAllowedOrigin(req.headers.origin)
    ) {
      next();
      return;
    }
    res.status(403).json({ error: 'untrusted origin' });
  };

  return { isAllowedOrigin, requireTrustedOrigin };
};

module.exports = { createOriginPolicy };
