let assert = require('assert');
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
      const publicFolder = api.fileOperator
        .readFoldersList(api.dataPath.publicDirPath)
        .filter((item) => item[0] !== '.');

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
    const privateFolder = api.fileOperator.readFoldersList(api.dataPath.privateDirPath)
      .filter((item) => !(
        req.status.authTempPass()
          && api.secretOperator.secret.includes(item)
      ));

    // -> ES: return all metadata except passwords
    req.status.addExecStatus();
    res.send({
      ...req.status.generateReport(),
      full: !req.status.authTempPass(),
      secret: req.status.authTempPass() ? [] : api.secretOperator.secret,
      public: publicFolder,
      private: privateFolder,
      metadata: api.configOperator.getMetadata(),
      clipboard: api.configOperator.config.clipboard,
      setting: api.configOperator.config.setting,
      saltWarning: api.saltOperator.getSelfCheck()
    });
    return;
  }
});

router.post('/init', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.NotInit) {
      const { password, language } = req.body;
      api.configOperator.savePassword(password);
      api.configOperator.setConfigSetting("meta.language", language);
      api.tokenOperator.addNewSession(res);

      const publicFolder = api.fileOperator.readFoldersList(api.dataPath.publicDirPath);
      const privateFolder = api.fileOperator.readFoldersList(api.dataPath.privateDirPath);

      // -> ES: return all metadata
      req.status.addExecStatus();
      res.send({
        ...req.status.generateReport(),
        full: true,
        secret: api.secretOperator.secret,
        public: publicFolder,
        private: privateFolder,
        metadata: api.configOperator.getMetadata(),
        clipboard: api.configOperator.config.clipboard,
        setting: api.configOperator.config.setting,
        saltWarning: api.saltOperator.getSelfCheck()
      });
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
      const full = api.configOperator.verifyPassword(password);
      if (full || api.configOperator.verifyConfigPasscode(password)) {
        req.status.addAuthStatus(undefined, !full);
        // public is neccesarry because files starts with dot are hidden
        const publicFolder = api.fileOperator.readFoldersList(api.dataPath.publicDirPath);
        const privateFolder = api.fileOperator.readFoldersList(api.dataPath.privateDirPath)
          .filter((item) => !(
            req.status.authTempPass()
              && api.secretOperator.secret.includes(item)
          ));
        api.tokenOperator.addNewSession(res, full);

        // -> ES: return private folders list and clipboard
        req.status.addExecStatus();
        res.send({
          ...req.status.generateReport(),
          full: !req.status.authTempPass(),
          secret: req.status.authTempPass() ? [] : api.secretOperator.secret,
          public: publicFolder,
          private: privateFolder,
          metadata: api.configOperator.getMetadata(),
          clipboard: api.configOperator.config.clipboard,
          setting: api.configOperator.config.setting,
          saltWarning: api.saltOperator.getSelfCheck()
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

router.post('/code', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> AF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  if (req.status.authTempPass()) {
    // -> EF_PD: temporary authorization is not allowed
    req.status.addExecStatus(api.Status.execErrCode.PermissionDenied);
    res.send(req.status.generateReport());
    return;
  }

  const passcode = api.configOperator.addConfigPasscode();

  // -> ES: return generated passcode
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    passcode: passcode
  });
  return;
});

router.post('/reset', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> AF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  if (req.status.authTempPass()) {
    // -> EF_PD: temporary authorization is not allowed
    req.status.addExecStatus(api.Status.execErrCode.PermissionDenied);
    res.send(req.status.generateReport());
    return;
  }

  const { password } = req.body;
  assert(password.length > 0);
  api.configOperator.savePassword(password);

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

router.post('/logout', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> AF_IT or abnormal request
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
