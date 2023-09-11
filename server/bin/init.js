const api = require('../api');
const FileOperator = require('../utils/FileOperator');

const init = () => {
  FileOperator.probeDir(api.dataPath.dataDirPath);
  FileOperator.probeDir(api.dataPath.publicDirPath);
  FileOperator.probeDir(api.dataPath.privateDirPath);
  FileOperator.initSetting();
}

module.exports = init;

init()
