'use strict';

var db = require('../lib/database');
var template = require('../lib/template');

function renderIndex(req, res) {

  db.getDataFromDb(function returnResponse(dbResponse) {
    var temp = '--';
    var hum = '--';

    if (dbResponse.fatal) {
      console.log(dbResponse);
    }

    if (!dbResponse.fatal) {
      temp = dbResponse[0].temp;
      hum = dbResponse[0].hum;
    }

    res.render('index',
      { title: 'Temperature',
        temp: temp,
        hum: hum,
        template: template.getTemplate(req)
      }
    );
  });
}

function renderGraph(req, res) {

  db.getTempHumGraph(function returnResponse(dbResponse) {

    var history = [];
    var i = 0;

    dbResponse.forEach(function filterRecords(record) {
      if (i < 10 || i === 0) {
        i ++;
      } else {
        i = 1;
        var filteredRecord = {};
        filteredRecord.id = record.id;
        filteredRecord.temp = record.temp.replace(/,/g, '.');
        filteredRecord.hum = record.hum.replace(/,/g, '.');
        filteredRecord.recordDate = record.recordDate;
        history.push(filteredRecord);
      }
    });

    res.render('graph', {
      title: 'Hey',
      humHistory: history,
      template: template.getTemplate(req)
    });
  });
}

module.exports = {
  graph: renderGraph,
  index: renderIndex
};