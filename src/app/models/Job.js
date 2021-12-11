const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Job = new Schema({
    room: { type: String },
    name: { type: String },
    date: { type: String },
    price: { type: Number },
    status: { type: String },
    staff: { type: String, default: "" },
    note: { type: String, default: "" },
}, {
    timestamps: true
});


module.exports = mongoose.model('Job', Job);
