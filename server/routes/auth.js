let express = require('express');
let api = require('../api');

let router = express.Router();

router.get('/meta', (req, res) => {
  if (req.preprocess.notInitialized) {
    res.send({
      auth: api.authStateCode.NotInitialized
    })
  }
});

module.exports = router;
