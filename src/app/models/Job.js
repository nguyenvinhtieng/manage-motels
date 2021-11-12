const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Job = new Schema({
    description: { type: String },
    startday: { type: String },
    endday: { type: String },
    price: { type: Number },
    room: { type: String },
    status: { type: String },
    approved: { type: String },
    delete: { type: String, default: "" },
    staff: { type: String, default: "" },
}, {
    timestamps: true
});


module.exports = mongoose.model('Job', Job);
