const path = require('path');

exports.dataPath = {
  dataDirPath: path.join(__dirname, "./data"),
  publicDirPath: path.join(__dirname, "./data/public"),
  privateDirPath: path.join(__dirname, "./data/private"),
  settingFilePath: path.join(__dirname, "./data/setting.json")
};

exports.generateBaseURL = (protocol, hostname, port) => `${protocol}//${hostname}:${port}`
