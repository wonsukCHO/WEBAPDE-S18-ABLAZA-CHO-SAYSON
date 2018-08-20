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


exports.getAll = function(){
  return new Promise(function(resolve, reject){
    Meme.find().then((memes)=>{
      resolve(memes)
    }, (err)=>{
      reject(err)
    })
  })
}

//module.exports = {
//    Tag
//}