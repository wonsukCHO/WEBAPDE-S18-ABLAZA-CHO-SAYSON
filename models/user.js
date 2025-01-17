/*

Model folder should contain all direct database access and manipulation
Model files should not include request, response, or view objects
Model files must be created independent of each other. Deleting one model file will not affect the others

*/
const mongoose = require("mongoose")
const crypto = require("crypto")

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    memes: {
        type: Array
    }, 
    liked :{
        type: Array
    }
})

UserSchema.pre("save", function (next) {
    this.password = crypto.createHash("md5").update(this.password).digest("hex")
    next()
})

var User = mongoose.model("user", UserSchema)

exports.create = function (user) {
    return new Promise(function (resolve, reject) {
        console.log(user)
        var u = new User(user)

        u.save().then((newUser) => {
            console.log(newUser)
            resolve(newUser)
        }, (err) => {
            reject(err)
        })
    })
}

exports.authenticate = function (user) {
    return new Promise(function (resolve, reject) {
        console.log("in promise : " + user.username)
        User.findOne({
            email: user.username,
            password: crypto.createHash("md5").update(user.password).digest("hex")
        }).then((user) => {
            if (user) {
                console.log("callback user : " + user)
                resolve(user)
            } else {
                reject(null) //quick fix
            }
        }, (err) => {
            reject(err)
        })
    })
}

exports.get = function (id) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            _id: id
        }).then((user) => {
            resolve(user)
        }, (err) => {
            reject(err)
        })
    })
}

//finds user based on their name
exports.get = function (name) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            name: name
        }).then((user) => {
            resolve(user)
        }, (err) => {
            reject(err)
        })
    })
}

//finds user based on their email
exports.getEmail = function (email) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            email: email
        }).then((user) => {
            resolve(user)
        }, (err) => {
            reject(err)
        })
    })
}

exports.edit = function (id, update) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({
            _id: id
        }, update, {
            new: true
        }).then((newMeme) => {
            resolve(newMeme)
        }, (err) => {
            reject(err)
        })
    })
}

exports.getAll = function () {
    return new Promise(function (resolve, reject) {
        User.find().then((users) => {
            resolve(users)
        }, (err) => {
            reject(err)
        })
    })
}

exports.pushMeme = function (user, meme) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({
            name: user
        }, {
            $push: {
                memes: meme
            }
        }).then((updated) => {
            resolve(updated)
        }, (err) => {
            reject(err)
        })
    })
}

exports.pullMeme = function (user, id) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({
            name: user
        }, {
            $pull: {
                memes: {"meme._id" : id}
            }
        }).then((updated) => {
            resolve(updated)
        }, (err) => {
            reject(err)
        })
    })
}

exports.pushID = function (user, id) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({
            email: user
        }, {
            $push: {
                liked: id
            }
        }).then((updated) => {
            resolve(updated)
        }, (err) => {
            reject(err)
        })
    })
}

exports.update = function (user, id, updatedMeme) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            name: user
        }).then((foundUser) => {
            for (var i = 0; i < foundUser.memes.length; i++) {
                if (foundUser.memes[i]._id == id) {
//                    foundUser.memes.title = updatedMeme.title
//                    foundUser.memes.tags = updatedMeme.tags
//                    foundUser.memes.tagged = updatedMeme.tagged
//                    foundUser.memes.type = updatedMeme.type
//                    foundUser.memes.owner = updatedMeme.owner
                    foundUser.memes.splice(i, 1)
                    break
                }
            }
//            for(var i = 0; i < foundUser.memes.length; i++) {
//                if(foundUser.memes[i].title === updatedMeme.title){
//                    updatedMeme._id =  ObjectId(id.toString())
//                    break
//                }
//            }
        resolve(foundUser)
        }, (err)=>{
            reject(err)
        })
    })
}


//module.exports = {
//    User
//}
