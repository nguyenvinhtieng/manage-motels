const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 3000;
const helpers = require('./helpers');
const route = require('./route/index');
const db = require('./config/db/mongoDB/index');
const init = require('./initAdmin')
db.connect();
init.initAccount()

app.use(methodOverride('_method'));
app.use(cookieParser())
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "axamasdashdiasdbb",
}))
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//engine
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: helpers
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

route(app);
// run
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})



