const path = require('path');
const dotenv = require('dotenv');

exports.defaultSetting = {
  // TODO: finish default Setting
}

exports.dataPath = {
  dataDirPath: path.join(__dirname, "./data"),
  publicDirPath: path.join(__dirname, "./data/public"),
  privateDirPath: path.join(__dirname, "./data/private"),
  settingFilePath: path.join(__dirname, "./data/setting.json"),
  publicFolderDirPath: (folderName) => path.join(__dirname, "./data/public", folderName),
  privateFolderDirPath: (folderName) => path.join(__dirname, "./data/private", folderName),
  publicMarkdownDirPath: path.join(__dirname, "./data/public/markdown"),
  privateMarkdownDirPath: path.join(__dirname, "./data/private/markdown"),
};

dotenv.config();
const generateBaseURL = (protocol, hostname, port) => `${protocol}//${hostname}:${port}`

exports.dotenv = process.env
exports.generateBaseURL = generateBaseURL
exports.reactBaseURL = generateBaseURL(
  process.env.PROTOCOL,
  process.env.HOSTNAME,
  process.env.REPORT
)
