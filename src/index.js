const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
var cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 3000;
// my library
const route = require('./route/index');
// database
const db = require('./config/db/mongoDB/index');
// connect database 
db.connect();
const init = require('./initAdmin')
init.initAccount()

app.use(methodOverride('_method'));
// cookies
app.use(cookieParser())

app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
//engine
const helpers = require('./helpers');
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: helpers
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// routes
route(app);
// run
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})



