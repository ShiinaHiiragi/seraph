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
  permanentCheck = type === 'permanent' && dueTime === null;
  timelinessCheck = ['async', 'sync'].includes(type) && typeof dueTime === 'number';
  if (!permanentCheck && !timelinessCheck) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }

  const info = api.taskOperator.addTask(name, description, type, dueTime);

  // -> ES: return new task info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    ...info
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
  const target_index = api.taskOperator.findTask(id, createTime);
  if (target_index === -1) {
    // -> EF_RU: task don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (api.taskOperator.task[target_index].deleteTime !== null) {
    // -> EF_DR: too many clicks
    req.status.addExecStatus(api.Status.execErrCode.DuplicateRequest);
    res.send(req.status.generateReport());
    return;
  }

  const task = api.taskOperator.tickTask(target_index);

  // -> ES: return deleteTime
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    type: task.type,
    deleteTime: task.deleteTime,
  });
  return;
});

router.post('/untick', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { id, createTime } = req.body;
  const target_index = api.taskOperator.findTask(id, createTime);
  if (target_index === -1) {
    // -> EF_RU: task don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  if (api.taskOperator.task[target_index].deleteTime === null) {
    // -> EF_DR: too many clicks
    req.status.addExecStatus(api.Status.execErrCode.DuplicateRequest);
    res.send(req.status.generateReport());
    return;
  }

  api.taskOperator.untickTask(target_index);

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
  const target_index = api.taskOperator.findTask(id, createTime);
  if (target_index === -1) {
    // -> EF_RU: task don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  const { name, description, type, dueTime } = req.body;
  permanentCheck = type === 'permanent' && dueTime === null;
  timelinessCheck = ['async', 'sync'].includes(type) && typeof dueTime === 'number';
  if (!permanentCheck && !timelinessCheck) {
    // -> abnormal request
    next(api.errorStreamControl);
    return;
  }

  const task = api.taskOperator.editTask(target_index, name, description, type, dueTime);

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send({
    ...req.status.generateReport(),
    deleteTime: task.deleteTime
  });
  return;
});

router.post('/delete', (req, res, next) => {
  if (req.status.notAuthSuccess()) {
    // -> EF_IT or abnormal request
    next(api.errorStreamControl);
    return;
  }

  const { id, createTime } = req.body;
  const target_index = api.taskOperator.findTask(id, createTime);
  if (target_index === -1) {
    // -> EF_RU: task don't exist
    req.status.addExecStatus(api.Status.execErrCode.ResourcesUnexist);
    res.send(req.status.generateReport());
    return;
  }

  api.taskOperator.deleteTask(target_index);

  // -> ES: no extra info
  req.status.addExecStatus();
  res.send(req.status.generateReport());
  return;
});

module.exports = router;
