const os = require('os');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mime = require('mime');
const child = require('child_process');
const assert = require('assert');
const CryptoJS = require('crypto-js');
const checkDiskSpace = require('check-disk-space').default

String.prototype.versionGE = function (min) {
  const left = this.split('.').map(Number);
  const right = min.split('.').map(Number);
  const len = Math.max(left.length, right.length);
  for (let i = 0; i < len; i++) {
    const padLeft = left[i] ?? 0;
    const padRight = right[i] ?? 0;
    if (padLeft !== padRight) {
      return padLeft > padRight;
    }
  }
  return true;
};

// copy .env in react directory
// use .env to build base URL
fs.copyFileSync(
  path.join(__dirname, '../.env'),
  path.join(__dirname, '/.env')
);
fs.chmodSync(path.join(__dirname, '/.env'), 0o777);

dotenv.config();
const isLoopback = (hostname) => {
  const h = hostname.toLowerCase();
  return h === "localhost" || h === "::1" || /^127(\.\d{1,3}){3}$/.test(h);
}
const generateBaseURL = (protocol, hostname, port) => `${protocol}://${hostname}:${port}`;

exports.isLoopback = isLoopback;
exports.generateBaseURL = generateBaseURL;

// intro __dirname
const dataPath = {
  packageFilePath: path.join(__dirname, "../package.json"),
  buildDirPath: path.join(__dirname, "../build"),
  certDirPath: path.join(__dirname, "./cert"),
  dataDirPath: path.join(__dirname, "./data"),
  publicDirPath: path.join(__dirname, "./data/public"),
  privateDirPath: path.join(__dirname, "./data/private"),
  configFilePath: path.join(__dirname, "./data/config.json"),
  tokenFilePath: path.join(__dirname, "./data/token.json"),
  taskFilePath: path.join(__dirname, "./data/task.json"),
  markdownDirPath: path.join(__dirname, "./data/markdown"),
  publicMarkdownDirPath: path.join(__dirname, "./data/markdown/public"),
  privateMarkdownDirPath: path.join(__dirname, "./data/markdown/private"),
  independentMarkdownDirPath: path.join(__dirname, "./data/markdown/independent"),
  extensionDirPath: path.join(__dirname, "../extensions"),
  publicDirFolderPath: (folderName) => path.join(__dirname, "./data/public", folderName),
  privateDirFolderPath: (folderName) => path.join(__dirname, "./data/private", folderName),
};

const extentPath = {
  epubConverterFilePath: path.join(dataPath.extensionDirPath, "./ranobe-tools/single/epub.py")
}
exports.dataPath = dataPath;
exports.extentPath = extentPath;

// setting should be consistent with defaultSetting in react
const defaultConfig = {
  metadata: {
    password: ""
  },
  clipboard: {
    permanent: null,
    directory: null,
    path: null
  },
  setting: {
    meta: {
      language: "en",
      token: 120
    },
    task: {
      delay: 60
    }
  }
};
exports.defaultConfig = defaultConfig;

const fileOperator = {
  pathCombinator: (type, folderName, filename) => {
    const folderPath = dataPath[
      type === "private"
        ? "privateDirFolderPath"
        : "publicDirFolderPath"
    ](folderName);
    const filePath = path.join(folderPath, filename);
    return {
      folderPath: folderPath,
      filePath: filePath
    };
  },

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

  readTask: () => {
    if (!fs.existsSync(dataPath.taskFilePath)) {
      fs.writeFileSync(
        dataPath.taskFilePath,
        JSON.stringify([ ], null, 2)
      );
      fs.chmodSync(dataPath.taskFilePath, 0o777);
    }
    return JSON.parse(fs.readFileSync(dataPath.taskFilePath));
  },

  saveTask: (task) => {
    fs.writeFileSync(
      dataPath.taskFilePath,
      JSON.stringify(task, null, 2)
    );
  },

  readCert: () => {
    const privateCrt = fs.readFileSync(
      path.join(
        dataPath.certDirPath,
        `${process.env.REACT_APP_HOSTNAME}.crt`
      )
    );
    const privateKey = fs.readFileSync(
      path.join(
        dataPath.certDirPath,
        `${process.env.REACT_APP_HOSTNAME}.key`
      )
    );

    return {
      key: privateKey,
      cert: privateCrt
    };
  },

  // folder means dir under public/ or private/
  readFoldersList: (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      return null;
    }

    let folderInfo = fs.readdirSync(dirPath, { withFileTypes: true })
    folderInfo = folderInfo.filter((item) => item.isDirectory())
    return folderInfo.map((item) => item.name);
  },

  readFileInfo: (folderPath, filename) => {
    const stat = fs.lstatSync(path.join(folderPath, filename));
    return {
      name: filename,
      size: stat.size,
      time: stat.birthtime,
      mtime: stat.mtime,
      type: stat.isDirectory()
        ? "directory"
        : (mime.getType(filename) ?? "unknown")
    }
  },

  readFolderInfo: (folderPath) => {
    if (!fs.existsSync(folderPath)) {
      return null;
    }

    let folderInfo = fs.readdirSync(folderPath, { withFileTypes: true })
    return folderInfo.map((item) => fileOperator.readFileInfo(folderPath, item.name));
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
  fileOperator.readTask();
})();

