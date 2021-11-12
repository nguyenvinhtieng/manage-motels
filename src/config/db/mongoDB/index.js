const mongoose = require('mongoose');
// mongodb+srv://vinhtieng:<password>@cluster0.wru1l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//let url = 'mongodb+srv://vinhtieng:vinhtieng@cluster0.wru1l.mongodb.net/manage-motels?retryWrites=true&w=majority'
//let url = 'mongodb+srv://dbUser:101060@clustersocialnetwork.r5gqi.mongodb.net/social?retryWrites=true&w=majority'

let url = 'mongodb+srv://vinhtieng:vinhtieng@cluster0.ugswm.mongodb.net/test'
async function connect() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('connect successfully')
    }
    catch (e) {
        console.log('connect failure')
    }
}

module.exports = { connect };

/*
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://vinhtieng:<password>@cluster0.wru1l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/