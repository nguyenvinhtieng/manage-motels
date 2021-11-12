const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceInRoom = new Schema({
    idroom: {type: String},
    iddevice: {type: String},
});


module.exports = mongoose.model('DeviceInRoom', DeviceInRoom);
