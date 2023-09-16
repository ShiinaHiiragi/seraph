let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let logger = require('morgan');
let cors = require('cors');

let authRouter = require('./routes/auth');
let publicRouter = require('./routes/public');
let privateRouter = require('./routes/private');
let fileRouter = require('./routes/file');
let api = require('./api');
let app = express();

// init middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// reinforce setting
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(cors({
  origin: [api.reactBaseURL],
  methods: ["GET", "POST"],
  alloweHeaders: ['Conten-Type', 'Authorization', 'Accept', 'Origin'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  credentials: true,
}));

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
app.use('/auth', authRouter);
app.use('/public', publicRouter);
app.use('/private', privateRouter);
app.use('/file', fileRouter);

// redirect all other pages to react-router
app.use((req, res) => {
  res.redirect(new URL(req.originalUrl, api.reactBaseURL).href);
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
