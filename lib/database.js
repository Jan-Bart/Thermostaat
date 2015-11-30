'use strict';

var db = require('node-mysql');
var cps = require('cps');
var DB = db.DB;
var fs = require('fs');
var configurationFile = 'config.json';
var configuration = JSON.parse(
  fs.readFileSync(configurationFile)
);

var box = new DB({
  host: configuration.host,
  user: configuration.username,
  password: configuration.password,
  database: configuration.database
});

function getDataFromDb(callback) {
  box.connect(function createConnection(conn, cb) {
    cps.seq([
      function createQuery(_, callback1) {
        conn.query('SELECT id, recordDate, temp, hum FROM th_values ORDER BY id DESC LIMIT 1', callback1);
      },
      function returnResponse(dbResponse, callback2) {
        callback2(dbResponse);
      }
    ], cb);
  }, callback);
}

function getTempHumGraphData(callback) {
  box.connect(function createConnection(conn, cb) {
    cps.seq([
      function createQuery(_, callback1) {
        conn.query('SELECT id, recordDate, temp, hum FROM th_values ORDER BY recordDate DESC LIMIT 2000', callback1);
      },
      function returnResponse(dbResponse, callback2) {
        callback2(dbResponse);
      }
    ], cb);
  }, callback);
}

function getLastAlarm(callback) {
  box.connect(function createConnection(conn, cb) {
    cps.seq([
      function createQuery(_, callback1) {
        conn.query('SELECT id, recordDate, alarm FROM th_alarm WHERE alarm = 1 ORDER BY id DESC LIMIT 1', callback1);
      },
      function returnResponse(dbResponse, callback2) {
        callback2(dbResponse);
      }
    ], cb);
  }, callback);
}

var getAlarmData = function(callback) {
  box.connect(function(conn, cb) {
    cps.seq([
      function(_, callback1) {
        conn.query('SELECT id, recordDate, alarm FROM th_alarm ORDER BY id DESC LIMIT 1', callback1);
      },
      function(dbResponse, callback2) {
        callback2(dbResponse);
      }
    ], cb);
  }, callback);
};

module.exports = {
  getDataFromDb: getDataFromDb,
  getLastAlarm: getLastAlarm,
  getTempHumGraph: getTempHumGraphData,
  getAlarmData: getAlarmData
};