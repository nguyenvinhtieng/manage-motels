"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Customer = new Schema({
  name: {
    type: String,
    maxLength: 255
  },
  identity: {
    type: String
  },
  dateofbirth: {
    type: String
  },
  roomid: {
    type: String
  },
  roomnumber: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  startday: {
    type: String
  },
  leaveday: {
    type: String
  },
  job: {
    type: String
  },
  sex: {
    type: String
  },
  note: {
    type: String
  }
});
module.exports = mongoose.model('Customer', Customer);