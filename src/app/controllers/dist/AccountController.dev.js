"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var nodemailer = require('nodemailer');

var bcrypt = require("bcrypt");

var Account = require('../models/Account.js');

var Room = require('../models/Room.js');

var URL = "http://localhost:3000/login";

var jwt = require('jsonwebtoken');

var TOKEN_KEY = 'AmkshOnmshGndksmHg';

var AccountController =
/*#__PURE__*/
function () {
  function AccountController() {
    _classCallCheck(this, AccountController);
  }

  _createClass(AccountController, [{
    key: "getData",
    // GET '/account/getData'
    value: function getData(req, res, next) {
      Account.find({
        role: 'guest'
      }).then(function (data) {
        return res.json(data);
      })["catch"](function (err) {
        console.log(err);
      });
    } // POST /account/create

  }, {
    key: "isHasAccount",
    value: function isHasAccount(req, res, next) {
      Account.findOne({
        username: req.body.username
      }).then(function (data) {
        if (data) {
          return res.json({
            status: false,
            message: "Username was exitst"
          });
        } else {
          next();
        }
      })["catch"](function (err) {
        return res.json({
          status: false,
          message: "Has error, Please try again later"
        });
      });
    }
  }, {
    key: "create",
    value: function create(req, res, next) {
      var pass, defaultData, data, account, salt, email, content;
      return regeneratorRuntime.async(function create$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              pass = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
              defaultData = {
                role: "guest",
                password: pass
              };
              data = Object.assign(req.body, defaultData);
              account = new Account(data);
              _context.next = 6;
              return regeneratorRuntime.awrap(bcrypt.genSalt(10));

            case 6:
              salt = _context.sent;
              _context.next = 9;
              return regeneratorRuntime.awrap(bcrypt.hash(account.password, salt));

            case 9:
              account.password = _context.sent;
              account.save();
              email = req.body.email;
              content = "\n            <h2> Account For Your Room</h2>\n            <div> Please do not share your account with others people</p>\n            </div>Your account is</div>\n            <div>Username :".concat(req.body.username, "<br>Password :").concat(pass, " </div>\n            Information about your room: </br>\n            Room number : ").concat(req.body.roomnumber, "\n            <br><a href='").concat(URL, "'>Click here </a>to login\n        ");
              sendMail(email, content);
              return _context.abrupt("return", res.json({
                status: true,
                message: "Create account successfully"
              }));

            case 15:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "getAccount",
    value: function getAccount(req, res, next) {
      Account.findOne({
        username: req.body.username
      }).then(function (data) {
        if (data) {
          var newData = {
            username: data.username,
            roomnumber: data.roomnumber,
            roomid: data.roomid,
            email: data.email
          };
          return res.json({
            status: true,
            data: newData
          });
        } else {
          return res.json({
            status: false,
            message: "Please try again later!"
          });
        }
      })["catch"](function (err) {
        return res.json({
          status: false,
          message: "Please try again later!"
        });
      });
    } // PUT /account/update

  }, {
    key: "updateAccount",
    value: function updateAccount(req, res, next) {
      Account.updateOne({
        username: req.body.username
      }, req.body).then(function (data) {
        return res.json({
          status: true,
          message: "Account was update"
        });
      })["catch"](function (err) {
        return res.json({
          status: false,
          message: "Please try again later"
        });
      });
    } // DELETE account/delete

  }, {
    key: "deleteAccount",
    value: function deleteAccount(req, res, next) {
      Account.deleteOne({
        username: req.body.username
      }).then(function (data) {
        return res.json({
          status: true,
          message: "Account was deleted"
        });
      })["catch"](function (err) {
        return res.json({
          status: false,
          message: "Please try again later"
        });
      });
    }
  }, {
    key: "currentPassIsCorrect",
    value: function currentPassIsCorrect(req, res, next) {
      var token, decodedCookie, idUser, user, validPassword;
      return regeneratorRuntime.async(function currentPassIsCorrect$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              token = req.cookies.token;
              decodedCookie = jwt.verify(token, TOKEN_KEY);
              idUser = decodedCookie._id;
              _context2.next = 5;
              return regeneratorRuntime.awrap(Account.findOne({
                _id: idUser
              }));

            case 5:
              user = _context2.sent;

              if (!user) {
                _context2.next = 17;
                break;
              }

              _context2.next = 9;
              return regeneratorRuntime.awrap(bcrypt.compare(req.body.currentpassword, user.password));

            case 9:
              validPassword = _context2.sent;

              if (!validPassword) {
                _context2.next = 14;
                break;
              }

              next();
              _context2.next = 15;
              break;

            case 14:
              return _context2.abrupt("return", res.json({
                status: false,
                message: "Current password is incorrect"
              }));

            case 15:
              _context2.next = 18;
              break;

            case 17:
              return _context2.abrupt("return", res.json({
                status: false,
                message: "Has err please logout and try again"
              }));

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "updatePassword",
    value: function updatePassword(req, res, next) {
      var token, decodedCookie, idUser, salt, newpassword;
      return regeneratorRuntime.async(function updatePassword$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              token = req.cookies.token;
              decodedCookie = jwt.verify(token, TOKEN_KEY);
              idUser = decodedCookie._id;
              _context3.next = 5;
              return regeneratorRuntime.awrap(bcrypt.genSalt(10));

            case 5:
              salt = _context3.sent;
              _context3.next = 8;
              return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, salt));

            case 8:
              newpassword = _context3.sent;
              Account.updateOne({
                _id: idUser
              }, {
                password: newpassword
              }).then(function (data) {
                return res.json({
                  status: true,
                  message: "Update password successfully"
                });
              })["catch"](function (err) {
                console.log(err);
                return res.json({
                  status: false,
                  message: "Has error please try again later"
                });
              });

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }]);

  return AccountController;
}();

function sendMail(reciever, content) {
  var transporter, mailOptions;
  return regeneratorRuntime.async(function sendMail$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          try {
            transporter = nodemailer.createTransport('smtps://vinhtieng9889%40gmail.com:098767890@smtp.gmail.com');
            mailOptions = {
              from: '"Vinh Tieng" <Vinh tiếng>',
              to: "".concat(reciever),
              subject: 'Account for your room',
              text: 'Hello world ?',
              html: "".concat(content)
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log("Err is: " + error);
              }

              console.log('Email was sent');
            });
          } catch (err) {
            console.log("Has err : " + err);
          }

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}

module.exports = new AccountController();