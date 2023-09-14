let express = require('express');
let api = require('../api');
let router = express.Router();

router.get('/meta', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.NotInit) {
      // -> AF_NI: the ONLY place legally returning this code
      next(api.errorStreamControl);
      return;
    } else {
      const publicFolder = api.fileOperator.readFoldersList(api.dataPath.publicDirPath);

      // -> ES: return publicly available metadata
      req.status.addExecStatus();
      res.send({
        ...req.status.generateReport(),
        public: publicFolder,
        setting: api.configOperator.config.setting
      })
      return;
    }
  } else {
    const publicFolder = api.fileOperator.readFoldersList(api.dataPath.publicDirPath);
    const privateFolder = api.fileOperator.readFoldersList(api.dataPath.privateDirPath);

    // -> ES: return all metadata
    req.status.addExecStatus();
    res.send({
      ...req.status.generateReport(),
      public: publicFolder,
      private: privateFolder,
      setting: api.configOperator.config.setting
    })
    return;
  }
});

router.post('/init', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.NotInit) {
      const { password, language } = req.body;
      api.configOperator.setConfigMetadata("password", password);
      api.configOperator.setConfigSetting("meta.language", language);
      api.tokenOperator.addNewSession(res);

      // -> ES: no extra info
      req.status.addExecStatus();
      res.send(req.status.generateReport());
      return;
    }
  }

  // -> abnormal request
  next(api.errorStreamControl);
  return;
});

router.post('/login', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err === api.Status.authErrCode.InvalidToken) {
      const { password } = req.body;
      if (password === api.configOperator.config.metadata.password) {
        api.tokenOperator.addNewSession(res);
        const privateFolder = api.fileOperator.readFoldersList(api.dataPath.privateDirPath);

        // -> ES: return private folders list
        req.status.addExecStatus();
        res.send({
          ...req.status.generateReport(),
          private: privateFolder,
        });
        return;
      } else {
        // -> EF_IP: wrong password
        req.status.addExecStatus(api.Status.execErrCode.IncorrectPassword);
        res.send(req.status.generateReport());
        return;
      }
    }
  }

  // -> abnormal request
  next(api.errorStreamControl);
  return;
});

router.post('/logout', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }

  api.tokenOperator.deleteSession(
    res,
    req.cookies[api.cookieOperator.sessionName]
  );

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

module.exports = router;
