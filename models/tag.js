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


exports.create = function (tag) {
    return new Promise(function (resolve, reject) {
        console.log(tag)
        var u = new Tag(tag)

        u.save().then((newTag) => {
            console.log(newTag)
            resolve(newTag)
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

//Find tag object
exports.findTag = function (name) {
    return new Promise(function (resolve, reject) {
        Tag.findOne({
            name: name
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
