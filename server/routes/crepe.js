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

  let text;
  try {
    const buffer = fs.readFileSync(filePath);
    text = buffer.toString('utf-8');
  } catch (_) {
    // -> EF_FME: fs.writeFileSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return markdown text
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    text: text
  });
  return;
});

router.post('/save', (req, res, next) => {
  const { type, folderName, filename, text } = req.body;
  if (req.status.notAuthSuccess()) {
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

  try {
    fs.writeFileSync(filePath, text);
  } catch (_) {
    // -> EF_FME: fs.writeFileSync error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return markdown text
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

module.exports = router;
