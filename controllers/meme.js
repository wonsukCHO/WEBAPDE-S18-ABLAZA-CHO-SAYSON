/*

Controllers folder should contain all routes dedicated to the particular document
Controllers should not directly access and manipulate the db, it should access the models folder files

*/
const express = require("express")
const router = express.Router()
const Meme = require("../models/meme")
const User = require("../models/user")
const Tag = require("../models/tag")
const bodyparser = require("body-parser")
const auth = require("../middlewares/auth")

const multer = require("multer")
const mongoose = require("mongoose")
const path = require("path")
const hbs = require("hbs")
const fs = require("fs")



const urlencoder = bodyparser.urlencoded({
    extended: true
})

router.use(urlencoder)

// This is required for the uploads:
// multer is our middleware, it saves files uploaded by the user
// UPLOAD_PATH assumes we have an "uploads" folder in our current directory
// dest is the path where the files will be saved
// limits are options, in this case, file must not be larger than 1000000 bytes, and we can only upload 2 at a time
const UPLOAD_PATH = path.resolve(__dirname, "uploads")
const upload = multer({
    dest: UPLOAD_PATH,
    limits: {
        fileSize: 10000000,
        files: 2
    }
})


// this should be in controller post
// we use the multer middleware where
// "img" must match the name attribute of the <input type="file">
// we can access what multer saved through the req.file object
// req.file.filename = name that multer assigned to the saved image
// req.file.originalname = original name of the file from user's computer
router.post("/postMeme", upload.single("img"), (req, res) => {
    console.log(req.body.title)
    console.log(req.file.filename)

    // multer saves the actual image, and we save the filepath into our DB
    var meme = {
        title: req.body.title,
        owner: req.session.username,
        tags: (req.body.tags).trim().split(","),
        type: req.body.type,
        tagged: (req.body.users).trim().split(","),
        filename: req.file.filename,
        originalfilename: req.file.original //multer needs this

    }
    
    
    Meme.create(meme).then((doc) => {
        User.pushMeme(req.session.username, doc)
//        for(var i = 0; i < doc.tags.length; i++){
//            if(Tag.findTag(doc.tags[i])){
//                Tag.pushMeme(doc.tags[i], doc)
//                console.log("found tag")
//            } else{
//                Tag.create(doc.tags[i]).then((newTag)=>{
//                    Tag.pushMeme(newTag.name, doc)
//                })
//            }
//        }
        res.render("home.hbs", {
            title: doc.title,
            id: doc._id
        })
    })



})

// this should be in controller post
router.get("/photo/:id", (req, res) => {
    console.log(req.params.id)
    Meme.get(req.params.id).then((doc) => {
        fs.createReadStream(path.resolve(UPLOAD_PATH, doc.filename)).pipe(res)
    }, (err) => {
        console.log(err)
        res.sendStatus(404)
    })
})

//
//router.post("/edit/:id", (req, res) => {
//    console.log("POST /post/" + req.params.id)
//    Meme.edit(req.params.id, update).then((meme) => {
//        console.log(meme)
//        res.render("home", {
//            meme
//        })
//    }, (error) => {
//        res.render("home", {
//            error
//        })
//    })
//})
//
//router.post("/delete/:id", (req, res) => {
//    console.log("POST /post/" + req.params.id)
//    Meme.edit(req.params.id).then((meme) => {
//        console.log(meme)
//        res.render("home", {
//            meme
//        })
//    }, (error) => {
//        res.render("home", {
//            error
//        })
//    })
//})
//
//// localhost:3000/post/someid
//router.get("/:id", (req, res) => {
//    console.log("POST /post/" + req.params.id)
//    Post.get(req.params.id).then((post) => {
//        console.log(post)
//        res.render("post", {
//            post
//        })
//    }, (error) => {
//        res.render("home", {
//            error
//        })
//    })
//})

// always remember to export the router
module.exports = router
