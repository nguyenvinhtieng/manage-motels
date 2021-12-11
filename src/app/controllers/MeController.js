const Customer = require('../models/Customer.js')
const DeviceInRoom = require('../models/DeviceInRoom.js')
const Device = require('../models/Device.js')
const Room = require('../models/Room.js')
const jwt = require('jsonwebtoken');
const Account = require('../models/Account.js')
const { multipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose')
const TOKEN_KEY = 'AmkshOnmshGndksmHg'
const Notification = require('../models/Notification.js')
const Job = require('../models/Job')
const Receipt = require('../models/Receipt.js')
const Repair = require('../models/Repair.js')
const Service = require('../models/Service.js')
class MeController {
    renderHome(req, res, next) {
        res.render('me/home')
    }
    renderMyInfor(req, res, next) {
        res.render('me/myinfor')
    }
    getDataMyRoom(req, res, next) {
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        Account.findOne({ _id: idUser })
            .then(account => {
                Customer.find({ roomid: account.roomid, leaveday: '' })
                    .then(data => {
                        return res.json(data)
                    })
            })
    }

    renderRoom(req, res, next) {
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        Account.findOne({ _id: idUser })
            .then(account => {
                Room.findOne({ _id: account.roomid })
                    .then(data => {
                        res.render('me/myroom', {
                            data: {
                                number: data.number,
                                maximum: data.maximum,
                                renter: data.renter,
                                numberpeople: data.numberpeople,
                                area: data.area,
                                price: data.price,
                                description: data.description
                            }
                        })
                    })
            })
    }

    async renderJob(req, res, next) {
        let idUser = req._id
        const acc = await Account.findOne({ _id: idUser });
        const roomnumber = acc.roomnumber;
        const jobs = await Job.find({ room: roomnumber }).lean();
        const services = await Service.find({}).lean()
        res.render('./me/job', { jobs, services })
    }

    getDeviceInRoom(req, res, next) {
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        Account.findOne({ _id: idUser })
            .then(account => {
                DeviceInRoom.find({ idroom: account.roomid })
                    .then(data => {
                        let idDevice = []
                        data.forEach(item => {
                            idDevice.push(item.iddevice)
                        })
                        Device.find({ _id: { $in: idDevice } })
                            .then(data => {
                                return res.json(data)
                            })
                    })
            })
    }

    renderNotifications(req, res, next) {
        Notification.find().sort('-createdAt')
            .then(data => {
                res.render('./me/notification', { data: multipleMongooseToObject(data) })
            })
            .catch(err => {
                res.redirect('/login')
            })
    }

    renderDetailNotification(req, res, next) {
        Notification.findOne({ _id: req.params.id })
            .then(data => {
                res.render('./me/detailnotification', { data: mongooseToObject(data) })
            })
            .catch(err => {
                res.redirect('/me/notification')
            })
    }

    async createJob(req, res, next) {
        let { serviceid, date, note } = req.body
        let _id = req._id
        let acc = await Account.findById(_id)
        let serv = await Service.findById(serviceid)
        let data = { room: acc.roomnumber, name: serv.name, date, note, price: serv.price, status: "not yet" }
        let job = new Job(data)
        await job.save()
        res.redirect('/me/jobs')
    }

    async cancelJob(req, res) {
        let id = req.params.id
        await Job.findOneAndRemove({ _id: id })
        res.redirect('/me/jobs')
    }

    async renderReceipt(req, res, next) {
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        const acc = await Account.findOne({ _id: idUser })
        let room = acc.roomnumber;
        let receipts = await Receipt.find({ roomnumber: room }).sort({ createdAt: -1 }).lean();
        res.render('./me/receipt', { receipts })
    }

    async renderRepair(req, res, next) {
        let idUser = req._id
        const acc = await Account.findOne({ _id: idUser })
        let room = acc.roomnumber;
        const requests = await Repair.find({ room: room }).lean()
        res.render('./me/repair', { requests })
    }

    async addNewRequest(req, res) {
        let _id = req._id
        let { content, type, suitabletime } = req.body
        let acc = await Account.findOne({ _id })
        let data = { content, type, suitabletime, room: acc.roomnumber, status: "wait" }
        let repair = new Repair(data)
        await repair.save()
        res.redirect('/me/repair')
    }

    async createRequestRepair(req, res, next) {
        let data = req.body;
        data.status = 'wait'
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        const acc = await Account.findOne({ _id: idUser })
        data.room = acc.roomnumber
        const repair = new Repair(data)
        repair.save()
        res.redirect('/me/repair')
    }
    async getReceipt(req, res) {
        let { month, year } = req.body
        let query = {}
        query.year = year
        let _id = req._id
        let acc = await Account.findOne({ _id })
        query.roomnumber = acc.roomnumber
        if (month) query.month = month
        let receipts = await Receipt.find({ $and: [query, { status: { $ne: "cancel" } }] }).lean()
        return res.json({ status: true, receipts: receipts })
    }
}


module.exports = new MeController();