const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer = new Schema({
    name: { type: String, maxLength: 255 },
    identity: { type: String },
    dateofbirth: { type: String },
    roomid: { type: String },
    roomnumber: { type: String },
    phone: { type: String },
    email: { type: String },
    startday: { type: String },
    endday: { type: String },
    job: { type: String },
    sex: { type: String },
    note: { type: String },
    status: { type: String }
});


module.exports = mongoose.model('Customer', Customer);
