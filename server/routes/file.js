let express = require('express');
let fs = require('fs');
let path = require('path');
let api = require('../api');
let router = express.Router();

router.post('/new', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  // directory file is a special kind of file
  const { type, folderName, filename } = req.body;
  const { folderPath, filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

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
    fs.mkdirSync(filePath);
    fs.chmodSync(filePath, 0o777);
  } catch (_) {
    // -> EF_FME: fs.writeFileSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...api.fileOperator.readFileInfo(folderPath, filename)
  });
  return;
});

router.post('/upload', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename, base } = req.body;
  const { folderPath, filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (folderName.length === 0) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }

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
    // -> EF_FME: fs.writeFileSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...api.fileOperator.readFileInfo(folderPath, filename)
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
  const { folderPath, filePath } = api.fileOperator.pathCombinator(type, folderName, filename);
  const newFilePath = path.join(folderPath, newFilename);

  if (!fs.existsSync(filePath)) {
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
    // -> EF_FME: fs.renameSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return type info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    type: api.fileOperator.readFileInfo(folderPath, newFilename).type
  });
  return;
});

router.post('/copy', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename } = req.body;
  const { filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  api.configOperator.setConfigClipboard([type, folderName, filename], true);

  // -> ES: return clipboard info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...api.configOperator.config.clipboard
  });
  return;
});

router.post('/cut', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename } = req.body;
  const { filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  api.configOperator.setConfigClipboard([type, folderName, filename], false);

  // -> ES: return clipboard info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...api.configOperator.config.clipboard
  });
  return;
});

router.post('/delete', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename } = req.body;
  const { filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  try {
    fs.rmSync(filePath, { recursive: true, force: true });
  } catch (_) {
    // -> EF_FME: fs.unlinkSync error
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
