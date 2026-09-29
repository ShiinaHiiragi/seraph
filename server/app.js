let express = require('express');
let compression = require('compression');
let cookieParser = require('cookie-parser');
let accessLog = require('./log');
let cors = require('cors');
let path = require('path');

let publicRouter = require('./routes/public');
let privateRouter = require('./routes/private');

let infoRouter = require('./routes/info');
let authRouter = require('./routes/auth');
let fileRouter = require('./routes/file');
let folderRouter = require('./routes/folder');
let configRouter = require('./routes/config');

let crepeRouter = require('./routes/crepe');
let todoRouter = require('./routes/todo');

let api = require('./api');
let app = express();

// find real IP under nginx forwarding
if (process.env.TRUST_PROXY) {
  app.set(
    'trust proxy',
    process.env.TRUST_PROXY
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );
}

// init middleware
app.use(accessLog());
app.use(compression());
app.use(express.static(api.dataPath.buildDirPath, {
  setHeaders: (res) => { res.locals.accessHandler = 'static'; },
}));
app.use(cookieParser());

// reinforce setting
const originURL = [process.env.PORT, process.env.REACT_APP_NPORT]
  .filter((item) => item !== undefined)
  .map((item) => RegExp(`https?://${process.env.REACT_APP_HOSTNAME}:${item}`))

if (originURL.length > 0) {
  app.use(cors({
    origin: originURL,
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    credentials: true,
  }));
}

// unified authenticator
app.use((req, res, next) => {
  const session = req.cookies[api.cookieOperator.sessionName];
  const auto = ["/info/stat"].includes(req.path);

  req.status = new api.Status();
  req.status.addAuthStatus(
    api.configOperator.config.metadata.password.length
      ? api.tokenOperator.validateUpdateSession(res, session, auto)
      ? undefined
      : api.Status.authErrCode.InvalidToken
      : api.Status.authErrCode.NotInit
  );
  next();
});

// body size limit for paths
const bodyParsers = (limit) => [
  express.json({ limit }),
  express.urlencoded({ limit, extended: true }),
];

const requireBodyAuth = (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    res.status(401).send(req.status.generateReport());
    return;
  }
  next();
};

app.post([
  '/utility/crepe/save',
  '/utility/crepe/update',
  '/file/upload'
], requireBodyAuth, ...bodyParsers('1024mb'));
app.use('/auth', ...bodyParsers('16kb'));
app.use(...bodyParsers('1mb'));

// express-router
app.use('/public', publicRouter);
app.use('/private', privateRouter);

app.use('/info', infoRouter);
app.use('/auth', authRouter);
app.use('/file', fileRouter);
app.use('/folder', folderRouter);
app.use('/config', configRouter)

let utilityRouter = express.Router();
utilityRouter.use('/todo', todoRouter);
utilityRouter.use('/crepe', crepeRouter);

app.use('/utility', utilityRouter);

// redirect all other pages to react-router
app.use((req, res) => {
  if (api.isLoopback(process.env.REACT_APP_HOSTNAME)) {
    res.locals.accessHandler = 'fallback_front';
    const reactBaseURL = api.generateBaseURL(
      "http",
      process.env.REACT_APP_HOSTNAME,
      process.env.PORT
    );
    res.redirect(new URL(req.originalUrl, reactBaseURL).href);
  } else {
    res.locals.accessHandler = 'fallback_spa';
    res.sendFile(path.join(api.dataPath.buildDirPath, 'index.html'));
  }
});

// error handler must possess four parameters
// `if (!cond) { next(api.errorStreamControl); return; }` act as `assert(cond)`;
// which means we believe that `!cond` should not happen
app.use((err, req, res, _) => {
  if (!err.validity) {
    console.error(err);
    req.status.addExecStatus(api.Status.execErrCode.InternalServerError);
    res.status(500);
  }
  res.send(req.status.generateReport());
});

module.exports = app;
