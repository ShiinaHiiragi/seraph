let express = require('express');
let path = require('path');
let fs = require('fs');
let fse = require('fs-extra')
let AdmZip = require('adm-zip');
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

  // -> ES: return new file info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...api.fileOperator.readFileInfo(folderPath, filename)
  });
  return;
});

router.post('/paste', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { permanent, directory, path } = api.configOperator.config.clipboard;
  if (permanent === null || directory === null || path === null) {
    api.configOperator.clearConfigClipboard();

    // -> abnormal request: clipboard is broken, expect to try again
    next(api.errorStreamControl);
    return;
  }

  const [type, folderName, filename] = path;
  const { type: newType, folderName: newFolderName } = req.body;
  const { filePath } = api.fileOperator.pathCombinator(type, folderName, filename);
  const {
    folderPath: newFolderPath,
    filePath: newFilePath
  } = api.fileOperator.pathCombinator(newType, newFolderName, filename);

  if (!fs.existsSync(filePath)) {
    api.configOperator.clearConfigClipboard();

    // -> EF_RU: origin file don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (!fs.existsSync(newFolderPath)) {
    // -> EF_RU: target folder don't exist
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

  if (!directory && newFolderName.length === 0) {
    // -> abnormal request: try to move file to public/ or private/
    next(api.errorStreamControl);
    return;
  }

  try {
    if (permanent) {
      fs.cpSync(filePath, newFilePath, { recursive: true });
    } else {
      fse.moveSync(filePath, newFilePath);
      api.configOperator.clearConfigClipboard();
    }
  } catch (_) {
    // -> EF_FME: fs.cpSync or fs.rmSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return new file info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...api.fileOperator.readFileInfo(newFolderPath, filename)
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
    directory: api.configOperator.config.clipboard.directory
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
    directory: api.configOperator.config.clipboard.directory
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

router.post('/zip', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename } = req.body;
  const { folderPath, filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  const newFilename = filename + ".zip"
  const { filePath: newFilePath } = api.fileOperator.pathCombinator(type, folderName, newFilename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (fs.existsSync(newFilePath)) {
    // -> EF_IC: filename already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send(req.status.generateReport());
    return;
  }

  const zip = new AdmZip();
  try {
    zip.addLocalFolder(filePath);
    zip.writeZip(newFilePath);
    fs.chmodSync(newFilePath, 0o777);
  } catch (_) {
    // -> EF_FME: fs.unlinkSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    info: api.fileOperator.readFileInfo(folderPath, newFilename)
  });
  return;
});

router.post('/unzip', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { type, folderName, filename } = req.body;
  const { folderPath, filePath } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  const zip = new AdmZip(filePath);
  const zipEntries = zip
    .getEntries()
    .map((item) => item.entryName)
    .filter((item) => /^[^/]*\/?$/.test(item))

  const pureFilename = filename.split(".").slice(0, -1).join(".");
  const extractName = zipEntries.length === 1 ? "." : pureFilename;
  const newDirName = zipEntries.length === 1 ? zipEntries[0].replace("/", "") : pureFilename;
  const newDirPath = path.join(folderPath, newDirName);

  if (fs.existsSync(newDirPath)) {
    // -> EF_IC: filename already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send(req.status.generateReport());
    return;
  }

  const chmodSyncR = (dirPath, mode) => {
    fs.chmodSync(dirPath, mode);
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
  
      if (stats.isDirectory()) {
        chmodSyncR(filePath, mode);
      } else {
        fs.chmodSync(filePath, mode);
      }
    }
  }

  try {
    zip.extractAllTo(path.join(folderPath, extractName));
    chmodSyncR(newDirPath, 0o777);
  } catch (_) {
    // -> EF_FME: fs.unlinkSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    info: api.fileOperator.readFileInfo(folderPath, newDirName)
  });
  return;
});

module.exports = router;
