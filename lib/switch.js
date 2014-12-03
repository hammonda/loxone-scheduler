var async   = require('async');
var request = require('request');
var util    = require('util');
var _       = require('underscore');

function Switch (base_url, uid, switch_uid) {
  this.retry = 5;
  this.state_url = util.format('%s%s/state', base_url, uid);
  this.switch_url = util.format('%s%s/Pulse', base_url, switch_uid);
}

Switch.prototype.get_state = function (callback) {
  __request_url(this.state_url, this.retry, __parse_callback.bind(callback));
};

Switch.prototype.pulse = function (callback) {
  __request_url(this.switch_url, this.retry, __parse_callback.bind(callback));
};

Switch.prototype.switch_on = function (callback) {
  this.get_state(function (err, result) {
    if (!err && result && result.value == 0) {
      this.pulse(callback);
    } else {
      if (_.isFunction(callback))
        callback();
    }
  }.bind(this));
};

Switch.prototype.switch_off = function (callback) {
  this.get_state(function (err, result) {
    if (!err && result && result.value != 0) {
      this.pulse(callback);
    } else {
      if (_.isFunction(callback))
        callback();
    }
  }.bind(this));
};

var __request_url = function (url, retry, callback) {
  var __error = null;
  var __body = null;
  var __try = 0;
  async.doUntil(function (cb) {
    __try = __try + 1;
    console.log(__try + ':' + url);
    request(url, function (error, response, body) {
      __error = error;
      if (!__error)
        __body = body;
      cb();
    });
  }, function () {
    return __try == retry || __error == null;
  }, function () {
    callback(__error, __body);
  });
};

var __parse_callback = function (error, body) {
  if (body) {
    var exec = /value="(\d+)%?"\s*Code="(\d+)"/.exec(body);
    if (exec) {
      body = {
        value: Number(exec[1]),
        code: Number(exec[2])
      };
    }
  }
  if (_.isFunction(this))
    this(error, body);
};

module.exports = Switch;
