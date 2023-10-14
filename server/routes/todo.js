let express = require('express');
let api = require('../api');
let router = express.Router();

router.get('/list', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const task = api.taskOperator.accessTask();

  // -> ES: return tasks info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    task: task
  });
  return;
});

router.post('/new', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { name, description, type, dueTime } = req.body;
  permanantCheck = type === 'permanant' && dueTime === null;
  timelinessCheck = ['async', 'sync'].includes(type) && typeof dueTime === 'number' && dueTime > Date.now();
  if (!permanantCheck && !timelinessCheck) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { id, createTime } = api.taskOperator.addTask(name, description, type, dueTime);

  // -> ES: return new task info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    createTime: createTime,
    id: id
  });
  return;
});

router.post('/tick', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { id, createTime } = req.body;
  if (!api.taskOperator.__findTask(id, createTime)) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }

  api.taskOperator.tickTask(id, createTime);

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

router.post('/untick', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { id, createTime } = req.body;
  if (!api.taskOperator.__findTask(id, createTime)) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }

  api.taskOperator.untickTask(id, createTime);

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

router.post('/edit', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { id, createTime } = req.body;
  if (!api.taskOperator.__findTask(id, createTime)) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { name, description, type, dueTime } = req.body;
  permanantCheck = type === 'permanant' && dueTime === null;
  timelinessCheck = ['async', 'sync'].includes(type) && typeof dueTime === 'number' && dueTime > Date.now();
  if (!permanantCheck && !timelinessCheck) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }

  api.taskOperator.editTask(id, createTime, name, description, type, dueTime);

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

router.post('/delete', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { id, createTime } = req.body;
  if (!api.taskOperator.__findTask(id, createTime)) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }

  api.taskOperator.deleteTask(id, createTime);

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

module.exports = router;
