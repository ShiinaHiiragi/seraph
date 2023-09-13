let express = require('express');
let api = require('../api');
let router = express.Router();

router.get('/info', (req, res, next) => {
  const { type, name } = req.query;
  const isPrivate = type === 'private';

  if (isPrivate && req.status.notAuthSuccess()) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }

  const folderPath = api.dataPath[
    isPrivate
      ? "privateFolderDirPath"
      : "publicFolderDirPath"
  ](name);
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
