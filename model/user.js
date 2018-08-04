//Create Mongoose document ticket

const mongoose = require("mongoose")

var UserSchema = mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true
    },
    password : {
        type: String,
        required : true
    },
    description : {
        type: String,
        required : true
    },
})

var User = mongoose.model("user", UserSchema)

module.exports = {
    User
}