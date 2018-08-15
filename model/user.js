//Create Mongoose document user

const mongoose = require("mongoose")

var UserSchema = mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true,
        unique: true
    },
    password : {
        type: String,
        required : true
    },
    description : {
        type: String,
        required : true
    }, 
    memes : {
        type: Array
    }
})

var User = mongoose.model("user", UserSchema)

module.exports = {
    User
}


//var UserSchema = mongoose.Schema({
//    name : {
//        type: String,
//        required : true
//    },
//    email : {
//        type: String,
//        required : true,
//        unique: true
//    },
//    password : {
//        type: String,
//        required : true
//    },
//    description : {
//        type: String,
//        required : true
//    }, memes : [{type: Schema.ObjectId, ref: 'MemeSchema'}]
//})

