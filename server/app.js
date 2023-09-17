let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let path = require('path');

let authRouter = require('./routes/auth');
let publicRouter = require('./routes/public');
let privateRouter = require('./routes/private');
let fileRouter = require('./routes/file');
let folderRouter = require('./routes/folder');
let api = require('./api');
let app = express();

// init middleware
app.use(logger('dev'));
app.use(express.json({ limit: '512mb' }));
app.use(express.urlencoded({ limit: '512mb', extended: true }));
app.use(express.static(api.dataPath.buildDirPath));
app.use(cookieParser());

// reinforce setting
if (process.env.PORT !== undefined) {
  app.use(cors({
    origin: [api.reactBaseURL],
    methods: ["GET", "POST"],
    alloweHeaders: ['Conten-Type', 'Authorization', 'Accept', 'Origin'],
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

app.use('/auth', authRouter);
app.use('/file', fileRouter);
app.use('/folder', folderRouter);

// redirect all other pages to react-router
app.use((req, res) => {
  if (process.env.PORT !== undefined) {
    res.redirect(new URL(req.originalUrl, api.reactBaseURL).href);
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
