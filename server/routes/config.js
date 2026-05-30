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

  api.configOperator.setConfigSetting(key, value)

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

module.exports = router;
