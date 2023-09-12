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
  config = api.fileOperator.readConfig();
  req.status = new api.Status();

  req.status.addAuthStatus(
    config.meta.password === ""
      ? api.Status.authErrCode.NotInit
      : api.tokenOperator.validateUpdateSession(
        req.cookies.seraphSession
      ) ? undefined
      : api.Status.authErrCode.InvalidToken
  );
  next();
});

// express-router
app.use('/auth', authRouter);

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
