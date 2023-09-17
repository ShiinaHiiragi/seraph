let express = require('express');
let fs = require('fs');
let path = require('path');
let api = require('../api');
const mime = require('mime');
let router = express.Router();

router.post('/upload', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename, base } = req.body;
  const folderPath = api.dataPath[
    type === "private"
      ? "privateDirFolderPath"
      : "publicDirFolderPath"
  ](folderName);
  const filePath = path.join(folderPath, filename);

  if (!fs.existsSync(folderPath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (fs.existsSync(filePath)) {
    // -> EF_IC: new filename already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send(req.status.generateReport());
    return;
  }

  try {
    const fileBuffer = Buffer.from(base, 'base64');
    fs.writeFileSync(filePath, fileBuffer);
    fs.chmodSync(filePath, 0o777);
  } catch (_) {
    // -> EF_FME: fs.renameSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  const stat = fs.statSync(filePath);
  const newStat = {
    size: stat.size,
    time: stat.birthtime,
    mtime: stat.mtime,
    type: mime.getType(filename)
  };

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...newStat
  });
  return;
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

  if (fs.existsSync(newFilePath)) {
    // -> EF_IC: new filename already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send(req.status.generateReport());
    return;
  }

  try {
    fs.renameSync(filePath, newFilePath);
    fs.chmodSync(newFilePath, 0o777);
  } catch (_) {
    console.log(_);
    // -> EF_FME: fs.renameSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return type info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    type: mime.getType(newFilePath)
  });
  return;
});

router.post('/copy', (req, res, next) => {
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

  if (fs.existsSync(newFilePath)) {
    // -> EF_IC: new filename already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send(req.status.generateReport());
    return;
  }

  try {
    fs.copyFileSync(filePath, newFilePath);
    fs.chmodSync(newFilePath, 0o777);
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
