let express = require('express');
let fs = require('fs');
let api = require('../api');
let router = express.Router();

router.get('/*/:filename', (req, res, next) => {
  const { '0': folderName, filename } = req.params;
  const { download, thumbnail } = req.query;
  const { filePath } = api.fileOperator.pathCombinator('public', folderName, filename);

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

  // res.setHeader('Content-Security-Policy', 'sandbox');
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
