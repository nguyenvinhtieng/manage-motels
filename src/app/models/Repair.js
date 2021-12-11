const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Repair = new Schema({
    room: { type: String },
    content: { type: String },
    suitabletime: { type: String },
    status: { type: String },
    type: { type: String },
    price: { type: Number, default: 0 },
});


module.exports = mongoose.model('Repair', Repair);
