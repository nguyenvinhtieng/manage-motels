const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const Account = require('../models/Account.js')
const Room = require('../models/Room.js')
let URL = "http://localhost:3000/login"

const jwt = require('jsonwebtoken');
const TOKEN_KEY = 'AmkshOnmshGndksmHg'

class AccountController {
    // GET '/account/getData'
    getData(req, res, next) {
        Account.find({ role: { $ne: 'admin' } })
            .then(data => {
                return res.json(data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    // POST /account/create
    isHasAccount(req, res, next) {
        Account.findOne({ username: req.body.username })
            .then(data => {
                if (data) {
                    return res.json({ status: false, message: "Username was exitst" })
                } else {
                    next();
                }
            })
            .catch(err => {
                return res.json({ status: false, message: "Has error, Please try again later" })
            })
    }

    async isHasRoomAccount(req, res, next) {
        let acc = await Account.findOne({ roomnumber: req.body.roomnumber })
        if (acc) {
            return res.json({ status: false, message: "Has account for room " + req.body.roomnumber })
        } else {
            next()
        }

    }

    async create(req, res, next) {
        let pass = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
        let defaultData = {
            role: "guest",
            password: '123456789'
        }
        let data = Object.assign(req.body, defaultData)
        let account = new Account(data)
        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(account.password, salt);
        account.save();
        let email = req.body.email;
        let content = `
            <h2> Account For Your Room</h2>
            <div> Please do not share your account with others people</p>
            </div>Your account is</div>
            <div>Username :${req.body.username}<br>Password :${pass} </div>
            Information about your room: </br>
            Room number : ${req.body.roomnumber}
            <br><a href='${URL}'>Click here </a>to login
        `
        //sendMail(email, content)
        return res.json({ status: true, message: "Create account successfully" })

    }

    async createAccountStaff(req, res, next) {
        let pass = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
        let defaultData = {
            role: "staff",
            password: '123456789'
        }
        let data = Object.assign(req.body, defaultData)
        let account = new Account(data)
        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(account.password, salt);
        account.save();
        let email = req.body.email;
        let content = `
            <h2> Account For Your Room</h2>
            <div> Please do not share your account with others people</p>
            </div>Your account is</div>
            <div>Username :${req.body.username}<br>Password :${pass} </div>
            <br><a href='${URL}'>Click here </a>to login
        `
        //sendMail(email, content)
        return res.json({ status: true, message: "Create account successfully" })
    }

    getAccount(req, res, next) {
        Account.findOne({ username: req.body.username })
            .then(data => {
                if (data) {
                    let newData = {
                        username: data.username,
                        roomnumber: data.roomnumber,
                        roomid: data.roomid,
                        email: data.email
                    }
                    return res.json({ status: true, data: newData })
                } else {
                    return res.json({ status: false, message: "Please try again later!" })
                }
            })
            .catch(err => {
                return res.json({ status: false, message: "Please try again later!" })
            })
    }

    async checkUpdate(req, res, next) {
        let acc = await Account.findOne({ roomnumber: req.body.roomnumber })
        if (!acc) next()
        if (acc.username != req.body.username)
            return res.json({ status: false, message: "Room number is not valid!, Please choose another room." })
        next()
    }

    // PUT /account/update
    updateAccount(req, res, next) {
        Account.updateOne({ username: req.body.username }, req.body)
            .then(data => {
                return res.json({ status: true, message: "Account was update" })
            })
            .catch(err => {
                return res.json({ status: false, message: "Please try again later" })
            })
    }

    // DELETE account/delete
    deleteAccount(req, res, next) {
        Account.deleteOne({ username: req.body.username })
            .then(data => {
                return res.json({ status: true, message: "Account was deleted" })
            })
            .catch(err => {
                return res.json({ status: false, message: "Please try again later" })
            })
    }

    async currentPassIsCorrect(req, res, next) {
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        let user = await Account.findOne({ _id: idUser })
        if (user) {
            const validPassword = await bcrypt.compare(req.body.currentpassword, user.password);
            if (validPassword) {
                next()
            } else {
                return res.json({ status: false, message: "Current password is incorrect" })
            }
        } else {
            return res.json({ status: false, message: "Has err please logout and try again" })
        }
    }

    async updatePassword(req, res, next) {
        let token = req.cookies.token;
        let decodedCookie = jwt.verify(token, TOKEN_KEY)
        let idUser = decodedCookie._id;
        const salt = await bcrypt.genSalt(10);
        let newpassword = await bcrypt.hash(req.body.password, salt);
        Account.updateOne({ _id: idUser }, {
            password: newpassword
        })
            .then(data => {
                return res.json({ status: true, message: "Update password successfully" })
            })
            .catch(err => {
                console.log(err)
                return res.json({ status: false, message: "Has error please try again later" })
            })

    }
}


async function sendMail(reciever, content) {
    console.log("run")
    try {
        var transporter = nodemailer.createTransport('smtps://vinhtieng9889%40gmail.com:098767890@smtp.gmail.com');
        var mailOptions = {
            from: '"Vinh Tieng" <Vinh tiếng>',
            to: `${reciever}`,
            subject: 'Account for your room',
            text: 'Hello world ?',
            html: `${content}`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Err is: " + error);
            }
            console.log('Email was sent');
        });
    } catch (err) {
        console.log("Has err : " + err)
    }
}

module.exports = new AccountController();
