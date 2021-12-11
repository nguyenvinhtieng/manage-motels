const express = require('express');
const router = express.Router()

const MainController = require('../app/controllers/MainController');
const AdminController = require('../app/controllers/AdminController');

router.get('/home', MainController.isLogin, MainController.isAdmin, AdminController.renderHome);
router.get('/rooms', MainController.isLogin, MainController.isAdmin, AdminController.renderRoom);
router.get('/devices', MainController.isLogin, MainController.isAdmin, AdminController.renderDevice);
router.get('/accounts', MainController.isLogin, MainController.isAdmin, AdminController.renderAccount);
router.get('/customers', MainController.isLogin, MainController.isAdmin, AdminController.renderCustomers);
router.get('/revenue', MainController.isLogin, MainController.isAdmin, AdminController.renderRevenue);

// service
router.get('/service', MainController.isLogin, MainController.isAdmin, AdminController.renderService);
router.get('/get-service/:id', MainController.isLogin, MainController.isAdmin, AdminController.getOneService);
router.post('/update-service', MainController.isLogin, MainController.isAdmin, AdminController.updateService);
router.get('/delete-service/:id', MainController.isLogin, MainController.isAdmin, AdminController.deleteService);
router.post('/service', MainController.isLogin, MainController.isAdmin, AdminController.addService);

router.get('/staff', MainController.isLogin, MainController.isAdmin, AdminController.renderStaff);
router.post('/getDataStaff', MainController.isLogin, MainController.isAdmin, AdminController.getDataStaff);
router.post('/staff', MainController.isLogin, MainController.isAdmin, AdminController.checkUsername, AdminController.addStaff);
router.post('/update-staff', MainController.isLogin, MainController.isAdmin, AdminController.updateStaff);

// job
router.get('/jobs', MainController.isLogin, MainController.isAdmin, AdminController.renderJob);
router.post('/jobs', MainController.isLogin, MainController.isAdmin, AdminController.addJob);
router.get('/accept-job/:_id', MainController.isLogin, MainController.isAdmin, AdminController.acceptJob);
router.get('/delete-job/:id', MainController.isLogin, MainController.isAdmin, AdminController.deleteJob);

router.get('/notifications', MainController.isLogin, MainController.isAdmin, AdminController.renderNotifications);
router.get('/receipt/:roomnumber', MainController.isLogin, MainController.isAdmin, AdminController.renderReceiptRoom);
router.post('/create-receipt-room', MainController.isLogin, MainController.isAdmin, AdminController.createReceiptRoom);
router.get('/receipt', MainController.isLogin, MainController.isAdmin, AdminController.renderReceipt);
router.post('/receipt', MainController.isLogin, MainController.isAdmin, AdminController.addReceipt);
router.post('/get-receipt', MainController.isLogin, MainController.isAdmin, AdminController.getReceipt);
router.get('/update-receipt/:id/:status', MainController.isLogin, MainController.isAdmin, AdminController.updateReceipt);

router.post('/getrevenue-year', MainController.isLogin, MainController.isAdmin, AdminController.getRevenueYear);
router.post('/getrevenue-month', MainController.isLogin, MainController.isAdmin, AdminController.getRevenueMonth);

router.get('/repair', MainController.isLogin, MainController.isAdmin, AdminController.renderRepair);
router.get('/reject-request/:id', MainController.isLogin, MainController.isAdmin, AdminController.rejectRequest);
router.get('/accept-request/:id', MainController.isLogin, MainController.isAdmin, AdminController.acceptRequest);
router.get('/finish-request-room/:id', MainController.isLogin, MainController.isAdmin, AdminController.finishRequestRoom);
router.post('/finish-request-device', MainController.isLogin, MainController.isAdmin, AdminController.finishRequestDevice);


router.post('/update-repair', MainController.isLogin, MainController.isAdmin, AdminController.updateRepair);


router.get('/:anything', MainController.pageNotFound);

module.exports = router;
