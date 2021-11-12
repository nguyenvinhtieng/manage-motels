"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Notification = new Schema({
  title: {
    type: String
  },
  text: {
    type: String
  },
  reciever: {
    type: Number
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Notification', Notification);