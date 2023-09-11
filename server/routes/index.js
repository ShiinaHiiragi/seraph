let express = require('express');
let router = express.Router();
let api = require('../api');

router.get('/', function(req, res, next) {
  res.redirect(api.reactBaseURL);
});

module.exports = router;
