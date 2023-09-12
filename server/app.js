let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');

let authRouter = require('./routes/auth');
let api = require('./api');

let app = express();

// init middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: [api.reactBaseURL],
  methods: ["GET", "POST"],
  alloweHeaders: ['Conten-Type', 'Authorization', 'Accept', 'Origin'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  credentials: true,
}));

// unified authenticator
app.use((req, res, next) => {
  setting = api.fileOperator.readSetting();
  req.status = new api.Status();

  if (setting.password === undefined) {
    req.status.addAuthStatus(api.Status.authErrCode.NotInit);
    next();
  } else {
    // TODO: fill this
  }
});

// express-router
app.use('/auth', authRouter);

// redirect all other pages to react-router
app.use((req, res) => {
  res.redirect(new URL(req.originalUrl, api.reactBaseURL).href);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  switch (req.status.status) {
    case api.Status.statusCode.AuthFailed:
      res.send(req.status.generateReport());
      break;
    case api.Status.statusCode.ExecFailed:
      res.status(500).send(req.status.generateReport());
      break;
    default:
      res.status(500).send({
        statusCode: api.Status.statusCode.UnknownStatus,
        errorCode: api.Status.execErrCode.InternalServerError
      });
  }
});

module.exports = app;
