const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Salary = new Schema({
    idstaff: { type: String },
    month: { type: Number },
    year: { type: Number },
    total: { type: Number },
}, {
    timestamps: true
});


module.exports = mongoose.model('Salary', Salary);
