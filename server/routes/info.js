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
        ...api.infoOperator.osInfo(),
        storage: size
      });
      return;
    });
});

router.get('/stat', (req, res, next) => {
  const cpu = Number(req.query.cpu);
  const net = Number(req.query.net);

  api.infoOperator.diskUsage()
    .then(({ free }) => {
      req.status.addExecStatus();
      res.send({
        ...req.status.generateReport(),
        memory: api.infoOperator.memoryUsage(),
        storage: free,
        cpu: api.infoOperator.cpuLaterThan(cpu),
        net: api.infoOperator.netLaterThan(net)
      });
      return;
    });
});

module.exports = router;
