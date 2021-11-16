const express = require('express');
const router = express.Router()

const MainController = require('../app/controllers/MainController');
const AccountController = require('../app/controllers/AccountController');

router.get('/getData', MainController.isLogin, MainController.isAdmin, AccountController.getData);

router.post('/getaccount', MainController.isLogin, MainController.isAdmin, AccountController.getAccount);

router.delete('/delete', MainController.isLogin, MainController.isAdmin, AccountController.deleteAccount);

router.put('/update', MainController.isLogin, MainController.isAdmin, AccountController.updateAccount);

router.post('/updatePass', MainController.isLogin, AccountController.currentPassIsCorrect, AccountController.updatePassword);

router.post('/create', MainController.isLogin, MainController.isAdmin, AccountController.isHasAccount, AccountController.isHasRoomAccount, AccountController.create);
router.post('/create-account-staff', MainController.isLogin, MainController.isAdmin, AccountController.isHasAccount, AccountController.createAccountStaff);

module.exports = router;
