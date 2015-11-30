'use strict';

function getTemplate(req) {
  var template = '';
  if (req.cookies && req.cookies.template) {
    template = req.cookies.template;
  }

  return template;
}

var months = ['jan', 'feb', 'maart', 'april', 'mei', 'juni', 'juli', 'aug', 'sept', 'okt', 'nov', 'dec'];

module.exports = {
  getTemplate: getTemplate,
  months: months
};