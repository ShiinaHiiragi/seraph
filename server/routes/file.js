let express = require('express');
let fs = require('fs');
let path = require('path');
let api = require('../api');
let router = express.Router();

router.post('/upload', (req, res, next) => {
  res.send('/upload');
});

router.post('/rename', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename, newFilename } = req.body;
  const folderPath = api.dataPath[
    type === "private"
      ? "privateDirFolderPath"
      : "publicDirFolderPath"
  ](folderName);
  const filePath = path.join(folderPath, filename);
  const newFilePath = path.join(folderPath, newFilename);

  if (!fs.existsSync(folderPath) || !fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  try {
    fs.renameSync(filePath, newFilePath);
  } catch (_) {
    // -> EF_FME: fs.renameSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

router.post('/move', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const {
    type,
    folderName,
    filename,
    newType,
    newFolderName
  } = req.body;
  const folderPath = api.dataPath[
    type === "private"
      ? "privateDirFolderPath"
      : "publicDirFolderPath"
  ](folderName);
  const filePath = path.join(folderPath, filename);
  const newFolderPath = api.dataPath[
    newType === "private"
      ? "privateDirFolderPath"
      : "publicDirFolderPath"
  ](newFolderName);
  const newFilePath = path.join(newFolderPath, filename);

  if (!fs.existsSync(folderPath)
    || !fs.existsSync(filePath)
    || !fs.existsSync(newFolderPath)
  ) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  try {
    fs.renameSync(filePath, newFilePath);
  } catch (_) {
    // -> EF_FME: fs.renameSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

router.post('/delete', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename } = req.body;
  const folderPath = api.dataPath[
    type === "private"
      ? "privateDirFolderPath"
      : "publicDirFolderPath"
  ](folderName);
  const filePath = path.join(folderPath, filename);

  if (!fs.existsSync(folderPath) || !fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  try {
    fs.unlinkSync(filePath);
  } catch (_) {
    // -> EF_FME: fs.renameSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

module.exports = router;
