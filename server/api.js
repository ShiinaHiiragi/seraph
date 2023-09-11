const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const defaultSetting = {
  // TODO: finish default Setting
};
exports.defaultSetting = defaultSetting;

const dataPath = {
  dataDirPath: path.join(__dirname, "./data"),
  publicDirPath: path.join(__dirname, "./data/public"),
  privateDirPath: path.join(__dirname, "./data/private"),
  settingFilePath: path.join(__dirname, "./data/setting.json"),
  publicFolderDirPath: (folderName) => path.join(__dirname, "./data/public", folderName),
  privateFolderDirPath: (folderName) => path.join(__dirname, "./data/private", folderName),
  publicMarkdownDirPath: path.join(__dirname, "./data/public/markdown"),
  privateMarkdownDirPath: path.join(__dirname, "./data/private/markdown"),
};
exports.dataPath = dataPath;

dotenv.config();
const generateBaseURL = (protocol, hostname, port) => `${protocol}//${hostname}:${port}`;
const reactBaseURL = generateBaseURL(
  process.env.PROTOCOL,
  process.env.HOSTNAME,
  process.env.REPORT
);

exports.dotenv = process.env;
exports.generateBaseURL = generateBaseURL;
exports.reactBaseURL = reactBaseURL;

const fileOperator = {
  probeDir: (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
      fs.chmodSync(dirPath, 0o777);
    }
    return fileOperator;
  },

  readSetting: () => {
    if (!fs.existsSync(dataPath.settingFilePath)) {
      fs.writeFileSync(
        dataPath.settingFilePath,
        JSON.stringify(defaultSetting)
      );
    }
    return JSON.parse(fs.readFileSync(dataPath.settingFilePath), null, 2);
  }
};
exports.fileOperator = fileOperator;

const authStatusCode = {
  NotInitialized: "NI",
  InvalidToken: "IT",
  AccountUnmatch: "AU",
  PasswordUnmatch: "PU",
  AuthSuccess: "AS",
}
exports.authStatusCode = authStatusCode;
