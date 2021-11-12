const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Staff = new Schema({
    username: { type: String },
    name: { type: String },
    identity: { type: String },
    sex: { type: String },
    phone: { type: String },
    dateofbirth: { type: String },
    email: { type: String },
    status: { type: String },
}, {
    timestamps: true
});


module.exports = mongoose.model('Staff', Staff);
