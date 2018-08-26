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

hbs.registerHelper('each_upto', function (ary, max, options) {
    if (!ary || ary.length == 0)
        return options.inverse(this);

    var result = [];
    for (var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
})

// this should be in controller post
// we use the multer middleware where
// "img" must match the name attribute of the <input type="file">
// we can access what multer saved through the req.file object
// req.file.filename = name that multer assigned to the saved image
// req.file.originalname = original name of the file from user's computer
router.post("/postMeme", upload.single("img"), (req, res) => {
    console.log(req.body.title)
//    console.log(req.file.filename)

    if (req.session.username) {
        // multer saves the actual image, and we save the filepath into our DB
        var meme = {
            title: req.body.title,
            owner: req.cookies.user,
            tags: (req.body.tags).trim().split(","),
            type: req.body.type,
            tagged: (req.body.users).trim().split(","),
            filename: req.file.filename,
            originalfilename: req.file.original //multer needs this
        }


        Meme.create(meme).then((doc) => {
            User.pushMeme(req.session.username, doc).then(() => {
                doc.tags.forEach((tag) => { //tag is just a string
                    Tag.findTag(tag).then((resultTag) => {
                        if (resultTag) { //if tag is already defined, push meme to the array
                            Tag.pushMeme(resultTag.name, doc)
                        } else { //else its a newly defined tag, create it and then push 
                            var t = {
                                name: tag
                            }
                            Tag.create(t).then((newTag) => {
                                Tag.pushMeme(newTag.name, doc)
                            })
                        }
                    })
                })
            })
            res.redirect("/")
            //res.render("home", {
            //    user: req.session.username,
            //    memes: 
            //})
            //res.render("home.hbs", {
            //    title: doc.title,
            //    id: doc._id
            //})
        })
    } else {
        res.render("index", {
            signup_first: true
        })
    }


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


router.get("/search", function (req, res) {
    console.log("GET meme/search")

    var query = req.query.search_item
    var posts = []
    console.log("Search query = " + query)

    if (req.session.username) {
        Tag.findTag(query).then((tag) => {
            tag.memes.forEach((a) => {
                if (a.type === "Public" || a.tagged.contains(req.cookies.user) || a.owner === req.cookies.user) {
                    posts.push(a)
                }
            })
            res.render("tags", {
                user: req.session.username,
                tags: query,
                memes: posts
            })
        })
    } else {
        Tag.findTag(query).then((tag) => {
            tag.memes.forEach((a) => {
                if (a.type === "Public") {
                    posts.push(a)
                }
            })
            res.render("tags", {
                user: "Guest",
                tags: query,
                memes: posts
            })
        })
    }


})

router.get("/more", function (req, res) {
    console.log("GET meme/more")
    req.session.limit = req.session.limit + 5
    var posts = []
    if (req.session.username) {
        Meme.getAll().then((memes) => {
            memes.forEach((a) => {
                if (a.type === "Public" || a.tagged.includes(req.cookies.user) || a.owner === req.cookies.user) {
                    posts.push(a)
                }
            }) //forEach
            res.render("home", {
                user: req.session.username,
                memes: posts,
                limit: req.session.limit
            })
        })
    } else {
        Meme.getAll().then((memes) => {
            memes.forEach((a) => {
                if (a.type === "Public") {
                    posts.push(a)
                }
            }) //forEach
            res.render("index", {
                memes: posts,
                limit: req.session.limit
            })
        })
    }

})

router.post("/editMeme", urlencoder, function (req, res) {
    console.log("POST meme/editMeme")

    var updatedMeme = {
        title: req.body.title,
        tags: (req.body.tags).split(","),
        type: req.body.type
    }
    console.log(updatedMeme)

    Meme.edit(req.body.id, updatedMeme).then((meme) => { //Update the meme objects
        //        User.pullMeme(req.session.username, req.body.id).then(() => { //pull the users copy
        ////            User.pushMeme(req.session.username, meme).then(() => { //push a new updated copy
        ////            })
        //        })
        res.redirect("../user/profile")
    })
})

router.post("/deleteMeme", urlencoder, function (req, res) {
    console.log("POST meme/deleteMeme")


    Meme.delete(req.body.id).then(() => {
        res.redirect("../user/profile")
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
