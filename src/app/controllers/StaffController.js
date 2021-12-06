const Account = require('../models/Account');
const Staff = require('../models/Staff');
const Job = require('../models/Job.js')
const jwt = require('jsonwebtoken');

const TOKEN_KEY = 'AmkshOnmshGndksmHg'
class StaffController {
    renderHome(req, res) {
        res.render('./staff/home')
    }
    async renderMe(req, res, next) {
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        let account = await Account.findOne({ _id: idUser })
        let staff = await Staff.findOne({ username: account.username }).lean()
        res.render('./staff/myinfor', { staff })
    }
    async renderJob(req, res) {
        const jobs = await Job.find({ $and: [{ approved: "yes" }, { staff: '' }] }).lean()
        // console.log(jobs)
        res.render('./staff/job', { jobs })
    }

    async renderMyJob(req, res) {
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        const jobs = await Job.find({ staff: idUser }).lean()
        res.render('./staff/myjob', { jobs })
    }
    async pickTask(req, res) {
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        //let staff = await Staff.findOne({ _id: idUser })
        let id = req.body.id;
        let job = await Job.findOne({ _id: id })
        job.staff = idUser
        await job.save()
        res.redirect('/staff/my-job')
    }
    async finishTask(req, res) {
        let id = req.params.id;
        let job = await Job.findOne({ _id: id })
        job.status = "finish"
        await job.save()
        res.redirect('/staff/jobs')
    }

    async renderSalary(req, res) {
        res.render('./staff/salary')
    }
    async getSalaryYear(req, res) {
        let year = req.body.year
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        let jobs = await Job.find({ $and: [{ staff: idUser }, { status: 'finish' }] })
        let total = 0
        jobs.forEach(job => {
            if (job.endday.split('-')[0] == year) {
                total += job.price
            }
        })
        return res.json({ data: total })
    }
    async getSalaryMonth(req, res) {
        let year = req.body.year
        let month = req.body.month
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        let jobs = await Job.find({ $and: [{ staff: idUser }, { status: 'finish' }] })
        let total = 0
        jobs.forEach(job => {
            if (job.endday.split('-')[0] == year && job.endday.split('-')[1] == month) {
                total += job.price
            }
        })
        return res.json({ data: total })
    }
}


module.exports = new StaffController();