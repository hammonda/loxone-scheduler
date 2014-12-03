var fs       = require('fs');
var schedule = require('node-schedule');
var _        = require('underscore');

module.exports = function (home, config_path) {
  var config = JSON.parse(String(fs.readFileSync(config_path)));
  _.each(config.rules, function (r) {
    var rule = new schedule.RecurrenceRule();
    _.each(r.options, function (value, key) {
      rule[key] = value;
    });
    var s = home.light_switch[r.light_switch];
    schedule.scheduleJob(rule, s[r.method].bind(s));
  });
};
