let express = require('express');
let api = require('../api');
let router = express.Router();

router.get('/public/*', (req, res) => {
  const { '0': folderName } = req.params;
  const folderPath = api.dataPath.publicDirFolderPath(folderName);
  const folderInfo = api.fileOperator.readFolderInfo(folderPath);

  if (folderInfo === null) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return folder info even if it's empty
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    info: folderInfo
  });
  return;
});

router.get('/private/*', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { '0': folderName } = req.params;
  const folderPath = api.dataPath.privateDirFolderPath(folderName);
  const folderInfo = api.fileOperator.readFolderInfo(folderPath);

  if (folderInfo === null) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return folder info even if it's empty
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    info: folderInfo
  });
  return;
});

module.exports = router;
