let express = require('express');
let api = require('../api');

let router = express.Router();

router.get('/meta', (req, res) => {
  if (req.status.notAuthPass() && req.status.error == api.Status.authErrCode.NotInit) {
    res.send({
      ...req.status.generateReport()
    })
  }
});

module.exports = router;
