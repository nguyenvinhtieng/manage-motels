const express = require('express');
const router = express.Router()

const MainController = require('../app/controllers/MainController')
const StaffController = require('../app/controllers/StaffController')

router.get('/home', MainController.isLogin, StaffController.renderHome);
router.get('/me', MainController.isLogin, StaffController.renderMe);
router.get('/jobs', MainController.isLogin, StaffController.renderJob);
router.get('/my-job', MainController.isLogin, StaffController.renderMyJob);
router.post('/pick-task', MainController.isLogin, StaffController.pickTask);
router.get('/salary', MainController.isLogin, StaffController.renderSalary);
router.post('/get-salary-year', MainController.isLogin, StaffController.getSalaryYear);
router.post('/get-salary-month', MainController.isLogin, StaffController.getSalaryMonth);
router.get('/finish-task/:id', MainController.isLogin, StaffController.finishTask);


router.get('/:anything', MainController.pageNotFound);

module.exports = router;