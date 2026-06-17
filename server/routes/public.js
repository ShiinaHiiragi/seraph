let express = require('express');
let fs = require('fs');
let path = require('path');
let api = require('../api');
let router = express.Router();

router.get('/*/:filename', (req, res, next) => {
  const { '0': folderName, filename } = req.params;
  const { download } = req.query;

  const folderPath = api.dataPath.publicDirFolderPath(folderName);
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
