"use strict";

var mongoose = require('mongoose'); // mongodb+srv://vinhtieng:<password>@cluster0.wru1l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority


var url = 'mongodb+srv://vinhtieng:vinhtieng@cluster0.wru1l.mongodb.net/manage-motels?retryWrites=true&w=majority'; //let url = 'mongodb+srv://dbUser:101060@clustersocialnetwork.r5gqi.mongodb.net/social?retryWrites=true&w=majority'
//let url = 'mongodb://localhost:27017/manage-motels'

function connect() {
  return regeneratorRuntime.async(function connect$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }));

        case 3:
          console.log('connect successfully');
          _context.next = 9;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.log('connect failure');

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
}

module.exports = {
  connect: connect
};
/*
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://vinhtieng:<password>@cluster0.wru1l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/