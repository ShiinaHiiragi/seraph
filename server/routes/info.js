let express = require('express');
let api = require('../api');
let router = express.Router();

router.get('/version', (req, res, next) => {
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    version: api.version()
  });
  return;
});

router.get('/os', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  api.diskUsageAsync()
    .then(({ size }) => {
      req.status.addExecStatus();
      res.send({
        ...req.status.generateReport(),
        os: {
          ...api.osInfo(),
          storage: size
        }
      });
      return;
    });
});

router.get('/free', (req, res, next) => {
  api.diskUsageAsync()
    .then(({ free }) => {
      req.status.addExecStatus();
      res.send({
        ...req.status.generateReport(),
        memory: api.free(),
        storage: free
      });
      return;
    });
});

module.exports = router;
