const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mime = require('mime');
const isBinaryPath = require('is-binary-path');
const CryptoJS = require('crypto-js');

// copy .env in react directory
// use .env to build base URL
fs.copyFileSync(
  path.join(__dirname, '../.env'),
  path.join(__dirname, '/.env')
);

dotenv.config();
const generateBaseURL = (protocol, hostname, port) => `${protocol}://${hostname}:${port}`;
const reactBaseURL = generateBaseURL(
  process.env.REACT_APP_PROTOCOL,
  process.env.REACT_APP_HOSTNAME,
  process.env.PORT
);
exports.generateBaseURL = generateBaseURL;
exports.reactBaseURL = reactBaseURL;


// intro __dirname
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

// setting should be consistent with defaultSetting in react
const defaultConfig = {
  metadata: {
    password: ""
  },
  setting: {
    meta: {
      language: "en",
    }
  }
};
exports.defaultConfig = defaultConfig;

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

  // folder means dir under public/ or private/
  readFoldersList: (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      return null;
    }

    folderInfo = fs.readdirSync(dirPath, { withFileTypes: true })
    folderInfo.filter((item) => item.isDirectory())
    return folderInfo.map((item) => item.name);
  },

  readFolderInfo: (folderPath) => {
    if (!fs.existsSync(folderPath)) {
      return null;
    }

    folderInfo = fs.readdirSync(folderPath, { withFileTypes: true })
    folderInfo.filter((item) => !item.isDirectory())
    return folderInfo.map((item) => {
      const stat = fs.statSync(path.join(folderPath, item.name));
      return {
        name: item.name,
        size: stat.size,
        time: stat.birthtime,
        type: mime.getType(item.name),
        bin: isBinaryPath(item.name)
      }
    });
  }
};
exports.fileOperator = fileOperator;

// avoid console.log error
;(function () {
  fileOperator
    .probeDir(dataPath.dataDirPath)
    .probeDir(dataPath.publicDirPath)
    .probeDir(dataPath.privateDirPath)
    .probeDir(dataPath.markdownDirPath)
    .probeDir(dataPath.publicMarkdownDirPath)
    .probeDir(dataPath.privateMarkdownDirPath)
    .probeDir(dataPath.independentMarkdownDirPath);

  fileOperator.readConfig();
  fileOperator.readToken();
})();

const configOperator = {
  config: fileOperator.readConfig(),
  setConfig: (handle) => {
    const newConfig = handle(configOperator.config);
    fileOperator.saveConfig(newConfig);
    configOperator.config = newConfig;
  },

  setConfigMetadata: (key, value) => {
    configOperator.setConfig((config) => ({
      ...config,
      metadata: {
        ...config.metadata,
        [key]: value
      }
    }));
  },

  setConfigSetting: (key, value) => {
    const [item, subItem] = key.split(".");
    configOperator.setConfig((config) => ({
      ...config,
      setting: {
        ...config.setting,
        [item]: {
          ...config.setting["item"],
          [subItem]: value
        }
      }
    }));
  }
}
exports.configOperator = configOperator;

const expiredPeriod = 2 * 60 * 60 * 1000;
const cookieOperator = {
  sessionName: "seraphSession",
  setSessionCookie: (res, session) => res.cookie(
    cookieOperator.sessionName,
    session,
    { expires: new Date(Date.now() + expiredPeriod) }
  ),

  deleteSessionCookie: (res) => res.clearCookie(
    cookieOperator.sessionName
  )
};

const tokenOperator = {
  token: fileOperator.readToken(),
  setToken: (handle) => {
    const newToken = handle(tokenOperator.token);
    fileOperator.saveToken(newToken);
    tokenOperator.token = newToken;
  },

  addNewSession: (res) => {
    const session = CryptoJS.SHA256(
      Array(16).fill().reduce(
        (current) => current +
          Math.random().toString(36).slice(2, 6),
        ""
      )
    ).toString();

    cookieOperator.setSessionCookie(res, session);
    tokenOperator.setToken((token) => [
      ...token,
      {
        session: session,
        timestamp: Date.now() + expiredPeriod
      }
    ]);
    return session;
  },

  deleteSession: (res, session) => {
    cookieOperator.deleteSessionCookie(res);
    tokenOperator.setToken((token) =>
      token.filter((item) => item.session !== session)
    );
  },

  validateUpdateSession: (res, session) => {
    const __clearExpiredSessions = () => {
      const timeNow = Date.now();
      tokenOperator.setToken((token) => 
        token.filter((item) => item.timestamp - timeNow > 0 )
      );
    };
    __clearExpiredSessions();

    sessionIndex = tokenOperator.token.findIndex((item) => item.session === session)
    if (sessionIndex >= 0) {
      cookieOperator.setSessionCookie(res, session);
      tokenOperator.setToken((token) => {
        token[sessionIndex].timestamp = Date.now() + expiredPeriod;
        return token;
      });
      return true;
    } else {
      return false;
    }
  }
};

exports.expiredPeriod = expiredPeriod;
exports.cookieOperator = cookieOperator;
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
  IncorrectPassword: "IP",
  ResourcesUnexist: "RU",
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
