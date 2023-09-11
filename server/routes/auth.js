let express = require('express');
let router = express.Router();

router.get('/meta', (req, res) => {
  res.send('respond with a resource');
});

module.exports = router;
