const Device = require('../models/Device.js')
const DeviceInRoom = require('../models/DeviceInRoom.js')
const { mongooseToObject } = require('../../utils/mongoose');

class DeviceController{
    // POST '/device/add
    addDevice(req, res, next){
        const formData = {...req.body};
        const device = new Device(formData);
        device.save()
            .then((data) => {
                return res.json({
                    data: mongooseToObject(data)
                })
            })
            .catch(next);
    }

    // POST '/device/getData
    getData(req, res, next){
        Device.findOne({_id: req.body.id})
            .then(data => {
                if(data)
                    return res.json(data)
                else
                    return res.json(null)
            })
            .catch(err => {
                return res.json(null)
            })
    }
    // PUT '/device/update
    update(req, res, next){
        Device.findOne({_id: req.body.id})
        .then(data => {
            if(data) {
                Device.updateOne({ _id: req.body.id}, req.body)
                    .then(() => res.json({status: true}))
                    .catch(next);
            } else{
                return res.json({status: false});
            }
        })
        .catch(err => {
            return res.json({status: false});
        })
        
    }

    //DELETE '/device/delete
    delete(req, res, next){
        Device.deleteOne({_id: req.body.id})
            .then(data => {
                if(data.deletedCount === 1)
                return res.json({status: true, message: "Delete device successfully"})
                else
                return res.json({status: false, message: "Nothing to delete, Please do not edit this page"})
            })
            .catch(err => {
                console.log(err)
            })
        //console.log(req.body);
    }

    canDelete(req, res, next){
        DeviceInRoom.find({iddevice: req.body.id})
            .then(data=>{
                if(data.length > 0){
                    return res.json({status: false, message: "Can not delete this device because was use by room"})
                } else{
                    next()
                }
            })
            .catch(err => {
                return res.json({status: false, message: "Has error when trying to delete this device"})
            })
    }

    // GET '/device/getDevices
    getDevices(req, res, next){
        Device.find()
            .then(data =>{
                return res.json(data)
            })
    }
}


module.exports = new DeviceController();