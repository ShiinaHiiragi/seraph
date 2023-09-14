let express = require('express');
let api = require('../api');
let router = express.Router();

router.get('/:foldername/:filename', (req, res, next) => {
  res.send(req.params);
});

module.exports = router;
