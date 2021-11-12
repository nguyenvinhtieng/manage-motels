const {mongooseToObject} = require('../../utils/mongoose')
const Notification = require('../models/Notification.js')

class NotificationController{ 
    create(req, res, next){
        let notification = new Notification(req.body)
        notification.save()
            .then(data=>{
                return res.json({status: true, message: "Create notification successfully", data})
            })
            .catch(err=>{
                return res.json({status: false, message: "Has error please try again later" })
            })
    }
    getData(req, res, next){
        Notification.find({}).sort('-createdAt').exec(function(err, data) { 
            if(err) return res.json({status: false})
            return res.json({status: true, data: data})
        });
    }

    delete(req, res, next){
        Notification.deleteOne({_id: req.body._id})
            .then(data=>{
                return res.json({status: true, message: "Delete notification successfully"})
            })
            .catch(err=>{
                return res.json({status: false, message: "Delete notification failed"})
            })
    }

    viewNotification(req, res, next){
        let id = req.params.id;
        Notification.findOne({_id: id})
            .then(data=>{
                if(data){
                    res.render('./admin/detailnotification', {data: mongooseToObject(data)})
                } else {
                    res.redirect('/admin/notifications')
                }
            })
            .catch(err=>{
                res.redirect('/admin/notifications')
            })
    }
}
module.exports = new NotificationController();