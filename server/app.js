let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let path = require('path');

let publicRouter = require('./routes/public');
let privateRouter = require('./routes/private');

let infoRouter = require('./routes/info');
let authRouter = require('./routes/auth');
let fileRouter = require('./routes/file');
let folderRouter = require('./routes/folder');

let todoRouter = require('./routes/todo');

let api = require('./api');
let app = express();

// init middleware
app.use(logger('dev'));
app.use(express.json({ limit: '512mb' }));
app.use(express.urlencoded({ limit: '512mb', extended: true }));
app.use(express.static(api.dataPath.buildDirPath));
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
  req.status = new api.Status();
  req.status.addAuthStatus(
    api.configOperator.config.metadata.password.length
      ? api.tokenOperator.validateUpdateSession(
        res, req.cookies[api.cookieOperator.sessionName]
      ) ? undefined
      : api.Status.authErrCode.InvalidToken
      : api.Status.authErrCode.NotInit
  );
  next();
});

// express-router
app.use('/public', publicRouter);
app.use('/private', privateRouter);

app.use('/info', infoRouter);
app.use('/auth', authRouter);
app.use('/file', fileRouter);
app.use('/folder', folderRouter);

let utilityRouter = express.Router();
utilityRouter.use('/todo', todoRouter);

app.use('/utility', utilityRouter);

// redirect all other pages to react-router
app.use((req, res) => {
  if (api.isLoopback(process.env.REACT_APP_HOSTNAME)) {
    const reactBaseURL = api.generateBaseURL(
      "http",
      process.env.REACT_APP_HOSTNAME,
      process.env.PORT
    );
    res.redirect(new URL(req.originalUrl, reactBaseURL).href);
  } else {
    res.sendFile(path.join(api.dataPath.buildDirPath, 'index.html'));
  }
});

// error handler must possess four parameters
app.use((err, req, res, _) => {
  if (!err.validity) {
    console.error(err);
    req.status.addExecStatus(api.Status.execErrCode.InternalServerError);
    res.status(500);
  }
  res.send(req.status.generateReport());
});

module.exports = app;
