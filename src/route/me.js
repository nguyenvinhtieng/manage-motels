const express = require('express');
const router = express.Router()

const MeController = require('../app/controllers/MeController');
const MainController = require('../app/controllers/MainController')
const flash = require('../app/lib/flashMessage')

router.get('/home', MainController.isLogin, MeController.renderHome);

router.get('/myinfor', MainController.isLogin, MeController.renderMyInfor);

router.get('/getMyInfor', MainController.isLogin, MeController.getDataMyRoom);

router.get('/device', MainController.isLogin, MeController.getDeviceInRoom);

router.get('/notification', MainController.isLogin, MeController.renderNotifications);

router.get('/notification/:id', MainController.isLogin, MeController.renderDetailNotification);

router.get('/room', MainController.isLogin, MeController.renderRoom);

router.get('/jobs', flash, MainController.isLogin, MeController.renderJob);
router.post('/jobs', MainController.isLogin, MeController.createJob);
router.get('/delete-job/:id', MainController.isLogin, MeController.cancelJob);

router.get('/repair', flash, MainController.isLogin, MeController.renderRepair);
router.post('/repair', MainController.isLogin, MeController.addNewRequest);

router.get('/receipt', MainController.isLogin, MeController.renderReceipt);
router.post('/get-receipt', MainController.isLogin, MeController.getReceipt);



router.get('/:anything', MainController.pageNotFound);

module.exports = router;