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

// put and patch methods
app.use(methodOverride('_method'));
// cookies
app.use(cookieParser())

app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
//engine
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: {
    status: (id, status) => {
      if (status.trim() === 'paid') {
        return `<span class="around around-blue">Paid</span>`
      } else if (status.trim() === 'unpaid') {
        return `<span class="around around-red">Unpaid</span>
                <form class="form-ope" method="post" action="/admin/update-receipt">
                  <input type="text" name="id" value="${id}" hidden/>
                  <select name="status">
                    <option value="unpaid" >Chose</option>
                    <option value="paid" >Paid</option>
                    <option value="cancel" >Cancel</option>
                  </select>
                  <button type="submit">Save</button>
                </form>        
        `
      } else if (status.trim() === 'cancel') {
        return `<span class="around around-red">Cancel</span>`
      }
    },
    statuscustomer: (status, room, month, year) => {
      if (status.trim() === 'paid') {
        return `<span class="around around-blue">Paid</span>`
      } else if (status.trim() === 'unpaid') {
        return `<span class="around around-red">Unpaid</span>
        <div class="fz-12">
        Billing Information <br>
        Account number: 123456789 <br>
        Account name: ESDC <br>
        Content: payment for room in ${month} / ${year} . Room  ${room}
        </div>
        
        `
      } else if (status.trim() === 'cancel') {
        return `<span class="around around-red">Cancel</span>`
      }
    },
    statusrequestcus: (status) => {
      if (status.trim() === 'wait') {
        return `<div class="around around-green">
                  ${status}...
                </div>`
      } else if (status.trim() === 'finish') {
        return `<div class="around around-blue">
                  ${status}
                </div>`
      } else if (status.trim() === 'reject') {
        return `<div class="around around-red">
                  ${status}...
                </div>`
      }
    },
    statusrequestad: (status, id) => {
      if (status.trim() === 'wait') {
        return `<div class="around around-green">
                  ${status}...
                </div>
                <form method="post" action="/admin/update-repair">
                <input type="text" value="${id}" name="id" hidden />
                  <select name="status" >
                    <option value="wait"> ---- </option>
                    <option value="finish">finish</option>
                    <option value="reject">reject</option>
                  </select>
                  <button>Save</button>
                </form>
                `
      } else if (status.trim() === 'finish') {
        return `<div class="around around-blue">
                  ${status}
                </div>`
      } else if (status.trim() === 'reject') {
        return `<div class="around around-red">
                  ${status}...
                </div>`
      }
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// routes
route(app);
// run
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})



