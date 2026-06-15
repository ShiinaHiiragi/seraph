let fs = require('fs');
let path = require('path');
let express = require('express');
let api = require('../api');
let router = express.Router();

router.get('/load', (req, res, next) => {
  const { type, folderName, filename } = req.query;
  if (type === 'private' && req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const handlePath = type === 'private'
    ? api.dataPath.privateDirFolderPath
    : api.dataPath.publicDirFolderPath;
  const folderPath = handlePath(folderName);
  const filePath = path.join(folderPath, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  const buffer = fs.readFileSync(filePath);
  const text = buffer.toString('utf-8');

  // -> ES: return markdown text
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    text: text
  });
  return;
});

module.exports = router;
