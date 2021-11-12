const Room = require('../models/Room.js')
const DeviceInRoom = require('../models/DeviceInRoom.js')
const Customer = require('../models/Customer.js')
const { mongooseToObject } = require('../../utils/mongoose');
class RoomController{

    // GET '/room/getData
    getData(req, res, next){
        Room.find()
            .then(data => {
                return res.json(data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    //POST '/room/create
    create(req, res, next){
        let defaultObj = {
            renter: '',
            numberpeople: 0,
            status: 'empty'
        }
        const data = Object.assign(defaultObj, req.body);
        let room = new Room(data)
        room.save()
            .then(data => {
                return res.json({status: true, message: "Create room successfully", data})
            })
            .catch(err => {
                return res.json({status: false, message: "Has error, please try again later"})
            })
    }

    isHasRoom(req, res, next){
        Room.find({number: req.body.number})
            .then(data => {
                if(data.length > 0){
                    return res.json({status: false, message: "Room name was exitst"})
                } else{
                    next()
                }
            })
            .catch(err => {
                return res.json({status: false, message: "Room name was exitst"})
            })
    }

    getDataRoom(req, res, next){
        Room.findOne({_id: req.body.id})
            .then(data => {
                if(data){
                    return res.json({status: true, message: "Update successfully", data})
                } else{
                    return res.json({status: false, message: "Has error, Please do not edit this page"})
                }
            })
            .catch(err => {
                return res.json({status: false, message: "Has error, Please do not edit this page"})
            })
    }

    // POST 'room/getDeviceInRoom
    getDeviceInRoom(req, res, next){
        DeviceInRoom.find({idroom: req.body.id})
            .then(data =>{
                return res.json(data)
            })
    }

    // PUT '/room/update

    roomIsExitst(req, res, next){
        Room.findOne({_id: {$ne: req.body.id}, number: req.body.number})
            .then(data=>{
                if(data){
                    return res.json({status: false, message:"Room number is exists, please try again"})
                } else{
                    next()
                }
            })
            .catch(err =>{
                return res.json({status: false, message:"Has error, Please try again later"})
            })
    }

    updateRoom(req, res, next){
        Room.updateOne({_id: req.body.id}, req.body)
            .then(data =>{
                if(data){
                   next();
                } else{
                    return res.json({status: false, message:"Has error, Please do not edit this page"})
                }
            })
            .catch(err => {
                return res.json({status: false, message:"Has error, Please try again later"})
            })
    }

    //PUT /room/device/
    deleteDeviceInRoom(req, res, next){
        DeviceInRoom.deleteMany({ idroom: { $in: [req.body.idroom]}})
            .then(data=>{
                next();
            })
            .catch(err=>{
                return res.json({status: false, message: "Has error please try again later"});
            })
    }
    updateInforInRoom(req, res, next){
        let data = []
        let listIdDevice = {...req.body.listIdDevice}
        let length = Object.keys(listIdDevice).length
        // format data
        for(let i=0; i<length; i++){
            let d = {
                idroom: req.body.idroom,
                iddevice: listIdDevice[i]
            }
            data.push(d)
        }
        // save
        for(let j=0; j<data.length; j++){
            let deviceinroom = new DeviceInRoom(data[j])
            deviceinroom.save()
        }
        return res.json({status: true, message: "Set data device successfully"});
    }

    canDeleteRoom(req, res, next){
        Room.findOne({_id: req.body.idroom})
            .then(data =>{
                if(data?.numberpeople > 0){
                    return res.json({status: false, message: "Can not delete this room, because has people lives"})
                }
                else if(data?.numberpeople === 0){
                    next()
                }
                else{
                    return res.json({status: false, message: "Has error, Please try again later"})
                }
            })
            .catch(err =>{
                return res.json({status: false, message: "Has error, Please try again later"})
            })
    }

    // DELETE /room/delete
    deleteRoom(req, res, next){
        Room.deleteOne({_id: req.body.idroom})
            .then(data =>{
                res.json({status: true, message: "Delete data room successfully"})
            })
            .catch(err =>{
                return res.json({status: false, message: "Has error, Please do not try again later"})
            })
    }


    roomIsFull(req, res, next) {
        Room.findOne({_id: req.body.roomid})
            .then(data=>{
                if(data){
                    let max = data?.maximum;
                    let now = data?.numberpeople
                    if(now < max) {
                        next()
                    } else{
                        return res.json({status: false, message: "Room is full"})
                    }
                } else{
                    return res.json({status: false, message: "Has error, Please try again later"})
                }
            })
            .catch(err =>{
                return res.json({status: false, message: "Has error, Please try again later"})
            })
    }

    roomIsValid(req, res, next){
        Room.findOne({_id: req.body.roomid})
            .then(data=>{
                if(data.numberpeople < data.maximum){
                    next()
                } 
                if(data.numberpeople === data.maximum){
                    Customer.findOne({_id: req.body.id})
                        .then(d=>{
                            if(d){
                                if(d.roomid === req.body.roomid){
                                    next()
                                } else {
                                    return res.json({status: false, message: "Room is full"})
                                }
                            } else{
                                return res.json({status: false, message: "Has error, Please try again later"})
                            }
                        })
                }
            })
    }

    async addOnePersonToRoom(req, res, next) {
        Room.findOne({_id: req.body.roomid})
            .then(data=>{
                if(data){
                    let newData = {}
                    if(data?.numberpeople === 0){
                        newData = {
                            numberpeople: data.numberpeople + 1,
                            renter: req.body.name
                        }
                    } else{
                        newData = {
                            numberpeople: data.numberpeople + 1,
                        }
                    }
                    Room.updateOne({number: req.body.roomnumber},  newData)
                        .then(data=>{
                            next()
                        })
                        .catch(err=>{
                            return res.json({status: false, message: "Has error, Please try again later"})
                        })
                } else{
                    return res.json({status: false, message: "Has error, Please try again later"})
                }
            })
            .catch(err =>{
                console.log(err)
                return res.json({status: false, message: "Has error, Please try again later"})
            })
    }

    async removeOnePersonInRoom(req, res, next) {
        if(req.body.leaveday){
            Room.findOne({_id: req.body.roomid})
            .then(data=>{
                if(data){
                    let newData = {}
                    if(data.numberpeople === 1){
                        newData = {
                            numberpeople: data.numberpeople - 1,
                            renter: ""
                        }
                    } else {
                        newData = {
                            numberpeople: data.numberpeople - 1,
                        }
                    }
                    Room.updateOne({number: req.body.roomnumber},  newData)
                        .then(data=>{
                            next()
                        })
                        .catch(err=>{
                            return res.json({status: false, message: "Has error, Please try again later"})
                        })
                } else{
                    return res.json({status: false, message: "Has error, Please try again later"})
                }
            })
            .catch(err =>{
                console.log(err)
                return res.json({status: false, message: "Has error, Please try again later"})
            })
        } else {
            next()
        }
        
    }
}


module.exports = new RoomController();