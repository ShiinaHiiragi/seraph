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

  api.infoOperator.diskUsage()
    .then(({ size }) => {
      req.status.addExecStatus();
      res.send({
        ...req.status.generateReport(),
        os: {
          ...api.infoOperator.osInfo(),
          storage: size
        }
      });
      return;
    });
});

router.get('/stat', (req, res, next) => {
  Promise.all([
    api.infoOperator.cpuUsage(),
    api.infoOperator.diskUsage()
  ])
    .then(([cpus, { free: storage }]) => {
      req.status.addExecStatus();
      res.send({
        ...req.status.generateReport(),
        cpus: cpus,
        memory: api.infoOperator.memoryUsage(),
        storage: storage
      });
      return;
    });
});

module.exports = router;
