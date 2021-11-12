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

        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        const acc = await Account.findOne({ _id: idUser });
        if (!acc) {
            res.redirect('./login')
        }
        const roomnumber = acc.roomnumber;
        const jobs = await Job.find({ room: roomnumber }).lean();
        res.render('./me/job', { jobs })
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
        let data = req.body;
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        const acc = await Account.findOne({ _id: idUser })
        let room = acc.roomnumber;
        data.room = room;
        data.status = 'not yet'
        let job = new Job(data)
        await job.save();
        res.redirect('/me/jobs')
    }

    async renderReceipt(req, res, next) {
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        const acc = await Account.findOne({ _id: idUser })
        let room = acc.roomnumber;
        let receipts = await Receipt.find({ roomnumber: room }).lean();
        res.render('./me/receipt', { receipts })
    }

    async renderRepair(req, res, next) {
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        const acc = await Account.findOne({ _id: idUser })
        let room = acc.roomnumber;
        const requests = await Repair.find({ room: room }).lean()

        res.render('./me/repair', { requests })
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
}


module.exports = new MeController();