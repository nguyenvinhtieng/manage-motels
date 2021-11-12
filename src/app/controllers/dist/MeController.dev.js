"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Customer = require('../models/Customer.js');

var DeviceInRoom = require('../models/DeviceInRoom.js');

var Device = require('../models/Device.js');

var Room = require('../models/Room.js');

var jwt = require('jsonwebtoken');

var Account = require('../models/Account.js');

var _require = require('../../utils/mongoose'),
    multipleMongooseToObject = _require.multipleMongooseToObject,
    mongooseToObject = _require.mongooseToObject;

var TOKEN_KEY = 'AmkshOnmshGndksmHg';

var Notification = require('../models/Notification.js');

var MeController =
/*#__PURE__*/
function () {
  function MeController() {
    _classCallCheck(this, MeController);
  }

  _createClass(MeController, [{
    key: "renderHome",
    value: function renderHome(req, res, next) {
      res.render('me/home');
    }
  }, {
    key: "renderMyInfor",
    value: function renderMyInfor(req, res, next) {
      res.render('me/myinfor');
    }
  }, {
    key: "getDataMyRoom",
    value: function getDataMyRoom(req, res, next) {
      var token = req.cookies.token;
      var decodedCookie = jwt.verify(token, TOKEN_KEY);
      var idUser = decodedCookie._id;
      Account.findOne({
        _id: idUser
      }).then(function (account) {
        Customer.find({
          roomid: account.roomid,
          leaveday: ''
        }).then(function (data) {
          return res.json(data);
        });
      });
    }
  }, {
    key: "renderRoom",
    value: function renderRoom(req, res, next) {
      var token = req.cookies.token;
      var decodedCookie = jwt.verify(token, TOKEN_KEY);
      var idUser = decodedCookie._id;
      Account.findOne({
        _id: idUser
      }).then(function (account) {
        Room.findOne({
          _id: account.roomid
        }).then(function (data) {
          res.render('me/myroom', {
            data: {
              number: data.number,
              renter: data.renter,
              numberpeople: data.numberpeople,
              area: data.area,
              price: data.price,
              description: data.description
            }
          });
        });
      });
    }
  }, {
    key: "getDeviceInRoom",
    value: function getDeviceInRoom(req, res, next) {
      var token = req.cookies.token;
      var decodedCookie = jwt.verify(token, TOKEN_KEY);
      var idUser = decodedCookie._id;
      Account.findOne({
        _id: idUser
      }).then(function (account) {
        DeviceInRoom.find({
          idroom: account.roomid
        }).then(function (data) {
          var idDevice = [];
          data.forEach(function (item) {
            idDevice.push(item.iddevice);
          });
          Device.find({
            _id: {
              $in: idDevice
            }
          }).then(function (data) {
            return res.json(data);
          });
        });
      });
    }
  }, {
    key: "renderNotifications",
    value: function renderNotifications(req, res, next) {
      Notification.find().sort('-createdAt').then(function (data) {
        res.render('./me/notification', {
          data: multipleMongooseToObject(data)
        });
      })["catch"](function (err) {
        res.redirect('/login');
      });
    }
  }, {
    key: "renderDetailNotification",
    value: function renderDetailNotification(req, res, next) {
      Notification.findOne({
        _id: req.params.id
      }).then(function (data) {
        res.render('./me/detailnotification', {
          data: mongooseToObject(data)
        });
      })["catch"](function (err) {
        res.redirect('/me/notification');
      });
    }
  }]);

  return MeController;
}();

module.exports = new MeController();