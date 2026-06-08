let os = require('os');
let express = require('express');
let api = require('../api');
let router = express.Router();

router.get('/version', (req, res, next) => {
  // -> ES: return version
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

  // error in api.cachedInfo will be thown immediately on start
  api.cachedInfo.then((osInfo) => {
    // -> ES: return os info
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
      // -> ES: return stat history
      req.status.addExecStatus();
      res.send({
        ...req.status.generateReport(),
        history: api.infoOperator.laterThan(time),
        process: ps
      });
      return;
    })
    .catch((err) => {
      // EF_ISE: unkown internal error
      next(err);
      return;
    });
});

module.exports = router;
