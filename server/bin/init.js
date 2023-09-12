const dotenv = require('dotenv');
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
}

module.exports = init;