const configOperator = {
  hasKey: (obj, key) => key.split(".").reduce(
    (current, nextKey) => current?.[nextKey],
    obj
  ) !== undefined,

  setValue: (obj, key, value) => {
    const parts = key.split(".");
    if (parts.length > 1) {
      const outerKey = parts[0];
      const innerKeys = parts.slice(1).join(".");
      return {
        ...obj,
        [outerKey]: configOperator.setValue(obj[outerKey], innerKeys, value)
      }
    } else {
      return {
        ...obj,
        [key]: value
      }
    }
  },

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

  setConfigClipboard: (path, permanent) => {
    const { filePath } = fileOperator.pathCombinator(...path);
    configOperator.setConfig((config) => ({
      ...config,
      clipboard: {
        permanent: permanent,
        directory: fs.lstatSync(filePath).isDirectory(),
        path: path
      }
    }));
  },

  clearConfigClipboard: () => {
    configOperator.setConfig((config) => ({
      ...config,
      clipboard: {
        permanent: null,
        directory: null,
        path: null
      }
    }));
  },

  setConfigSetting: (key, value) => {
    configOperator.setConfig((config) => ({
      ...config,
      setting: configOperator.setValue(config.setting, key, value)
    })
    );
  }
}


const checkConfig = (config, defaultConfig) => {
  const default_config_keys = Object.keys(defaultConfig)
  const config_keys = Object.keys(config)

  default_config_keys.forEach((key) => {
    if (config[key] === undefined) {
      config[key] = defaultConfig[key]
    }
    if (typeof defaultConfig[key] === 'object' && defaultConfig[key] !== null) {
      checkConfig(config[key], defaultConfig[key]);
    }
  });
  config_keys.forEach((key) => {
    if (!default_config_keys.includes(key)) {
      delete config[key];
    }
  });
  return config;
};
configOperator.setConfig((config) => checkConfig(config, defaultConfig));

exports.configOperator = configOperator;
exports.checkConfig = checkConfig;

const expiredPeriod = configOperator.config.setting.meta.token * 60 * 1000;
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

    let sessionIndex = tokenOperator.token.findIndex((item) => item.session === session)
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

const checkerOperator = {
  python: os.platform() === 'win32' ? 'python' : 'python3',
  pass: (miss) => {
    const notPassed = miss instanceof Array && miss.length > 0
    return {
      pass: !notPassed,
      miss: notPassed ? miss : []
    }
  },

  checkFiles: (files) => () => {
    return checkerOperator.pass(
      files
        .filter((file) => !fs.existsSync(file) || fs.lstatSync(file).isDirectory())
        .map((item) => ({ id: path.normalize(item), cat: "Files" }))
    )
  },

  checkPandoc: () => () => {
    try {
      child.execFileSync('pandoc', ['--version']);
      return checkerOperator.pass()
    } catch (_) {
      return checkerOperator.pass([{ id: "pandoc", cat: "Packages" }]);
    }
  },

  checkPython: (minVersion) => () => {
    try {
      const stdout = child.execFileSync(
        checkerOperator.python,
        ['--version'],
        { encoding: 'utf8' }
      );
      const version = stdout.match(/Python ([.0-9]+)/)[1];
      assert(version.versionGE(minVersion))
      return checkerOperator.pass()
    } catch (_) {
      return checkerOperator.pass([{ id: `python (>=${minVersion})`, cat: "Packages" }]);
    }
  },

  checkPip: (packages) => () => {
    const script = `
      import json
      import importlib.util
      missing = [p for p in ${JSON.stringify(packages)} if importlib.util.find_spec(p) is None]
      print(json.dumps(missing))
    `.replaceAll("\n      ", "\n");

    try {
      const stdout = child.execFileSync(
        checkerOperator.python,
        ['-c', script],
        { encoding: 'utf8' }
      );
      const miss = JSON.parse(stdout.trim());
      return checkerOperator.pass(
        miss.map((pkg) => ({ id: pkg, cat: "Pip packages" }))
      );
    } catch (_) {
      return checkerOperator.pass(
        packages.map((pkg) => ({ id: pkg, cat: "Pip packages" }))
      );
    }
  },

  check: (handles) => {
    let results = {}
    const rawMiss = handles.reduce(
      (prev, curr) => [...prev, ...curr().miss],
      []
    );
    rawMiss.forEach((item) => {
      if (results.hasOwnProperty(item.cat)) {
        results[item.cat].push(item.id)
      } else {
        results[item.cat] = [item.id]
      }
    });
    return results
  }
}

