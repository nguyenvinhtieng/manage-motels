module.exports = {
    multipleMongooseToObject: function(mongoosesArray){
        return mongoosesArray.map(mongoose => mongoose.toObject());
    },
    mongooseToObject: function(mongoose){
        return mongoose ? mongoose.toObject() : mongoose;
    }
};