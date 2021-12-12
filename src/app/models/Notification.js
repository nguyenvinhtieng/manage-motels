const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
    title: { type: String },
    content: { type: String },
    reciever: { type: Number }
}, {
    timestamps: true
});


module.exports = mongoose.model('Notification', Notification);
