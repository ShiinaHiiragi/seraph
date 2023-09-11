let express = require('express');
let api = require('../api');

let router = express.Router();

router.get('/meta', (req, res) => {
  console.log(req.status);
  if (!req.status.isAuthenticationPass() &&
    req.status.error == api.StatusMananger.authenticationErrorCode.NotInitialized) {
      res.send({
        ...req.status.generateReport()
      })
  }
});

module.exports = router;
