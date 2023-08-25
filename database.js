const mongoose = require('mongoose');

exports.connectMongoose = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/passport', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(`Connected to MongoDB: ${mongoose.connection.host}`);
    })
    .catch((err) => {
        console.error(err);
    });
};


const userSchema = new mongoose.Schema({

name:String,

    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        type:String,
        required:true
    }
})


exports.User = mongoose.model('User',userSchema);