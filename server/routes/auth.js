let express = require('express');
let router = express.Router();
let FileOperator = require('../utils/FileOperator');

router.get('/meta', (req, res) => {
  res.send('respond with a resource');
});

module.exports = router;
