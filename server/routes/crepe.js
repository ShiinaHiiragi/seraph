let fs = require('fs');
let express = require('express');
let { applyPatch } = require('diff');
let api = require('../api');
let router = express.Router();

router.get('/style', (req, res, next) => {
  style = api.styleOperator.style;

  // -> ES: return markdown text
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    style: style
  });
  return;
});

router.get('/load', (req, res, next) => {
  const { type, folderName, filename } = req.query;
  if (type === 'private' && req.status.notAuthSuccess()) {
    // -> AF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const {
    folderPath: _,
    filePath
  } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (
    type === 'private'
      && req.status.authTempPass()
      && api.secretOperator.isSecret(filePath)
  ) {
    // -> EF_RU: hide secret paths from temporary authorization
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) {
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
    // -> AF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const {
    folderPath: _,
    filePath
  } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (
    type === 'private'
      && req.status.authTempPass()
      && api.secretOperator.isSecret(filePath)
  ) {
    // -> EF_RU: hide secret paths from temporary authorization
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

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
    // -> AF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { folderPath, filePath, isRoot } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (
    type === 'private'
      && req.status.authTempPass()
      && api.secretOperator.isSecret(folderPath)
  ) {
    // -> EF_RU: hide secret paths from temporary authorization
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (isRoot && create) {
    // -> EF_FUR: try to create file under root
    req.status.addExecStatus(api.Status.execErrCode.FileUnderRoot);
    res.send(req.status.generateReport());
    return;
  }

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
