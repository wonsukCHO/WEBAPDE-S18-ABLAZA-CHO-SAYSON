//Create Mongoose document tag

const mongoose = require("mongoose")

var TagSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    memes: {
        type: Array
    }
})

var Tag = mongoose.model("tags", TagSchema)


exports.create = function (user) {
    return new Promise(function (resolve, reject) {
        console.log(user)
        var u = new Tag(user)

        u.save().then((newUser) => {
            console.log(newUser)
            resolve(newUser)
        }, (err) => {
            reject(err)
        })
    })
}

exports.getAll = function () {
    return new Promise(function (resolve, reject) {
        Meme.find().then((memes) => {
            resolve(memes)
        }, (err) => {
            reject(err)
        })
    })
}

exports.pushMeme = function (tag, meme) {
    return new Promise(function (resolve, reject) {
        Tag.findOneAndUpdate({
            name: tag
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

exports.findTag = function (name) {
    return new Promise(function (resolve, reject) {
        Tag.findOne({
            name: name,
        }).then((tag) => {
            resolve(tag)
        }, (err) => {
            reject(err)
        })
    })
}

//module.exports = {
//    Tag
//}
