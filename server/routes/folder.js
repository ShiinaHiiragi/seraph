let express = require('express');
let path = require('path');
let api = require('../api');
let router = express.Router();

router.get('/public/*', (req, res) => {
  const { '0': folderName } = req.params;
  const { abstract } = req.query;
  const { folderPath } = api.fileOperator.pathCombinator('public', folderName);
  let folderInfo = api.fileOperator.readFolderInfo(folderPath, abstract === '1');

  if (folderInfo === null) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (req.status.notAuthSuccess()) {
    // CONTINUE ANYWAY: hide some files for guests
    // still accessible via direct url
    folderInfo = folderInfo.filter((item) => item.name[0] !== '.')
  }

  // -> ES: return folder info even if it's empty
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    info: folderInfo
  });
  return;
});

router.get(['/private', '/private/*'], (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> AF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { '0': folderName = '' } = req.params;
  const { abstract } = req.query;
  const {
    folderPath,
    isRoot
  } = api.fileOperator.pathCombinator('private', folderName);

  if (req.status.authTempPass() && api.secretOperator.isSecret(folderPath)) {
    // -> EF_RU: hide secret folders from temporary authorization
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  let folderInfo = api.fileOperator.readFolderInfo(folderPath, abstract === '1');
  if (folderInfo === null) {
    // -> EF_RU: folder don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (req.status.authTempPass() && isRoot) {
    folderInfo = folderInfo.filter((item) =>
      !api.secretOperator.isSecret(path.join(folderPath, item.name))
    );
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
