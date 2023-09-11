let express = require('express');
let api = require('../api');
let createError = require('http-errors');

let router = express.Router();

router.get('/meta', (_, req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.NotInit) {
      next(createError());
    }
  }
});

module.exports = router;
