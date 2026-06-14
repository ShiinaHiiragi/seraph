let fs = require('fs');
let path = require('path');
let express = require('express');
let api = require('../api');
let router = express.Router();

router.get('/load', (req, res, next) => {
  const { type, file } = req.query;
  if (type === 'private' && req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const filePath = path.join(api.dataPath.dataDirPath, type, file);
  const buffer = fs.readFileSync(filePath);

  // -> ES: return markdown text
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    text: buffer.toString('utf-8')
  });
  return;
});

module.exports = router;
