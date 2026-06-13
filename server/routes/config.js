let express = require('express');
let api = require('../api');
let router = express.Router();

router.post('/set', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { key, value } = req.body;
  if (!api.configOperator.hasKey(api.configOperator.config.setting, key)) {
    // -> EF_RU: key doesn't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (!api.configOperator.checkKey(api.configOperator.config.setting, key, value)) {
    // -> EF_TC: type check failed
    req.status.addExecStatus(api.Status.execErrCode.TypeCheckFailed);
    res.send(req.status.generateReport());
    return;
  }

  api.configOperator.setConfigSetting(key, value);

  // terminal hint only show once
  if (key == "terminal.enable") {
    api.configOperator.setConfigMetadata("terminal", true);
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

router.post('/reset', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  // deep copy for setting
  api.configOperator.setConfig((config) => ({
    ...config,
    setting: JSON.parse(JSON.stringify(api.defaultConfig.setting))
  }));

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

router.get('/copy', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    setting: api.configOperator.config.setting
  });
  return;
});

module.exports = router;
