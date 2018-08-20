/*

Model folder should contain all direct database access and manipulation
Model files should not include request, response, or view objects
Model files must be created independent of each other. Deleting one model file will not affect the others

*/
const mongoose = require("mongoose")
const crypto = require("crypto")

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

UserSchema.pre("save", function(next){
  this.password = crypto.createHash("md5").update(this.password).digest("hex")
  next()
})

var User = mongoose.model("user", UserSchema)

exports.create = function(user){
  return new Promise(function(resolve, reject){
    console.log(user)
    var u = new User(user)

    u.save().then((newUser)=>{
      console.log(newUser)
      resolve(newUser)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.authenticate = function(user){
  return new Promise(function(resolve, reject){
    console.log("in promise : " + user.username)
    User.findOne({
      email : user.username,
      password : crypto.createHash("md5").update(user.password).digest("hex")
    }).then((user)=>{
        if(user){
            console.log("callback user : " + user)
            resolve(user)
        } else {
            reject(null) //quick fix
        }
    },(err)=>{
      reject(err)
    })
  })
}

exports.get = function(id){
  return new Promise(function(resolve, reject){
    User.findOne({_id:id}).then((user)=>{
      resolve(user)
    }, (err)=>{
      reject(err)
    })
  })
}


//module.exports = {
//    User
//}
