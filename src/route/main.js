const express = require('express');
const router = express.Router()

const MainController = require('../app/controllers/MainController');

const flash = require('../app/lib/flashMessage')

router.get('/login', flash, MainController.renderLogin);
router.post('/login', MainController.login);
router.get('/', flash, MainController.renderLogin);
router.get('/:anything', flash, MainController.pageNotFound);
module.exports = router;