const checkerParam = {
  epubConverter: [
    checkerOperator.checkFiles([extentPath.epubConverterFilePath]),
    checkerOperator.checkPandoc(),
    checkerOperator.checkPython('3.8'),
    checkerOperator.checkPip(['numpy', 'PIL', 'bs4', 'markdown_it'])
  ]
}

const taskOperator = {
  task: fileOperator.readTask(),
  setTask: (handle) => {
    const newTask = handle(taskOperator.task);
    fileOperator.saveTask(newTask);
    taskOperator.task = newTask;
  },

  __clearExpiredTask: () => {
    const timeNow = Date.now();
    taskOperator.setTask((task) => task.filter(
      (item) => (item.deleteTime === null || item.deleteTime >= timeNow)
    ));
  },

  findTask: (id, createTime) => {
    taskOperator.__clearExpiredTask();
    return taskOperator.task.findIndex(
      (item) => item.id === id && item.createTime === createTime
    )
  },

  accessTask: () => {
    taskOperator.__clearExpiredTask();
    return taskOperator.task;
  },

  addTask: (name, description, type, dueTime) => {
    taskOperator.__clearExpiredTask();
    const id = CryptoJS.MD5(
      Array(16).fill().reduce(
        (current) => current +
          Math.random().toString(36).slice(2, 6),
        ""
      )
    ).toString();

    const newTask = {
      id: id,
      createTime: Date.now(),
      name: name,
      description: description,
      type: type,
      dueTime: dueTime,
      deleteTime: null
    };
    taskOperator.setTask((task) => [ newTask, ...task ])
    return {
      id: newTask.id,
      createTime: newTask.createTime
    };
  },

  tickTask: (index) => {
    taskOperator.setTask((task) => {
      task[index].deleteTime = task[index].type === 'sync'
        ? task[index].dueTime
        : Date.now() + configOperator.config.setting.task.delay * 1000;
      return task;
    })
    return taskOperator.task[index];
  },

  untickTask: (index) => {
    taskOperator.setTask((task) => {
      task[index].deleteTime = null;
      return task;
    })
  },

  editTask: (index, name, description, type, dueTime) => {
    taskOperator.setTask((task) => {
      if (type !== 'sync' && task[index].deleteTime !== null) {
        task[index].deleteTime = Date.now() + configOperator.config.setting.task.delay * 1000;
      }
      if (type === 'sync' && task[index].deleteTime !== null) {
        task[index].deleteTime = dueTime;
      }
      task[index] = {
        ...task[index],
        name: name,
        description: description,
        type: type,
        dueTime: dueTime
      };
      return task;
    })
    return taskOperator.task[index];
  },

  deleteTask: (index) => {
    taskOperator.setTask((task) => task.filter(
      (_, task_index) => index !== task_index
    ));
  }
};

exports.expiredPeriod = expiredPeriod;
exports.cookieOperator = cookieOperator;
exports.tokenOperator = tokenOperator;
exports.checkerOperator = checkerOperator;
exports.checkerParam = checkerParam;
exports.taskOperator = taskOperator;


// seraph and server info
const free = () => os.freemem();
const diskUsageAsync = () => checkDiskSpace(dataPath.dataDirPath);

const version = () => {
  const package = JSON.parse(fs.readFileSync(dataPath.packageFilePath));
  return package.version;
}

const osInfo = () => ({
  userAtHostname: os.userInfo().username + '@' + os.hostname(),
  platform: os.platform() + ' ' + os.release() + ' ' + os.arch(),
  kernelVersion: os.version(),
  memory: os.totalmem(),
  uptime: os.uptime()
});

exports.free = free;
exports.diskUsageAsync = diskUsageAsync;
exports.version = version;
exports.osInfo = osInfo;


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
  IdentifierConflict: "IC",
  FileModuleError: "FME",
  EnvironmentMissing: "EM",
  ExtensionError: "EE",
  DuplicateRequest: "DR",
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
