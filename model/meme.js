const mongoose = require("mongoose")

var MemeSchema = mongoose.Schema({
    title : {
        type: String,
        required : true
    },
    owner : {
        type: String,
        required : true
    },
    image : {
        type: String,
        required : true
    },
    tags : [{
        type: String,
        required : true
    }],
    type :{ ///public or private
        type: String,
        required : true
    }, 
    upvotes :{
        type: Number
    },
    downvotes :{
        type: Number
    }
})

var Meme = mongoose.model("meme", MemeSchema)

module.exports = {
    Meme
}
