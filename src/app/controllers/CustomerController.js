
const Customer = require('../models/Customer.js')
class CustomerController{

    getData(req, res, next) {
        Customer.find()
            .then(data=>{
                return res.json(data)
            })
            .catch(err=>{
                return res.json(null)
            })
    }

    addCustomer(req, res, next) {
        let newData = { 
            name: req.body.name, 
            identity: req.body.identity, 
            phone: req.body.phone, 
            dateofbirth: req.body.dateofbirth, 
            sex: req.body.sex, 
            job: req.body.job, 
            email: req.body.email, 
            note: req.body.note, 
            roomid: req.body.roomid, 
            roomnumber: req.body.roomnumber, 
            startday: req.body.startday,
            leaveday: ''
        }
        let customer = new Customer(newData)
        customer.save()
            .then(data=>{
                return res.json({status: true, message: "Add customer successfully",data})
            })
            .catch( err=>{
                return res.json({status: true, message: "Has error while adding customer"})
            })

    }

    getCustomer(req, res, next){
        Customer.findOne({_id: req.body.id})
            .then(data=>{
                return res.json({status: true, data})
            })
            .catch(err=>{
                return res.json({status: false, message: "Has error, Please try again later"})
            })
    }
    
    updateCustomer(req, res, next){
        Customer.updateOne({_id: req.body.id}, req.body)
            .then(data=>{
                return res.json({status: true, message: "Updated customer successfully"})
            })
            .catch(err=>{
                console.log(err)
                return res.json({status: false, message: "Has error, Please try again later"})
            })
    }

}
module.exports = new CustomerController();