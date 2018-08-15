//Create Mongoose document tag

const mongoose = require("mongoose")

var TagSchema = mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    memes : {
        type: Array
    }
})

var Tag = mongoose.model("tag", TagSchema)

module.exports = {
    Tag
}