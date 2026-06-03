const process = require('process');
const path = require('path');
const cookie = require('cookie');

const ws = require('ws');
const { spawn } = require('node-pty');

const ptyLog = (event, pid = '', detail = '') => {
  const pidFormatted = pid ? ` ${pid}` : '';
  const defailFormatted = detail ? ` - ${detail}` : '';
  console.log(`PTY \x1b[36m${event}\x1b[0m${pidFormatted}${defailFormatted}`);
}

const wssAuth = (api, req) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  return api.configOperator.config.metadata.password.length > 0
    && api.tokenOperator.validateUpdateSession(
      undefined,
      cookies[api.cookieOperator.sessionName]
    );
}

const attachTerminal = (server, api) => {
  const wss = new ws.WebSocketServer({ server, path: '/pty' });

  wss.on('connection', (ws, req) => {
    const terminalSetting = api.configOperator.config.setting.terminal;

    if (!terminalSetting.enable) {
      ptyLog('REJECT', 'disabled');
      ws.close(1008, 'feature disabled');
      return;
    }

    if (!wssAuth(api, req)) {
      ptyLog('REJECT', 'unauthorized');
      ws.close(1008, 'authentication failed');
      return;
    }

    const pty = spawn(
      terminalSetting.shell[process.platform],
      [],
      {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: {
          ...process.env,
          SERAPH_PATH: path.join(__dirname, '..'),
          SERAPH_DATA: path.join(__dirname, './data'),
        },
      }
    );

    let idleTimer;
    let pingInterval = terminalSetting.lifecycle.ping > 0
      ? setInterval(() => {
        if (ws.readyState === ws.OPEN) {
          ws.ping();
        }
      }, terminalSetting.lifecycle.ping * 1000) : undefined;

    console.log(`using ${terminalSetting.lifecycle.ping}`)
    ptyLog('CONNECT', pty.pid);

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        ptyLog('CLOSE', pty.pid, `timeout`);
        ws.close(1000, 'timeout');
      }, terminalSetting.lifecycle.timeout * 60 * 1000);
    };
    resetIdleTimer();

    pty.onData((data) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(data);
        resetIdleTimer();
      }
    });

    ws.on('message', (msg) => {
      try {
        const parsed = JSON.parse(msg);
        if (parsed.type === 'input') {
          pty.write(parsed.data);
          resetIdleTimer();
        }
        if (parsed.type === 'resize') {
          pty.resize(parsed.cols, parsed.rows);
          ptyLog('RESIZE', pty.pid, `${parsed.cols}x${parsed.rows}`);
        }
      } catch {
        pty.write(msg.toString());
      }
    });

    const cleanup = (reason) => {
      clearTimeout(idleTimer);
      clearInterval(pingInterval);
      ptyLog('CLOSE', pty.pid, `${reason}`);
      pty.kill();
    };

    ws.on('close', () => cleanup('exited'));
    ws.on('error', (err) => cleanup(`error: ${err.message}`));
  });
}

exports.attachTerminal = attachTerminal;
