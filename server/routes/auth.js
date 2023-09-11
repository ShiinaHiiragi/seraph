let express = require('express');
let api = require('../api');

let router = express.Router();

router.get('/meta', (req, res) => {
  if (req.preprocess.notInitialized) {
    res.send({
      auth: api.authStatusCode.NotInitialized
    })
  }
});

module.exports = router;
