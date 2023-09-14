let express = require('express');
let fs = require('fs');
let path = require('path');
let api = require('../api');
let router = express.Router();

router.get('/:folderName/:filename', (req, res, next) => {
  const { folderName, filename } = req.params;
  const folderPath = api.dataPath.publicDirFolderPath(folderName);
  const filePath = path.join(folderPath, filename);

  if (!fs.existsSync(folderPath) || !fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  // -> no code: return file directly
  res.sendFile(filePath);
});

module.exports = router;
