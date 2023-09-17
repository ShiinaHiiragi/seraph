let express = require('express');
let fs = require('fs');
let path = require('path');
let api = require('../api');
let router = express.Router();

router.get('/*/:filename', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { '0': folderName, filename } = req.params;
  const folderPath = api.dataPath.privateDirFolderPath(folderName);
  const filePath = path.join(folderPath, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send({
      ...req.status.generateReport(),
      message: "Resources requested do not exist."
    });
    return;
  }

  if (fs.lstatSync(filePath).isDirectory()) {
    // -> next: is a directory
    next();
  }

  // -> no code: return file directly
  res.sendFile(filePath);
  return;
});

module.exports = router;
