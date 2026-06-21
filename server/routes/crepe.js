let fs = require('fs');
let express = require('express');
let { applyPatch } = require('diff');
let api = require('../api');
let router = express.Router();

router.get('/load', (req, res, next) => {
  const { type, folderName, filename } = req.query;
  if (type === 'private' && req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const {
    folderPath: _,
    filePath
  } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  let text;
  try {
    text = fs.readFileSync(filePath).toString('utf-8');
  } catch (_) {
    // -> EF_FME: fs.readFileSync error
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

router.post('/update', (req, res, next) => {
  const { type, folderName, filename, diff } = req.body;
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const {
    folderPath: _,
    filePath
  } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  let newText;
  try {
    const originText = fs.readFileSync(filePath).toString('utf-8');
    newText = applyPatch(originText, diff, { fuzzFactor: 0 });
    if (newText !== false) {
      fs.writeFileSync(filePath, newText, 'utf-8');
    }
  } catch (_) {
    console.log(_);
    // -> EF_FME: read or write error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return markdown text
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    success: newText !== false
  });
  return;
});

router.post('/save', (req, res, next) => {
  const { type, folderName, filename, create, text } = req.body;
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { folderPath, filePath } = api.fileOperator.pathCombinator(type, folderName, filename);
  const fileExists = fs.existsSync(filePath);

  if (!fs.existsSync(folderPath)) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (fileExists && create) {
    // -> EF_IC: file already exists
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send({...req.status.generateReport(), 0: filename});
    return;
  } else if (!fileExists && !create) {
    // -> EF_RU: file don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  try {
    fs.writeFileSync(filePath, text, 'utf-8');
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
