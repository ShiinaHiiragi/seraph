const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const defaultConfig = {
  meta: {
    password: ""
  },
  setting: {
    general: {
      language: "en"
    }
  }
};
exports.defaultConfig = defaultConfig;

const dataPath = {
  dataDirPath: path.join(__dirname, "./data"),
  publicDirPath: path.join(__dirname, "./data/public"),
  privateDirPath: path.join(__dirname, "./data/private"),
  configFilePath: path.join(__dirname, "./data/config.json"),
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

  readConfig: () => {
    if (!fs.existsSync(dataPath.configFilePath)) {
      fs.writeFileSync(
        dataPath.configFilePath,
        JSON.stringify(defaultConfig, null, 2)
      );
    }
    return JSON.parse(fs.readFileSync(dataPath.configFilePath));
  }
};
exports.fileOperator = fileOperator;

function Status() { }
exports.Status = Status;

Status.statusCode = {
  BeforeAuth: "BA",
  AuthFailed: "AF",
  AuthSuccess: "AS",
  ExecFailed: "EF",
  ExecSuccess: "ES",
  UnknownStatus: "US"
}

Status.authErrCode = {
  NotInit: "NI",
  InvalidToken: "IT",
  PasswordUnmatch: "PU"
}

Status.execErrCode = {
  InternalServerError: "ISE"
}

Status.prototype.status = Status.statusCode.BeforeAuth;
Status.prototype.err = null;

Status.prototype.addAuthStatus = function (errorCode) {
  [this.status, this.err] = errorCode
    ? [Status.statusCode.AuthFailed, errorCode]
    : [Status.statusCode.AuthSuccess, null];
}

Status.prototype.addExecStatus = function (errorCode) {
  [this.status, this.err] = errorCode
    ? [Status.statusCode.ExecFailed, errorCode]
    : [Status.statusCode.ExecSuccess, null];
}

Status.prototype.notAuthSuccess = function() {
  return this.status !== Status.statusCode.AuthSuccess;
}

Status.prototype.generateReport = function () {
  let result = { statusCode: this.status }
  return this.err ? { ...result, errorCode: this.err } : result;
}
