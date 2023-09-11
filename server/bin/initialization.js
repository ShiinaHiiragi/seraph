const path = require('path');
const FileOperator = require('../utils/FileOperator');
relativeToAbsolute = FileOperator.relativeToAbsoluteSpawner(__dirname);

const initialization = () => {
  FileOperator.probeDir(relativeToAbsolute("../data"));
  FileOperator.probeDir(relativeToAbsolute("../data/public"));
  FileOperator.probeDir(relativeToAbsolute("../data/private"));
}

module.exports = initialization;

initialization()
