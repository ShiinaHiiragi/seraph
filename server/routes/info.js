let os = require('os');
let express = require('express');
let api = require('../api');
let router = express.Router();

router.get('/version', (req, res, next) => {
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    version: api.infoOperator.version()
  });
  return;
});

router.get('/os', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  api.cachedInfo.then((osInfo) => {
    req.status.addExecStatus();
    res.send({
      ...req.status.generateReport(),
      ...osInfo,
      uptime: os.uptime()
    });
    return;
  });
});

router.get('/stat', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const time = Number(req.query.after);
  api.infoOperator.processList(
    api.configOperator.config.setting.welcome.process.sortBy,
    api.configOperator.config.setting.welcome.process.count,
  )
    .then((ps) => {
      req.status.addExecStatus();
      res.send({
        ...req.status.generateReport(),
        history: api.infoOperator.laterThan(time),
        process: ps
      });
      return;
    });
});

module.exports = router;
