const os = require('os');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mime = require('mime');
const child = require('child_process');
const assert = require('assert');
const crypto = require('crypto');
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
// minutes:
//   meta.token
//   lifecycle.timeout
// seconds
//   terminal.lifecycle.ping
//   task.delay
const defaultConfig = {
  metadata: {
    password: "",
    terminal: false
  },
  clipboard: {
    permanent: null,
    directory: null,
    path: null
  },
  setting: {
    meta: {
      language: "en",
      token: 60
    },
    welcome: {
      window: {
        cpu: 120,
        net: 60
      },
      interval: 45,
    },
    terminal: {
      enable: false,
      shell: {
        linux: "bash",
        win32: "powershell.exe"
      },
      lifecycle: {
        ping: 60,
        timeout: 30,
      },
      cursor: {
        blink: false,
        reflow: false,
        active: "block",
        inactive: "outline"
      },
      font: {
        size: 14,
        family: "Noto Sans Mono",
        weight: "normal",
        weightBold: "bold"
      },
      scroll: {
        back: 1000,
        normal: 1,
        fast: 4
      },
      text: {
        space: 0,
        height: 1,
        contrast: 1,
        separator: "()[]{} ',\"`─‘’|"
      },
      theme: {
        transparency: false,
        selectionBackground: "#C8D2E6",
        background: "#F8F8F8",
        foreground: "#383838",
        cursor: "#383838",
        cursorAccent: "#F8F8F8",
        black: "#383A42",
        blue: "#4078F2",
        cyan: "#0184BC",
        green: "#50A14F",
        magenta: "#A626A4",
        red: "#E45649",
        white: "#A0A1A7",
        yellow: "#C18401",
        brightBlack: "#4F525E",
        brightBlue: "#4078F2",
        brightCyan: "#0184BC",
        brightGreen: "#50A14F",
        brightMagenta: "#A626A4",
        brightRed: "#E45649",
        brightWhite: "#383A42",
        brightYellow: "#C18401"
      },
      control: {
        esc: true,
        ctrl: {
          A: false,
          B: true,
          C: true,
          D: false,
          E: false,
          F: false,
          G: false,
          H: false,
          I: false,
          J: false,
          K: false,
          L: false,
          M: false,
          N: false,
          O: false,
          P: false,
          Q: false,
          R: false,
          S: false,
          T: false,
          U: false,
          V: false,
          W: false,
          X: false,
          Y: false,
          Z: true
        }
      }
    },
    task: {
      delay: 60
    },
    extension: {
      python: {
        linux: "python3",
        win32: "python"
      },
      pandoc: {
        linux: "pandoc",
        win32: "pandoc"
      }
    },
    epub: {
      page: {
        split: true,
        front: true
      },
      nav: {
        link: true,
        prev: "← 前へ",
        next: "次へ →"
      },
      fade: {
        kana: null,
        opaque: "72",
        size: "84",
        top: "-6"
      },
      image: {
        show: true,
        width: null,
        altInline: true,
        altBlock: false,
        spec: true
      },
      text: {
        clearLine: true,
        showRuby: true,
        breakLine: ""
      },
      out: {
        html: false,
        vert: false,
        keep: false
      }
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
    const filePath = path.join(folderPath, filename)
    const stat = fs.lstatSync(filePath);
    const isDir = stat.isDirectory();

    return {
      name: filename,
      size: isDir
        ? fs.readdirSync(filePath).length
        : stat.size,
      time: stat.birthtime,
      mtime: stat.mtime,
      type: isDir
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
  },

  savePassword: (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    configOperator.setConfigMetadata("password", `${salt}:${hash}`)
  },

  verifyPassword: (password) => {
    const [salt, hash] = configOperator.config.metadata.password.split(':');
    const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex'));
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

const expiredPeriod = () => configOperator.config.setting.meta.token * 60 * 1000;
const cookieOperator = {
  sessionName: "seraphSession",
  setSessionCookie: (res, session) => res.cookie(
    cookieOperator.sessionName,
    session,
    { expires: new Date(Date.now() + expiredPeriod()) }
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
    const session = crypto.randomBytes(32).toString('hex');
    cookieOperator.setSessionCookie(res, session);
    tokenOperator.setToken((token) => [
      ...token,
      {
        session: session,
        timestamp: Date.now() + expiredPeriod()
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
      // res is undefined when wssAuth() called
      if (res !== undefined) {
        cookieOperator.setSessionCookie(res, session);
      }
      tokenOperator.setToken((token) => {
        token[sessionIndex].timestamp = Date.now() + expiredPeriod();
        return token;
      });
      return true;
    } else {
      return false;
    }
  }
};

const checkerOperator = {
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
      child.execFileSync(
        configOperator.config.setting.extension.pandoc[process.platform],
        ['--version']
      );
      return checkerOperator.pass()
    } catch (_) {
      return checkerOperator.pass([{ id: "pandoc", cat: "Packages" }]);
    }
  },

  checkPython: (minVersion) => () => {
    try {
      const stdout = child.execFileSync(
        configOperator.config.setting.extension.python[process.platform],
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
        configOperator.config.setting.extension.python[process.platform],
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

const taskDelay = () => configOperator.config.setting.task.delay * 1000;
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
    const id = crypto.randomBytes(16).toString('hex');

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
        : Date.now() + taskDelay();
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
        task[index].deleteTime = Date.now() + taskDelay();
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
exports.taskDelay = taskDelay;
exports.tokenOperator = tokenOperator;
exports.checkerOperator = checkerOperator;
exports.checkerParam = checkerParam;
exports.taskOperator = taskOperator;


// seraph and server info
const infoOperator = {
  maxWindow: 200,
  recordInterval: 1000,
  netSamplerSpan: 200,

  history: [],
  push: ([cpu, mem, disk, net]) => {
    if (infoOperator.history.length >= infoOperator.maxWindow) {
      infoOperator.history.shift();
    }
    infoOperator.history.push({
      cpu: cpu,
      mem: mem,
      disk: disk.free,
      net: net,
      time: Date.now()
    })
  },
  // Array.filter keeps the order
  laterThan: (timestamp = 0) =>
    infoOperator.history.filter((item) => item.time > timestamp),

  version: () => {
    const pkg = JSON.parse(fs.readFileSync(dataPath.packageFilePath));
    return pkg.version;
  },

  osInfo: () => {
    const cpus = os.cpus();
    const networkInterfaces = Object
      .entries(os.networkInterfaces())
      .map(([ name, interfaces ]) => [ name, interfaces.filter((item) =>
        !item.internal && item.family === 'IPv4'
      )])
      .filter(([ name, interfaces ]) =>
        !name.startsWith("veth") && interfaces.length > 0
      );

    return {
      memory: os.totalmem(),
      storage: undefined,
      uptime: os.uptime(),
      userAtHostname: os.userInfo().username + '@' + os.hostname(),
      platform: os.platform() + ' ' + os.release() + ' ' + os.arch(),
      kernelVersion: os.version(),
      cpus: {
        model: cpus[0].model,
        speed: cpus[0].speed,
        cores: cpus.length
      },
      network: Object.fromEntries(networkInterfaces),
    }
  },

  handleSampler: (
    handleRecord,
    handleDiff,
    measureInterval = 200
  ) => () => new Promise((resolve) => {
    const start = handleRecord();
    setTimeout(
      () => resolve(handleDiff(start, handleRecord())),
      measureInterval
    );
  }),

  // unrelated  to time
  cpuUsage: () => infoOperator.handleSampler(
    os.cpus,
    (start, end) => {
      const perCore = start.map((cpu, index) => {
        const startTimes = cpu.times, endTimes = end[index].times;
        const total = Object.values(endTimes).reduce((prev, next) => prev + next, 0)
          - Object.values(startTimes).reduce((prev, next) => prev + next, 0);
        return total === 0 ? 0 : 1 - (endTimes.idle - startTimes.idle) / total;
      });
      return perCore.reduce((prev, curr) => prev + curr, 0) / perCore.length;
    }
  )(),
  memoryUsage: () => os.freemem(),
  diskUsage: () => checkDiskSpace(dataPath.dataDirPath),

  physicalInterface: /^(eth|ens|enp|em|wlan|wlp)/,
  netStates: process.platform === 'linux'
    ? () => {
      const lines = fs.readFileSync('/proc/net/dev', 'utf8').split('\n');
      let rx = 0, tx = 0;
      for (const line of lines.slice(2)) {
        const trimmed = line.trim();
        const [iface, data] = trimmed.split(':');
        if (trimmed && infoOperator.physicalInterface.test(iface.trim())) {
          const fields = data.trim().split(/\s+/);
          rx += parseInt(fields[0]);
          tx += parseInt(fields[8]);
        }
      }
      return { rx: rx, tx: tx };
    }
    : () => ({ rx: 0, tx: 0 }),
  netUsage: () => infoOperator.handleSampler(
    infoOperator.netStates,
    (start, end) => ({
      rxBPS: (end.rx - start.rx) / infoOperator.netSamplerSpan * 1000,
      txBPS: (end.tx - start.tx) / infoOperator.netSamplerSpan * 1000,
    }),
    infoOperator.netSamplerSpan
  )()
};

setInterval(() => {
  Promise.all([
    infoOperator.cpuUsage(),
    new Promise((resolve) => resolve(infoOperator.memoryUsage())),
    infoOperator.diskUsage(),
    infoOperator.netUsage(),
  ]).then(infoOperator.push);
}, infoOperator.recordInterval);

exports.infoOperator = infoOperator;


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
