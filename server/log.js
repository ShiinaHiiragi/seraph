const crypto = require('crypto');
const morgan = require('morgan');
const recentRequests = [];
const REQUEST_HISTORY_LIMIT = 64;

const bounded = (value) => value == null ? null : String(value).slice(0, 2048);
const singleLine = (value) => String(value).replace(/[\x00-\x1f\x7f-\x9f\u2028\u2029]/g, '');
const localTime = (date) => {
  const pad = (value, width = 2) => String(value).padStart(width, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
    + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
};

module.exports = function accessLog(options = {}) {
  return (req, res, next) => {
    const startedAt = new Date();
    const start = process.hrtime.bigint();
    const requestId = crypto.randomBytes(16).toString('hex');

    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    const peerIp = req.socket.remoteAddress || null;
    const clientIp = req.ip || peerIp;
    const url = req.originalUrl || req.url || '';
    const requestPath = bounded(url.split(/[?#]/, 1)[0]);

    morgan((tokens, request, response) => {
      const headerTime = tokens['response-time'](request, response);
      const length = response.getHeader('content-length');
      const entry = {
        type: 'access',
        time: startedAt.toISOString(),
        request_id: requestId,
        client_ip: clientIp,
        peer_ip: peerIp,
        method: bounded(request.method),
        path: requestPath,
        query_present: url.includes('?'),
        http_version: request.httpVersion,
        status: response.headersSent ? response.statusCode : null,
        completed: response.writableFinished,
        response_time_ms: headerTime == null ? null : Number(headerTime),
        duration_ms: Number((Number(process.hrtime.bigint() - start) / 1e6).toFixed(3)),
        content_length: length == null ? null : Number(length),
        content_type: bounded(response.getHeader('content-type')),
        content_encoding: bounded(response.getHeader('content-encoding')),
        user_agent: bounded(request.headers['user-agent']),
        handler: response.locals.accessHandler || 'route',
      };

      recentRequests.push(entry);
      if (recentRequests.length > REQUEST_HISTORY_LIMIT) recentRequests.shift();

      return `[${localTime(startedAt)}] ${singleLine(clientIp || '-')} `
        + `${singleLine(entry.method)} ${singleLine(requestPath)} ${entry.status ?? '-'} `
        + `${headerTime ?? '-'} ms - ${entry.content_length ?? '-'}`;
    }, options)(req, res, next);
  };
};

module.exports.getRecentRequests = () => recentRequests.map((entry) => ({ ...entry }));
