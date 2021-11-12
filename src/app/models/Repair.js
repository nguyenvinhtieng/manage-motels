const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Repair = new Schema({
    room: { type: String },
    content: { type: String },
    status: { type: String }
});


module.exports = mongoose.model('Repair', Repair);
