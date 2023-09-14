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
      ? "privateDirFolderPath"
      : "publicDirFolderPath"
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

router.post('/upload', (req, res, next) => {
  res.send('/upload');
});

router.post('/rename', (req, res, next) => {
  res.send('/rename');
});

router.post('/move', (req, res, next) => {
  res.send('/move');
});

router.post('/delete', (req, res, next) => {
  res.send('/delete');
});

module.exports = router;
