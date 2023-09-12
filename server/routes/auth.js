let express = require('express');
let api = require('../api');
let createError = require('http-errors');

let router = express.Router();

router.get('/meta', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.NotInit) {
      next(createError());
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
      
    }
  }
  req.status.addExecStatus(api.Status.execErrCode.InitChannelClosed);
  next(createError());
});

module.exports = router;
