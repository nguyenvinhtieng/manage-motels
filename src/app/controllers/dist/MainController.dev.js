"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var jwt = require('jsonwebtoken');

var bcrypt = require("bcrypt");

var Account = require('../models/Account.js');

var TOKEN_KEY = 'AmkshOnmshGndksmHg';

var MainController =
/*#__PURE__*/
function () {
  function MainController() {
    _classCallCheck(this, MainController);
  }

  _createClass(MainController, [{
    key: "renderLogin",
    // GET '/login'
    value: function renderLogin(req, res, next) {
      res.render('login');
    }
  }, {
    key: "pageNotFound",
    value: function pageNotFound(req, res, next) {
      res.send('Page not found, please check yout url or <a href="/login"> click here</a> to login');
    } //POST '/login'

  }, {
    key: "login",
    value: function login(req, res, next) {
      var user, validPassword, token;
      return regeneratorRuntime.async(function login$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(Account.findOne({
                username: req.body.username
              }));

            case 2:
              user = _context.sent;

              if (!user) {
                _context.next = 15;
                break;
              }

              _context.next = 6;
              return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, user.password));

            case 6:
              validPassword = _context.sent;

              if (!validPassword) {
                _context.next = 12;
                break;
              }

              token = jwt.sign({
                _id: user._id
              }, TOKEN_KEY);
              return _context.abrupt("return", res.json({
                role: user.role,
                token: token
              }));

            case 12:
              return _context.abrupt("return", res.json(null));

            case 13:
              _context.next = 16;
              break;

            case 15:
              return _context.abrupt("return", res.json(null));

            case 16:
            case "end":
              return _context.stop();
          }
        }
      });
    } // Middleware

  }, {
    key: "isLogin",
    value: function isLogin(req, res, next) {
      try {
        if (jwt) {
          var token = req.cookies.token;
          var decodedCookie = jwt.verify(token, TOKEN_KEY);
          var idUser = decodedCookie._id;
          Account.findOne({
            _id: idUser
          }).then(function (data) {
            if (data) {
              next();
            }
          });
        } else {
          res.redirect('/login');
        }
      } catch (err) {
        console.log(err);
        res.redirect('/login');
      }
    }
  }, {
    key: "isAdmin",
    value: function isAdmin(req, res, next) {
      try {
        var token = req.cookies.token;
        var decodedCookie = jwt.verify(token, TOKEN_KEY);
        var idUser = decodedCookie._id;
        Account.findOne({
          _id: idUser
        }).then(function (data) {
          if (data.role === 'admin') {
            next();
          } else {
            res.redirect('/login');
          }
        })["catch"](function (err) {
          res.redirect('/login');
        });
      } catch (err) {
        res.redirect('/login');
      }
    }
  }]);

  return MainController;
}();

module.exports = new MainController();