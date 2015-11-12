'use strict';

var db = require('node-mysql');
var cps = require('cps');
var DB = db.DB;
var BaseRow = db.Row;
var BaseTable = db.Table;
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

function getTemplate(req) {
  var template = '';
  if (req.cookies && req.cookies.template) {
    template = req.cookies.template;
  }

  return template;
}

var getDataFromDb = function(cb) {
  box.connect(function(conn, cb) {
      cps.seq([
          function(_, cb) {
              conn.query('SELECT id, recordDate, temp, hum FROM th_values ORDER BY id DESC LIMIT 1', cb);
          },
          function(dbResponse, cb) {
              cb(dbResponse);
          }
      ], cb);
  }, cb);
};

var getAlarmData = function(cb) {
  box.connect(function(conn, cb) {
    cps.seq([
      function(_, cb) {
        conn.query('SELECT id, recordDate, alarm FROM th_alarm ORDER BY id DESC LIMIT 1', cb);
      },
      function(dbResponse, cb) {
        cb(dbResponse);
      }
    ], cb);
  }, cb);
};

var getLastAlarm = function (cb) {
  box.connect(function(conn, cb) {
    cps.seq([
      function(_, cb) {
        conn.query('SELECT id, recordDate, alarm FROM th_alarm WHERE alarm = 1 ORDER BY id DESC LIMIT 1', cb);
      },
      function(dbResponse, cb) {
        cb(dbResponse);
      }
    ], cb);
  }, cb);
};

exports.index = function (req, res) {

  getDataFromDb(function(dbResponse){
    res.render('index', {
      title: 'Hey',
      message: 'Hello there!',
      temp: dbResponse[0].temp,
      hum: dbResponse[0].hum,
      template: getTemplate(req) });
    });

};

exports.refresh = function (req, res, io) {
  getDataFromDb(function(dbResponse){

    var result = {};
    result.temp = dbResponse[0].temp;
    result.hum = dbResponse[0].hum;
    result.date = dbResponse[0].recordDate;
    io.sockets.emit('server-change', {temp: result.temp, hum: result.hum});
    res.json(result);

  });
};

exports.graph = function (req, res) {

  var getDataFromDb = function(cb) {
    box.connect(function(conn, cb) {
        cps.seq([
            function(_, cb) {
                conn.query('SELECT id, recordDate, temp, hum FROM th_values ORDER BY recordDate DESC LIMIT 2000', cb);
            },
            function(dbResponse, cb) {
                cb(dbResponse);
            }
        ], cb);
    }, cb);
  };

  getDataFromDb(function(dbResponse){

    var history = [];
    var i = 0;

    dbResponse.forEach(function(record){
      if(i < 10 || i === 0) {
        i ++;
      } else {
        i = 1;
        var filteredRecord = {};
        filteredRecord.id = record.id;
        filteredRecord.temp = record.temp.replace(/,/g,'.');
        filteredRecord.hum = record.hum.replace(/,/g,'.');
        filteredRecord.recordDate = record.recordDate;
        history.push(filteredRecord);
      }
    });

    res.render('graph', {
      title: 'Hey',
      humHistory: history,
      template: getTemplate(req)
    });

});
};

exports.refreshAlarm = function (req, res, io) {
  getAlarmData(function(dbResponse){
    var result = {};
    result.alarm = dbResponse[0].alarm;
    result.date = dbResponse[0].recordDate;
    io.sockets.emit('alarm-change', {alarm: result.alarm, date: result.date});
    res.json(result);

  });
};

exports.alarm = function (req, res) {

  getLastAlarm(function (dbResponse) {

    var months = ['jan', 'feb', 'maart', 'april', 'mei', 'juni', 'juli', 'aug', 'sept', 'okt', 'nov', 'dec'];

    var lastAlarmDate =
      ('0' + dbResponse[0].recordDate.getDate()).slice(-2) + ' ' +
      months[dbResponse[0].recordDate.getMonth()] + ' ' +
      dbResponse[0].recordDate.getFullYear();

    var lastAlarmTime =
      ('0' + dbResponse[0].recordDate.getHours()).slice(-2) + ':' +
      ('0' + dbResponse[0].recordDate.getMinutes()).slice(-2);

    res.render('alarm', {
      title: 'alarm',
      template: getTemplate(req),
      lastAlarmDate: lastAlarmDate,
      lastAlarmTime: lastAlarmTime
    });
  });
};