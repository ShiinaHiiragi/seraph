let express = require('express');
let fs = require('fs');
let api = require('../api');
let router = express.Router();

router.get('/*/:filename', (req, res, next) => {
  const { '0': folderName, filename } = req.params;
  const { download, thumbnail } = req.query;
  const { filePath } = api.fileOperator.pathCombinator('private', folderName, filename);

  if (req.status.authTempPass() && api.secretOperator.isSecret(filePath)) {
    // -> EF_RU: hide secret paths from temporary authorization
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (!fs.existsSync(filePath)) {
    // -> next: folder don't exist
    next();
    return;
  }

  if (fs.lstatSync(filePath).isDirectory()) {
    // -> next: is a directory
    next();
    return;
  }

  if (req.status.notAuthSuccess()) {
    // -> AF_IT: is a file but fail to authenticate
    // send home-made 401 page instead of strange json
    res.sendFile(api.dataPath.authFilePath);
    return;
  }

  if (thumbnail === '1') {
    return api.fileOperator.sendThumbnail(res, filePath);
  }

  // -> no code: return file directly
  if (download === '1') {
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
    );
  }
  res.sendFile(filePath, { dotfiles: 'allow' });
  return;
});

module.exports = router;
