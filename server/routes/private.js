let express = require('express');
let fs = require('fs');
let path = require('path');
let api = require('../api');
let router = express.Router();

router.get('/*/:filename', (req, res, next) => {
  const { '0': folderName, filename } = req.params;
  const { download } = req.query;

  const folderPath = api.dataPath.privateDirFolderPath(folderName);
  const filePath = path.join(folderPath, filename);

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
    // -> EF_IT: is a file but fail to authenticate
    // send home-made 401 page instead of strange json
    res.sendFile(api.dataPath.authFilePath);
    return;
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
