"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var DeviceInRoom = new Schema({
  idroom: {
    type: String
  },
  iddevice: {
    type: String
  }
});
module.exports = mongoose.model('DeviceInRoom', DeviceInRoom);