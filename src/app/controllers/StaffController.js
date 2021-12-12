const Account = require('../models/Account');
const Staff = require('../models/Staff');
const Job = require('../models/Job.js')
const jwt = require('jsonwebtoken');
const Service = require('../models/Service')
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
        const jobs = await Job.find({ status: 'not yet' }).lean()
        const services = await Service.find({}).lean()
        res.render('./staff/job', { jobs, services })
    }

    async renderMyJob(req, res) {
        let idUser = req._id
        let acc = await Account.findOne({ _id: idUser })
        const jobs = await Job.find({ staff: acc.username }).lean()
        res.render('./staff/myjob', { jobs })
    }
    async pickTask(req, res) {
        try {
            let id = req.params.id
            let idUser = req._id
            let acc = await Account.findOne({ _id: idUser })
            await Job.findByIdAndUpdate({ _id: id }, { staff: acc.username, status: "received" })
            req.session.flash = { title: "Success", message: "Job was picked!", type: "success" }
            res.redirect('/staff/my-job')
        } catch {
            req.session.flash = { title: "Error", message: "Pick job failure!", type: "error" }
            res.redirect('/staff/my-job')
        }
    }
    async finishTask(req, res) {
        try {
            let id = req.params.id;
            await Job.findOneAndUpdate({ _id: id }, { status: "finished" })
            req.session.flash = { title: "Success", message: "Job was marked as finished", type: "success" }
            res.redirect('/staff/my-job')
        } catch {
            req.session.flash = { title: "Error", message: "has error", type: "error" }
            res.redirect('/staff/my-job')
        }
    }

    async renderSalary(req, res) {
        res.render('./staff/salary')
    }
    async getSalaryYear(req, res) {
        let { year } = req.body
        let idUser = req._id;
        let acc = await Account.findById(idUser).select("-password")
        let jobs = await Job.find({ $and: [{ staff: acc.username }, { status: 'finished' }] })
        let total = 0
        jobs.forEach(job => {
            if (job.date.split('-')[0] == year) {
                total += +job.price
            }
        })
        return res.json({ data: total })
    }
    async getSalaryMonth(req, res) {
        let { month, year } = req.body
        let idUser = req._id
        let acc = await Account.findById(idUser).select("-password")
        let jobs = await Job.find({ $and: [{ staff: acc.username }, { status: 'finished' }] })
        let total = 0
        jobs.forEach(job => {
            if (job.date.split('-')[0] == year && job.date.split('-')[1] == month) {
                total += +job.price
            }
        })
        return res.json({ data: total })
    }
}


module.exports = new StaffController();