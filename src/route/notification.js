const express = require('express');
const router = express.Router()

const MainController = require('../app/controllers/MainController')
const NotificationController = require('../app/controllers/NotificationController')

router.post('/create', MainController.isLogin,MainController.isAdmin, NotificationController.create);

router.delete('/delete', MainController.isLogin, MainController.isAdmin,NotificationController.delete);

router.get('/view/:id', MainController.isLogin, NotificationController.viewNotification);

router.get('/getData', MainController.isLogin, NotificationController.getData);

router.get('/:anything', MainController.pageNotFound);

module.exports = router;