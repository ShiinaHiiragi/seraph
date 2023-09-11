const fs = require('fs');
const path = require('path');

const FileOperator = {
  relativeToAbsoluteSpawner: (baseDirPath) => (relativePath) => path.join(baseDirPath, relativePath),
  probeDir: (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
      return false;
    }
    return true;
  },

  probeSetting: () => {
    
  }
}

module.exports = FileOperator;
