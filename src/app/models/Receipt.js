const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Receipt = new Schema({
    roomnumber: { type: String },
    electric: { type: Number },
    water: { type: Number },
    roomprice: { type: Number },
    service: { type: Number },
    total: { type: Number },
    status: { type: String },
    month: { type: Number },
    year: { type: Number },
}, {
    timestamps: true
});


module.exports = mongoose.model('Receipt', Receipt);
