const express = require('express');
const router = express.Router()

const MainController = require('../app/controllers/MainController');
const CustomerController = require('../app/controllers/CustomerController');
const RoomController = require('../app/controllers/RoomController');

router.get('/getData', MainController.isLogin, MainController.isAdmin, CustomerController.getData);

router.post('/add', MainController.isLogin, MainController.isAdmin, RoomController.roomIsFull, RoomController.addOnePersonToRoom, CustomerController.addCustomer);


router.post('/getCustomer', MainController.isLogin, MainController.isAdmin, CustomerController.getCustomer);

router.put('/update', MainController.isLogin, MainController.isAdmin, RoomController.roomIsValid,RoomController.removeOnePersonInRoom , CustomerController.updateCustomer);

module.exports = router;