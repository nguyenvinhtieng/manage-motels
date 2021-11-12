const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Account = require('../models/Account.js')
const TOKEN_KEY = 'AmkshOnmshGndksmHg'
const Staff = require('../models/Staff.js')
class MainController {
    // GET '/login'
    renderLogin(req, res, next) {
        res.render('login')
    }
    pageNotFound(req, res, next) {
        res.send('Page not found, please check yout url or <a href="/login"> click here</a> to login')
    }
    //POST '/login'
    async login(req, res, next) {
        const user = await Account.findOne({ username: req.body.username })
        if (user) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (validPassword) {
                var token = jwt.sign({
                    _id: user._id
                }, TOKEN_KEY);
                if (user.role === 'staff') {
                    let staff = await Staff.findOne({ username: req.body.username })
                    if (staff.status !== '') {
                        return res.json({
                            role: user.role,
                            token,
                            isActive: false
                        })
                    } else {
                        return res.json({
                            role: user.role,
                            token,
                            isActive: true
                        })
                    }
                }
                return res.json({
                    role: user.role,
                    token,
                })
            } else {
                return res.json(null)
            }
        } else {
            return res.json(null)
        }
    }

    // Middleware
    isLogin(req, res, next) {
        try {
            if (jwt) {
                let token = req.cookies.token;
                let decodedCookie = jwt.verify(token, TOKEN_KEY)
                let idUser = decodedCookie._id;
                Account.findOne({ _id: idUser })
                    .then(data => {
                        if (data) {
                            next()
                        }
                    })
            } else {
                res.redirect('/login');
            }
        } catch (err) {
            console.log(err);
            res.redirect('/login')
        }
    }

    isAdmin(req, res, next) {
        try {
            let token = req.cookies.token;
            let decodedCookie = jwt.verify(token, TOKEN_KEY)
            let idUser = decodedCookie._id;
            Account.findOne({ _id: idUser })
                .then(data => {
                    if (data.role === 'admin') {
                        next()
                    } else {
                        res.redirect('/login')
                    }
                })
                .catch(err => {
                    res.redirect('/login')
                })
        } catch (err) {
            res.redirect('/login')
        }
    }
}
module.exports = new MainController();