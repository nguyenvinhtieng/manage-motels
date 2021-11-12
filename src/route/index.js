const MainRouter = require('./main');
const AdminRouter = require('./admin')
const DeviceRouter = require('./device');
const RoomRouter = require('./room');
const AccountRouter = require('./account');
const CustomerRouter = require('./customer');
const MeRouter = require('./me');
const StaffRouter = require('./staff');
const NotificationRouter = require('./notification');
function route(app) {
    app.use('/admin', AdminRouter);
    app.use('/device', DeviceRouter);
    app.use('/room', RoomRouter);
    app.use('/account', AccountRouter);
    app.use('/customer', CustomerRouter);
    app.use('/me', MeRouter);
    app.use('/notification', NotificationRouter);
    app.use('/staff', StaffRouter);
    app.use('/', MainRouter);
}

module.exports = route;