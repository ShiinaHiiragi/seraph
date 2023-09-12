let express = require('express');
let api = require('../api');
let createError = require('http-errors');

let router = express.Router();

router.get('/meta', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.NotInit) {
      next(api.errorStreamControl);
    } else {
      // TODO: fill this
    }
  } else {
    // TODO: fill this
  }
});

router.get('/init', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.NotInit) {
      // TODO: fill this
    }
  }
  req.status.addExecStatus(api.Status.execErrCode.InitChannelClosed);
  next(api.errorStreamControl);
});

module.exports = router;
