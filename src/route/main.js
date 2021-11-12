const express = require('express');
const router = express.Router()

const MainController = require('../app/controllers/MainController');

router.get('/login', MainController.renderLogin);
router.post('/login', MainController.login);
router.get('/', MainController.renderLogin);
router.get('/:anything', MainController.pageNotFound);
module.exports = router;