let fs = require('fs');
let express = require('express');
let api = require('../api');
let router = express.Router();

router.get('/list', (req, res, next) => {
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

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    // -> EF_RU: file does not exist or is not a regular file
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  let card;
  try {
    card = new api.cardOperator(filePath);
  } catch (_) {
    // -> EF_FME: file read or JSON parse error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  if (!card.valid) {
    // -> EF_TCF: invalid hare array
    req.status.addExecStatus(api.Status.execErrCode.TypeCheckFailed);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return hare array
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    hare: card.card
  });
  return;
});

router.post('/add', (req, res, next) => {
  const { type, folderName, filename, query, key } = req.body;
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const {
    folderPath: _,
    filePath
  } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    // -> EF_RU: file does not exist or is not a regular file
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  let card;
  try {
    card = new api.cardOperator(filePath);
  } catch (_) {
    // -> EF_FME: file read or JSON parse error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  if (!card.valid) {
    // -> EF_TCF: invalid hare array
    req.status.addExecStatus(api.Status.execErrCode.TypeCheckFailed);
    res.send(req.status.generateReport());
    return;
  }

  let item;
  try {
    item = card.addCard(query, key);
  } catch (_) {
    // -> EF_FME: file write error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: return new card info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...item
  });
  return;
});

router.post('/edit', (req, res, next) => {
  const { type, folderName, filename, id, query, key } = req.body;
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const {
    folderPath: _,
    filePath
  } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    // -> EF_RU: file does not exist or is not a regular file
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  let card;
  try {
    card = new api.cardOperator(filePath);
  } catch (_) {
    // -> EF_FME: file read or JSON parse error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  if (!card.valid) {
    // -> EF_TCF: invalid hare array
    req.status.addExecStatus(api.Status.execErrCode.TypeCheckFailed);
    res.send(req.status.generateReport());
    return;
  }

  const target_index = card.card.findIndex((item) => item.id === id);
  if (target_index === -1) {
    // -> EF_RU: card does not exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  try {
    card.editCard(target_index, query, key);
  } catch (_) {
    // -> EF_FME: file write error
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
  const { type, folderName, filename, id } = req.body;
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const {
    folderPath: _,
    filePath
  } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    // -> EF_RU: file does not exist or is not a regular file
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  let card;
  try {
    card = new api.cardOperator(filePath);
  } catch (_) {
    // -> EF_FME: file read or JSON parse error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  if (!card.valid) {
    // -> EF_TCF: invalid hare array
    req.status.addExecStatus(api.Status.execErrCode.TypeCheckFailed);
    res.send(req.status.generateReport());
    return;
  }

  const target_index = card.card.findIndex((item) => item.id === id);
  if (target_index === -1) {
    // -> EF_RU: card does not exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  try {
    card.deleteCard(target_index);
  } catch (_) {
    // -> EF_FME: file write error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

router.post('/sort', (req, res, next) => {
  const { type, folderName, filename, id, index } = req.body;
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { filePath } = api.fileOperator.pathCombinator(type, folderName, filename);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    // -> EF_RU: file does not exist or is not a regular file
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  let card;
  try {
    card = new api.cardOperator(filePath);
  } catch (_) {
    // -> EF_FME: file read or JSON parse error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  const target_index = card.card.findIndex((item) => item.id === id);
  if (target_index === -1) {
    // -> EF_RU: card does not exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (target_index !== index) {
    const [item] = card.card.splice(target_index, 1);
    card.card.splice(index, 0, item);
    try {
      api.fileOperator.saveCard(filePath, card.card);
    } catch (_) {
      // -> EF_FME: file write error
      req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
      res.send(req.status.generateReport());
      return;
    }
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

router.post('/save', (req, res, next) => {
  const { type, folderName, filename, create, hare } = req.body;
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const {
    folderPath,
    filePath
  } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    // -> EF_RU: folder does not exist or is not a directory
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (create && fs.existsSync(filePath)) {
    // -> EF_IC: file already exists when create is true
    req.status.addExecStatus(api.Status.execErrCode.IdentifierConflict);
    res.send({ ...req.status.generateReport(), 0: filename });
    return;
  }

  if (!create && !(fs.existsSync(filePath) && fs.statSync(filePath).isFile())) {
    // -> EF_RU: file does not exist or is not a regular file when create is false
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (!api.cardOperator.isValid(hare)) {
    // -> EF_TCF: invalid hare format
    req.status.addExecStatus(api.Status.execErrCode.TypeCheckFailed);
    res.send(req.status.generateReport());
    return;
  }

  try {
    api.fileOperator.saveCard(filePath, hare);
  } catch (_) {
    // -> EF_FME: file write error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

router.post('/sync', (req, res, next) => {
  const { type, folderName, filename, start, index, update } = req.body;
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const {
    folderPath: _,
    filePath
  } = api.fileOperator.pathCombinator(type, folderName, filename);

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    // -> EF_RU: file does not exist or is not a regular file
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  let card;
  try {
    card = new api.cardOperator(filePath);
  } catch (_) {
    // -> EF_FME: file read or JSON parse error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  if (!card.valid) {
    // -> EF_TCF: invalid hare array
    req.status.addExecStatus(api.Status.execErrCode.TypeCheckFailed);
    res.send(req.status.generateReport());
    return;
  }

  let success;
  try {
    success = card.syncCard(start, index, update);
  } catch (_) {
    // -> EF_FME: file write error
    req.status.addExecStatus(api.Status.execErrCode.FileModuleError);
    res.send(req.status.generateReport());
    return;
  }

  if (!success) {
    // -> EF_TCF: invalid start, point index or update object
    req.status.addExecStatus(api.Status.execErrCode.TypeCheckFailed);
    res.send(req.status.generateReport());
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

module.exports = router;
