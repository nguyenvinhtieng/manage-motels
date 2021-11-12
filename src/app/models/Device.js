const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Device = new Schema({
    name: {type: String},
    price: {type: Number},
    indemnify: {type: Number},
    description: {type: String}
});


module.exports = mongoose.model('Device', Device);
