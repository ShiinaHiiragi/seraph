const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

const defaultConfig = {
  meta: {
    language: "en",
    password: ""
  },
  setting: { }
};
exports.defaultConfig = defaultConfig;

const dataPath = {
  dataDirPath: path.join(__dirname, "./data"),
  publicDirPath: path.join(__dirname, "./data/public"),
  privateDirPath: path.join(__dirname, "./data/private"),
  configFilePath: path.join(__dirname, "./data/config.json"),
  tokenFilePath: path.join(__dirname, "./data/token.json"),
  markdownDirPath: path.join(__dirname, "./data/markdown"),
  publicMarkdownDirPath: path.join(__dirname, "./data/markdown/public"),
  privateMarkdownDirPath: path.join(__dirname, "./data/markdown/private"),
  independentMarkdownDirPath: path.join(__dirname, "./data/markdown/independent"),
  publicFolderDirPath: (folderName) => path.join(__dirname, "./data/public", folderName),
  privateFolderDirPath: (folderName) => path.join(__dirname, "./data/private", folderName),
};
exports.dataPath = dataPath;

const generateBaseURL = (protocol, hostname, port) => `${protocol}://${hostname}:${port}`;
const reactBaseURL = generateBaseURL(
  process.env.REACT_APP_PROTOCOL,
  process.env.REACT_APP_HOSTNAME,
  process.env.PORT
);

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
      fs.chmodSync(dataPath.configFilePath, 0o777);
    }
    return JSON.parse(fs.readFileSync(dataPath.configFilePath));
  },

  saveConfig: (config) => {
    fs.writeFileSync(
      dataPath.configFilePath,
      JSON.stringify(config, null, 2)
    );
  },

  readToken: () => {
    if (!fs.existsSync(dataPath.tokenFilePath)) {
      fs.writeFileSync(
        dataPath.tokenFilePath,
        JSON.stringify([ ], null, 2)
      );
      fs.chmodSync(dataPath.tokenFilePath, 0o777);
    }
    return JSON.parse(fs.readFileSync(dataPath.tokenFilePath));
  },

  saveToken: (token) => {
    fs.writeFileSync(
      dataPath.tokenFilePath,
      JSON.stringify(token, null, 2)
    );
  },

  // folder means public/ or private/
  readFolder: (folderPath) => {
    folderInfo = fs.readdirSync(dataPath.publicDirPath, { withFileTypes: true })
    folderInfo.filter((item) => item.isDirectory())
    return folderInfo.map((item) => item.name);
  }
};
exports.fileOperator = fileOperator;

const expiredPeriod = 24 * 60 * 60 * 1000;
const tokenOperator = {
  addNewSession: () => {
    const session = CryptoJS.SHA256(
      Array(16).fill().reduce(
        (current) => current + Math.random().toString(36).slice(2, 6),
        ""
      )
    ).toString();

    const token = fileOperator.readToken();
    token.push({
      session: session,
      timestamp: Date.now() + expiredPeriod
    })
    fileOperator.saveToken(token);
    return session;
  },

  deleteSession: (session) => {
    const token = fileOperator.readToken();
    fileOperator.saveToken(token.filter((item) => item.session !== session));
  },

  validateUpdateSession: (session) => {
    const __clearExpiredSession = () => {
      const timeNow = Date.now();
      const token = fileOperator.readToken();
      fileOperator.saveToken(token.filter((item) => item.timestamp - timeNow > 0 ));
    };

    __clearExpiredSession();
    const token = fileOperator.readToken();
    sessionIndex = token.findIndex((item) => item.session === session)
    if (sessionIndex >= 0) {
      token[sessionIndex].timestamp = Date.now() + expiredPeriod;
      fileOperator.saveToken(token);
      return true;
    } else {
      return false;
    }
  }
}
exports.expiredPeriod = expiredPeriod;
exports.tokenOperator = tokenOperator;

function Status() { }
exports.Status = Status;

Status.statusCode = {
  BeforeAuth: "BA",
  AuthFailed: "AF",
  AuthSuccess: "AS",
  ExecFailed: "EF",
  ExecSuccess: "ES"
}

Status.authErrCode = {
  NotInit: "NI",
  InvalidToken: "IT"
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

// next(api.errorStreamControl) indicates a controllable error
const errorStreamControl = new Error("SERAPH");
errorStreamControl.validity = true;
exports.errorStreamControl = errorStreamControl;
