const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// copy .env in react directory
fs.copyFileSync(
  path.join(__dirname, '../../.env'),
  path.join(__dirname, '../.env')
);
dotenv.config();

const api = require('../api');
const init = () => {
  api.fileOperator
    .probeDir(api.dataPath.dataDirPath)
    .probeDir(api.dataPath.publicDirPath)
    .probeDir(api.dataPath.privateDirPath)
    .probeDir(api.dataPath.publicMarkdownDirPath)
    .probeDir(api.dataPath.privateMarkdownDirPath);

  api.fileOperator.readConfig();
  api.fileOperator.readToken();
}

module.exports = init;
