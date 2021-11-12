"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Device = require('../models/Device.js');

var DeviceInRoom = require('../models/DeviceInRoom.js');

var _require = require('../../utils/mongoose'),
    mongooseToObject = _require.mongooseToObject;

var DeviceController =
/*#__PURE__*/
function () {
  function DeviceController() {
    _classCallCheck(this, DeviceController);
  }

  _createClass(DeviceController, [{
    key: "addDevice",
    // POST '/device/add
    value: function addDevice(req, res, next) {
      var formData = _objectSpread({}, req.body);

      var device = new Device(formData);
      device.save().then(function (data) {
        return res.json({
          data: mongooseToObject(data)
        });
      })["catch"](next);
    } // POST '/device/getData

  }, {
    key: "getData",
    value: function getData(req, res, next) {
      Device.findOne({
        _id: req.body.id
      }).then(function (data) {
        if (data) return res.json(data);else return res.json(null);
      })["catch"](function (err) {
        return res.json(null);
      });
    } // PUT '/device/update

  }, {
    key: "update",
    value: function update(req, res, next) {
      Device.findOne({
        _id: req.body.id
      }).then(function (data) {
        if (data) {
          Device.updateOne({
            _id: req.body.id
          }, req.body).then(function () {
            return res.json({
              status: true
            });
          })["catch"](next);
        } else {
          return res.json({
            status: false
          });
        }
      })["catch"](function (err) {
        return res.json({
          status: false
        });
      });
    } //DELETE '/device/delete

  }, {
    key: "delete",
    value: function _delete(req, res, next) {
      Device.deleteOne({
        _id: req.body.id
      }).then(function (data) {
        if (data.deletedCount === 1) return res.json({
          status: true,
          message: "Delete device successfully"
        });else return res.json({
          status: false,
          message: "Nothing to delete, Please do not edit this page"
        });
      })["catch"](function (err) {
        console.log(err);
      }); //console.log(req.body);
    }
  }, {
    key: "canDelete",
    value: function canDelete(req, res, next) {
      DeviceInRoom.find({
        iddevice: req.body.id
      }).then(function (data) {
        if (data.length > 0) {
          return res.json({
            status: false,
            message: "Can not delete this device because was use by room"
          });
        } else {
          next();
        }
      })["catch"](function (err) {
        return res.json({
          status: false,
          message: "Has error when trying to delete this device"
        });
      });
    } // GET '/device/getDevices

  }, {
    key: "getDevices",
    value: function getDevices(req, res, next) {
      Device.find().then(function (data) {
        return res.json(data);
      });
    }
  }]);

  return DeviceController;
}();

module.exports = new DeviceController();