const express = require('express');
const router = express.Router()

const MainController = require('../app/controllers/MainController');
const RoomController = require('../app/controllers/RoomController');

router.get('/getData', MainController.isLogin, MainController.isAdmin, RoomController.getData);
router.post('/create', MainController.isLogin, MainController.isAdmin,RoomController.isHasRoom, RoomController.create);
router.post('/getDataRoom', MainController.isLogin, MainController.isAdmin, RoomController.getDataRoom);
router.post('/deviceInRoom', MainController.isLogin, MainController.isAdmin, RoomController.getDeviceInRoom);

router.put('/update', MainController.isLogin, MainController.isAdmin,RoomController.roomIsExitst, RoomController.updateRoom, RoomController.getDataRoom);

router.put('/device', MainController.isLogin, MainController.isAdmin,RoomController.deleteDeviceInRoom, RoomController.updateInforInRoom);
router.delete('/delete', MainController.isLogin, MainController.isAdmin, RoomController.canDeleteRoom, RoomController.deleteDeviceInRoom, RoomController.deleteRoom);


module.exports = router;