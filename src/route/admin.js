const express = require('express');
const router = express.Router()

const MainController = require('../app/controllers/MainController');
const AdminController = require('../app/controllers/AdminController');
const flash = require('../app/lib/flashMessage')

router.get('/home', flash, MainController.isLogin, MainController.isAdmin, AdminController.renderHome);
// room
router.get('/rooms', flash, MainController.isLogin, MainController.isAdmin, AdminController.renderRoom);
router.get('/delete-room/:id', MainController.isLogin, MainController.isAdmin, AdminController.deleteRoom);
router.post('/rooms', MainController.isLogin, MainController.isAdmin, AdminController.addRoom);
router.post('/update-room', MainController.isLogin, MainController.isAdmin, AdminController.updateRoom);

// device
router.get('/devices', flash, MainController.isLogin, MainController.isAdmin, AdminController.renderDevice);
router.post('/devices', MainController.isLogin, MainController.isAdmin, AdminController.addDevice);
router.post('/update-device', MainController.isLogin, MainController.isAdmin, AdminController.updateDevice);
router.get('/delete-device/:id', MainController.isLogin, MainController.isAdmin, AdminController.deleteDevice);

// account
router.get('/accounts', flash, MainController.isLogin, MainController.isAdmin, AdminController.renderAccount);
router.post('/accounts', MainController.isLogin, MainController.isAdmin, AdminController.addAccount);
router.post('/update-account', MainController.isLogin, MainController.isAdmin, AdminController.updateAccount);
router.get('/delete-account/:id', MainController.isLogin, MainController.isAdmin, AdminController.deleteAccount);

router.get('/customers', flash, MainController.isLogin, MainController.isAdmin, AdminController.renderCustomers);
router.post('/customers', MainController.isLogin, MainController.isAdmin, AdminController.addCustomer);
router.post('/update-customer', MainController.isLogin, MainController.isAdmin, AdminController.updateCustomer);


router.get('/revenue', MainController.isLogin, MainController.isAdmin, AdminController.renderRevenue);

// service
router.get('/service', flash, MainController.isLogin, MainController.isAdmin, AdminController.renderService);
router.get('/get-service/:id', MainController.isLogin, MainController.isAdmin, AdminController.getOneService);
router.post('/update-service', MainController.isLogin, MainController.isAdmin, AdminController.updateService);
router.get('/delete-service/:id', MainController.isLogin, MainController.isAdmin, AdminController.deleteService);
router.post('/service', MainController.isLogin, MainController.isAdmin, AdminController.addService);

//staff
router.get('/staff', flash, MainController.isLogin, MainController.isAdmin, AdminController.renderStaff);
router.post('/getDataStaff', MainController.isLogin, MainController.isAdmin, AdminController.getDataStaff);
router.post('/staff', MainController.isLogin, MainController.isAdmin, AdminController.addStaff);
router.post('/update-staff', MainController.isLogin, MainController.isAdmin, AdminController.updateStaff);

// job
router.get('/jobs', flash, MainController.isLogin, MainController.isAdmin, AdminController.renderJob);
router.post('/jobs', MainController.isLogin, MainController.isAdmin, AdminController.addJob);
router.get('/accept-job/:_id', MainController.isLogin, MainController.isAdmin, AdminController.acceptJob);
router.get('/delete-job/:id', MainController.isLogin, MainController.isAdmin, AdminController.deleteJob);

// notification
router.get('/notifications', flash, MainController.isLogin, MainController.isAdmin, AdminController.renderNotifications);
router.post('/notifications', MainController.isLogin, MainController.isAdmin, AdminController.addNotification);
router.get('/delete-notify/:id', MainController.isLogin, MainController.isAdmin, AdminController.deleteNotify);


router.get('/receipt/:roomnumber', MainController.isLogin, MainController.isAdmin, AdminController.renderReceiptRoom);
router.post('/create-receipt-room', MainController.isLogin, MainController.isAdmin, AdminController.createReceiptRoom);
router.get('/receipt', flash, MainController.isLogin, MainController.isAdmin, AdminController.renderReceipt);
router.post('/receipt', MainController.isLogin, MainController.isAdmin, AdminController.addReceipt);
router.post('/get-receipt', MainController.isLogin, MainController.isAdmin, AdminController.getReceipt);
router.get('/update-receipt/:id/:status', MainController.isLogin, MainController.isAdmin, AdminController.updateReceipt);

router.post('/getrevenue-year', MainController.isLogin, MainController.isAdmin, AdminController.getRevenueYear);
router.post('/getrevenue-month', MainController.isLogin, MainController.isAdmin, AdminController.getRevenueMonth);

router.get('/repair', flash, MainController.isLogin, MainController.isAdmin, AdminController.renderRepair);
router.get('/reject-request/:id', MainController.isLogin, MainController.isAdmin, AdminController.rejectRequest);
router.get('/accept-request/:id', MainController.isLogin, MainController.isAdmin, AdminController.acceptRequest);
router.get('/finish-request-room/:id', MainController.isLogin, MainController.isAdmin, AdminController.finishRequestRoom);
router.post('/finish-request-device', MainController.isLogin, MainController.isAdmin, AdminController.finishRequestDevice);


router.post('/update-repair', MainController.isLogin, MainController.isAdmin, AdminController.updateRepair);


router.get('/:anything', MainController.pageNotFound);

module.exports = router;
