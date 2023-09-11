let express = require('express');
let api = require('../api');

let router = express.Router();

router.get('/meta', (req, res) => {
  console.log(req.status);
  if (!req.status.isAuthPass() &&
    req.status.error == api.Status.authErrCode.NotInit) {
      res.send({
        ...req.status.generateReport()
      })
  }
});

module.exports = router;
