const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Room = new Schema({
    number: {type: String},
    renter: {type: String},
    maximum: {type: Number},
    numberpeople: {type: Number},
    area: {type: Number},
    price: {type: Number},
    description: {type: String},
    status: {type: String},
});


module.exports = mongoose.model('Room', Room);
