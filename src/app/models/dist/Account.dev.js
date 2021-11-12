"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Account = new Schema({
  username: {
    type: String,
    maxLength: 255,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  roomnumber: {
    type: String
  },
  roomid: {
    type: String
  },
  email: {
    type: String
  }
});
module.exports = mongoose.model('Account', Account);