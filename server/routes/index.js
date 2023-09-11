let express = require('express');
let router = express.Router();
let dotenv = require('dotenv');
let api = require('../utils/api');

dotenv.config();

router.get('/', function(req, res, next) {
  res.redirect(api.generateBaseURL(
    process.env.PROTOCOL,
    process.env.HOSTNAME,
    process.env.REPORT
  ));
});

module.exports = router;
