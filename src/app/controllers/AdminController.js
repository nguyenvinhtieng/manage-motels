const jwt = require('jsonwebtoken');
const Account = require('../models/Account.js')
const Device = require('../models/Device.js')
const { multipleMongooseToObject } = require('../../utils/mongoose');
const TOKEN_KEY = 'AmkshOnmshGndksmHg'
const Room = require('../models/Room.js')
const Job = require('../models/Job.js')
const Staff = require('../models/Staff.js')
const bcrypt = require("bcrypt");
const Receipt = require('../models/Receipt.js')
const DeviceInRoom = require('../models/DeviceInRoom.js')
const Repair = require('../models/Repair.js')
class AdminController {
    // GET '/admin/home'
    renderHome(req, res, next) {
        res.render('./admin/home')
    }

    // GET '/admin/room
    renderRoom(req, res, next) {
        res.render('./admin/room')
    }

    // GET '/admin/devices
    renderDevice(req, res, next) {
        Device.find()
            .then(data => {
                res.render('./admin/device', {
                    data: multipleMongooseToObject(data)
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    // GET '/admin/account
    renderAccount(req, res, next) {
        res.render('./admin/account')
    }

    renderCustomers(req, res, next) {
        res.render('./admin/customer')
    }

    renderRevenue(req, res, next) {
        res.render('./admin/revenue')
    }

    async renderStaff(req, res, next) {
        let staffs = await Staff.find({}).lean()
        res.render('./admin/staff', { staffs })
    }
    async checkUsername(req, res, next) {
        let data = req.body;
        let username = data.username
        const acc = await Account.findOne({ username: username });
        if (acc) {
            res.redirect('/admin/staff')
        } else {
            next();
        }
    }
    async addStaff(req, res, next) {
        let data = req.body;
        let staff = new Staff(data);
        await staff.save();
        let newData = { username: data.username, password: '123456789', role: 'staff' }
        const account = new Account(newData)
        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(account.password, salt);
        await account.save();
        res.redirect('/admin/staff')
    }

    async updateStaff(req, res) {
        const staff = await Staff.findOne({ _id: req.body._id })
        staff.name = req.body.name;
        staff.identity = req.body.identity;
        staff.sex = req.body.sex;
        staff.phone = req.body.phone;
        staff.dateofbirth = req.body.dateofbirth;
        staff.email = req.body.email;
        staff.status = req.body.status;
        await staff.save();
        res.redirect('/admin/staff')
    }
    async renderJob(req, res, next) {
        let rooms = await Room.find({}).lean()
        let jobs = await Job.find({ delete: { $ne: 'yes' } }).lean()
        res.render('./admin/job', { rooms, jobs })
    }
    async getDataStaff(req, res, next) {
        let id = req.body.id
        const staff = await Staff.findOne({ _id: id })
        return res.json({ success: true, staff })
    }
    async createJob(req, res, next) {
        let data = req.body
        data.approved = 'yes'
        data.status = ''
        const job = new Job(data)
        await job.save()
        res.redirect('/admin/jobs')
    }
    async acceptJob(req, res, next) {
        let id = req.params._id;
        let job = await Job.findOne({ _id: id })
        job.approved = 'yes'
        await job.save()
        res.redirect('/admin/jobs')
    }

    async deleteJob(req, res, next) {
        let id = req.body.id;
        let job = await Job.findOne({ _id: id })
        job.delete = 'yes'
        await job.save()
        res.redirect('/admin/jobs')
    }

    renderNotifications(req, res, next) {
        res.render('./admin/notification')
    }

    async renderReceipt(req, res, next) {
        const rooms = await Room.find({}).lean()
        const receipts = await Receipt.find({}).sort({ createdAt: -1 }).lean()
        res.render('./admin/receipt', { rooms, receipts })
    }

    async renderReceiptRoom(req, res, next) {
        let r = req.params.roomnumber
        const receipts = await Receipt.find({ roomnumber: r }).lean()
        res.render('./admin/roomReceipt', { receipts, r })
    }

    async createReceiptRoom(req, res, next) {
        let total = 0
        const data = req.body;
        //total = data.electric + data.water + data.service
        total = Number(data.electric) + Number(data.water) + Number(data.roomprice)
        const receipt = new Receipt(data)
        // const room = await Room.findOne({ number: data.roomnumber })
        // total += Number(room.price)
        // let roomprice = Number(room.price)
        let service = 0;
        let jobs = await Job.find({ $and: [{ room: data.roomnumber }, { status: 'finish' }] })
        jobs.forEach(j => {
            if (j.startday.split('-')[1] == data.month && j.startday.split('-')[1] == data.month) {
                service += Number(j.price)
            }
        })
        total += service
        let newData = {
            roomnumber: data.roomnumber,
            electric: Number(data.electric),
            water: Number(data.water),
            roomprice: data.roomprice,
            service: service,
            total: total,
            status: 'unpaid',
            month: data.month,
            year: data.year
        }
        const sv = new Receipt(newData)
        await sv.save();
        res.redirect('/admin/receipt')

    }

    async updateReceipt(req, res) {
        let receipt = await Receipt.findOne({ _id: req.body.id })
        receipt.status = req.body.status
        await receipt.save();
        res.redirect(`/admin/receipt`)
    }

    async getRevenueYear(req, res) {
        let year = req.body.year;
        //let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let data = []
        let data1 = []
        for (let i = 1; i <= 12; i++) {
            //let datamonth = {}
            const month = await Receipt.find({ $and: [{ month: i }, { year: year }, { status: "paid" }] })
            let prm = 0;
            let chi = 0
            month.forEach(m => {
                prm += m.total;
                chi += m.water + m.electric + m.service;
            })
            data.push(prm);
            data1.push(chi)
        }
        return res.json({ thu: data, data1 })
    }

    async getRevenueMonth(req, res, next) {
        let year = req.body.year;
        let month = req.body.month;
        const receipts = await Receipt.find({ month, year, status: "paid" })
        let total = 0
        let chi = 0;
        receipts.forEach(m => {
            total += m.total
            chi += m.water + m.electric + m.service
        })

        return res.json({ data: total, chi })
    }
    async renderRepair(req, res, next) {
        const requests = await Repair.find({}).lean()
        res.render('./admin/repair', { requests })
    }

    async updateRepair(req, res, next) {
        const id = req.body.id;
        const repair = await Repair.findOne({ _id: id })
        repair.status = req.body.status
        await repair.save()
        res.redirect('/admin/repair')
    }
}
module.exports = new AdminController();
