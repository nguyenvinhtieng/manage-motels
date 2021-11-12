"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var jwt = require('jsonwebtoken');

var Account = require('../models/Account.js');

var Device = require('../models/Device.js');

var _require = require('../../utils/mongoose'),
    multipleMongooseToObject = _require.multipleMongooseToObject;

var TOKEN_KEY = 'AmkshOnmshGndksmHg';

var MainController =
/*#__PURE__*/
function () {
  function MainController() {
    _classCallCheck(this, MainController);
  }

  _createClass(MainController, [{
    key: "renderHome",
    // GET '/admin/home'
    value: function renderHome(req, res, next) {
      res.render('./admin/home');
    } // GET '/admin/room

  }, {
    key: "renderRoom",
    value: function renderRoom(req, res, next) {
      res.render('./admin/room');
    } // GET '/admin/devices

  }, {
    key: "renderDevice",
    value: function renderDevice(req, res, next) {
      Device.find().then(function (data) {
        res.render('./admin/device', {
          data: multipleMongooseToObject(data)
        });
      })["catch"](function (err) {
        console.log(err);
      });
    } // GET '/admin/account

  }, {
    key: "renderAccount",
    value: function renderAccount(req, res, next) {
      res.render('./admin/account');
    }
  }, {
    key: "renderCustomers",
    value: function renderCustomers(req, res, next) {
      res.render('./admin/customer');
    }
  }, {
    key: "renderNotifications",
    value: function renderNotifications(req, res, next) {
      res.render('./admin/notification');
    }
  }]);

  return MainController;
}();

module.exports = new MainController();