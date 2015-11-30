'use strict';

var db = require('../lib/database');
var template = require('../lib/template');

function renderAlarmIndex(req, res) {

  db.getLastAlarm(function returnResponse(dbResponse) {
    var lastAlarmDate = '--';
    var lastAlarmTime = '--';
    if (dbResponse.fatal) {
      console.log(dbResponse);
    }

    if (!dbResponse.fatal) {
      lastAlarmDate =
        ('0' + dbResponse[0].recordDate.getDate()).slice(-2) + ' ' +
        template.months[dbResponse[0].recordDate.getMonth()] + ' ' +
        dbResponse[0].recordDate.getFullYear();

      lastAlarmTime =
        ('0' + dbResponse[0].recordDate.getHours()).slice(-2) + ':' +
        ('0' + dbResponse[0].recordDate.getMinutes()).slice(-2);

    }

    res.render('alarm', {
      title: 'alarm',
      template: template.getTemplate(req),
      lastAlarmDate: lastAlarmDate,
      lastAlarmTime: lastAlarmTime
    });
  });
}

module.exports = {
  index: renderAlarmIndex
};