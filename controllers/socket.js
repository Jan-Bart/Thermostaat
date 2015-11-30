'use strict';

var db = require('../lib/database');
var template = require('../lib/template');

function refreshHumTemp(req, res, io) {
  db.getDataFromDb(function returnResponse(dbResponse) {

    var result = {};
    result.temp = '--';
    result.hum = '--';
    result.date = '--';

    if (dbResponse.fatal) {
      console.log(dbResponse);
    }

    if (!dbResponse.fatal) {
      result.temp = dbResponse[0].temp;
      result.hum = dbResponse[0].hum;
      result.date = dbResponse[0].recordDate;
    }

    io.sockets.emit('server-change', {temp: result.temp, hum: result.hum});
    res.json(result);
  });
}

function refreshAlarm(req, res, io) {
  db.getAlarmData(function returnResponse(dbResponse) {
    var result = {};
    result.alarm = dbResponse[0].alarm;
    var alarmDate = new Date(dbResponse[0].recordDate);

    result.lastAlarmDate = ('0' + alarmDate.getDate()).slice(-2) + ' ' +
      template.months[alarmDate.getMonth()] + ' ' +
      alarmDate.getFullYear();

    result.lastAlarmTime =
      ('0' + alarmDate.getHours()).slice(-2) + ':' +
      ('0' + alarmDate.getMinutes()).slice(-2);

    io.sockets.emit('alarm-change', {alarm: result.alarm, lastAlarmDate: result.lastAlarmDate, lastAlarmTime: result.lastAlarmTime});
    res.json(result);
  });
}

module.exports = {
  refresh: refreshHumTemp,
  refreshAlarm: refreshAlarm
};