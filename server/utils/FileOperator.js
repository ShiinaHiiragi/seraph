const fs = require('fs');
const path = require('path');
const api = require('../api');

const FileOperator = {
  relativeToAbsoluteSpawner: (baseDirPath) => (relativePath) => path.join(baseDirPath, relativePath),
  probeDir: (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
      return false;
    }
    return true;
  },

  readSetting: () => {
    if (!fs.existsSync(api.dataPath.settingFilePath)) {
      fs.writeFileSync(
        api.dataPath.settingFilePath,
        JSON.stringify(api.defaultSetting)
      )
    }

    return JSON.parse(fs.readFileSync(api.dataPath.settingFilePath), null, 2);
  }
}

module.exports = FileOperator;
