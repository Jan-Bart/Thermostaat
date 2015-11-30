'use strict';

var express = require('express');
var alarm = require('../controllers/alarm');
var thermostaat = require('../controllers/thermostaat');

module.exports = function exportRouter(app) {

  var router = new express.Router();

  router.route('/')
    .get(thermostaat.index);

  router.route('/graph')
    .get(thermostaat.graph);

  router.route('/alarm')
    .get(alarm.index);

  app.use('/', router);
};
