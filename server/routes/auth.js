let express = require('express');
let api = require('../api');

let router = express.Router();

router.get('/meta', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.NotInit) {
      // the ONLY place that return (AF, NI)
      next(api.errorStreamControl);
      return;
    } else {
      const config = api.fileOperator.readConfig();
      const publicFolder = api.fileOperator.readFolder(api.dataPath.publicDirPath);

      // return (ES) and publicly available metadata
      req.status.addExecStatus();
      res.send({
        ...req.status.generateReport(),
        public: publicFolder,
        setting: config.setting
      })
      return;
    }
  } else {
    const config = api.fileOperator.readConfig();
    const publicFolder = api.fileOperator.readFolder(api.dataPath.publicDirPath);
    const privateFolder = api.fileOperator.readFolder(api.dataPath.privateDirPath);

    // return (ES) and all metadata
    req.status.addExecStatus();
    res.send({
      ...req.status.generateReport(),
      public: publicFolder,
      private: privateFolder,
      setting: config.setting
    })
    return;
  }
});

router.post('/init', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.NotInit) {
      const { password, language } = req.body;
      config = api.fileOperator.readConfig();
      config.metadata.password = password;
      config.setting.meta.language = language;

      if (!password.length) {
        // abnormal request
        next(api.errorStreamControl);
        return;
      }
      api.fileOperator.saveConfig(config);

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
  
});

module.exports = router;
