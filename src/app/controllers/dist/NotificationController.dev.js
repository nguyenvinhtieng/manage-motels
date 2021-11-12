"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('../../utils/mongoose'),
    mongooseToObject = _require.mongooseToObject;

var Notification = require('../models/Notification.js');

var NotificationController =
/*#__PURE__*/
function () {
  function NotificationController() {
    _classCallCheck(this, NotificationController);
  }

  _createClass(NotificationController, [{
    key: "create",
    value: function create(req, res, next) {
      var notification = new Notification(req.body);
      notification.save().then(function (data) {
        return res.json({
          status: true,
          message: "Create notification successfully",
          data: data
        });
      })["catch"](function (err) {
        return res.json({
          status: false,
          message: "Has error please try again later"
        });
      });
    }
  }, {
    key: "getData",
    value: function getData(req, res, next) {
      Notification.find({}).sort('-createdAt').exec(function (err, data) {
        if (err) return res.json({
          status: false
        });
        return res.json({
          status: true,
          data: data
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete(req, res, next) {
      Notification.deleteOne({
        _id: req.body._id
      }).then(function (data) {
        return res.json({
          status: true,
          message: "Delete notification successfully"
        });
      })["catch"](function (err) {
        return res.json({
          status: false,
          message: "Delete notification failed"
        });
      });
    }
  }, {
    key: "viewNotification",
    value: function viewNotification(req, res, next) {
      var id = req.params.id;
      Notification.findOne({
        _id: id
      }).then(function (data) {
        if (data) {
          res.render('./admin/detailnotification', {
            data: mongooseToObject(data)
          });
        } else {
          res.redirect('/admin/notifications');
        }
      })["catch"](function (err) {
        res.redirect('/admin/notifications');
      });
    }
  }]);

  return NotificationController;
}();

module.exports = new NotificationController();