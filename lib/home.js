var fs     = require('fs');
var util   = require('util');
var _      = require('underscore');
var Switch = require('./switch.js');

module.exports = function (username, password, config_path) {
  var config = JSON.parse(String(fs.readFileSync(config_path)));
  var base_url = util.format('http://%s:%s@%s/dev/sps/io/',
        username, password, config.miniserver.url);
  var home = {
    light_switch: { }
  };
  _.each(config.light_switch, function (value, key) {
    home.light_switch[key] = new Switch(base_url, value[0], value[1]);
  });

  return home;
};
