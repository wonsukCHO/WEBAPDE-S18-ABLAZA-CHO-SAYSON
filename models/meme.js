const mongoose = require("mongoose")

var MemeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        required: true
    }],
    tagged: [{
        type: String,
        required: true
    }],
    type: { ///public or private
        type: String,
        required: true
    },
    filename: {
        type: String
    },
    originalfilename: {
        type: String
    },

    //Optional lel
    upvotes: {
        type: Number
    },
    downvotes: {
        type: Number
    }

}, {
    timestamps: true
})

var Meme = mongoose.model("meme", MemeSchema)

exports.create = function (meme) {
    return new Promise(function (resolve, reject) {
        var p = new Meme(meme)

        p.save().then((newMeme) => {
            resolve(newMeme)
        }, (err) => {
            reject(err)
        })
    })
}

exports.get = function (id) {
    return new Promise(function (resolve, reject) {
        Meme.findOne({
            _id: id
        }).then((meme) => {
            console.log(meme)
            resolve(meme)
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

exports.edit = function (id, update) {
    return new Promise(function (resolve, reject) {
        Meme.findOneAndUpdate({
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

exports.delete = function (id) {
    return new Promise(function (resolve, reject) {
        Meme.remove({
            _id: id
        }).then((result) => {
            resolve(result)
        }, (err) => {
            reject(err)
        })
    })
}

//module.exports = {
//    Meme
//}
