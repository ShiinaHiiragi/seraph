let express = require('express');
let api = require('../api');

let router = express.Router();

router.get('/meta', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.NotInit) {
      // only place that return (AF, NI)
      next(api.errorStreamControl);
    } else {
      // TODO: fill this
    }
  } else {
    // TODO: fill this
  }
});

router.post('/init', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    if (req.status.err == api.Status.authErrCode.NotInit) {
      const { language, password } = req.body;
      config = api.fileOperator.readConfig();
      config.meta.language = language;
      config.meta.password = password;
      api.fileOperator.saveConfig(config);

      req.status.addExecStatus();
      res.send(req.status.generateReport());
      return;
    }
  }
  // abnormal request
  next(api.errorStreamControl);
});

module.exports = router;
