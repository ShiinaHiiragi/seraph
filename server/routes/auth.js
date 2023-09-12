let express = require('express');
let api = require('../api');

let router = express.Router();

router.get('/meta', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.NotInit) {
      // -> the ONLY place that return (AF, NI)
      next(api.errorStreamControl);
      return;
    } else {
      const publicFolder = api.fileOperator.readFolder(api.dataPath.publicDirPath);

      // -> return (ES) and publicly available metadata
      req.status.addExecStatus();
      res.send({
        ...req.status.generateReport(),
        public: publicFolder,
        setting: api.configOperator.config.setting
      })
      return;
    }
  } else {
    const publicFolder = api.fileOperator.readFolder(api.dataPath.publicDirPath);
    const privateFolder = api.fileOperator.readFolder(api.dataPath.privateDirPath);

    // -> return (ES) and all metadata
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

      // return (ES)
      req.status.addExecStatus();
      res.send(req.status.generateReport());
      return;
    }
  }

  // abnormal request
  next(api.errorStreamControl);
  return;
});

router.post('/login', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.InvalidToken) {
      const { password } = req.body;


    }
  }

  // abnormal request
  next(api.errorStreamControl);
  return;
});

module.exports = router;
