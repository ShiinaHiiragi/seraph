let express = require('express');
let api = require('../api');
let router = express.Router();

router.post('/upload', (req, res, next) => {
  res.send('/upload');
});

router.post('/rename', (req, res, next) => {
  res.send('/rename');
});

router.post('/move', (req, res, next) => {
  res.send('/move');
});

router.post('/delete', (req, res, next) => {
  res.send('/delete');
});

module.exports = router;
