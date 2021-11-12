"use strict";

var express = require('express');

var handlebars = require('express-handlebars');

var path = require('path');

var cookieParser = require('cookie-parser');

var methodOverride = require('method-override');

var app = express();
var port = process.env.PORT || 3000; // my library

var route = require('./route/index'); // database


var db = require('./config/db/mongoDB/index'); // connect database 


db.connect(); // put and patch methods

app.use(methodOverride('_method')); // cookies

app.use(cookieParser());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express["static"](path.join(__dirname, 'public'))); //engine

app.engine('hbs', handlebars({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views')); // routes

route(app); // run

app.listen(port, function () {
  console.log("App listening at http://localhost:".concat(port));
});