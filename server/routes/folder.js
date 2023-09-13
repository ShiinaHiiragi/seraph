let express = require('express');
let api = require('../api');
let router = express.Router();

router.get('/info', (req, res, next) => {
  const { type, name } = req.query;
  if (type === "private" && req.status.notAuthSuccess()) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }
});

module.exports = router;
