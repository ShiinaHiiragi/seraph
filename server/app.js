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
    req.status.addAuthStatus(
      api.Status.authErrCode.NotInit
    );
    next();
  } else {
    req.status.addAuthStatus();
    next();
  }
});

// express-router
app.use('/auth', authRouter);

// redirect all other pages to react-router
app.use((req, res) => {
  if (req.status.notPass()) {
    res.send(req.status.generateReport());
  } else {
    res.redirect(new URL(req.originalUrl, api.reactBaseURL).href);
  }
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({
    status: api.Status.statusCode.Unknown,
    errorCode: api.Status.execErrCode.UnknownErr
  });
});

module.exports = app;
