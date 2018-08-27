/*

Controllers folder should contain all routes dedicated to the particular document
Controllers should not directly access and manipulate the db, it should access the models folder files

index.js should route all prefix paths to the proper controller files
index.js should set the home/index page
index.js should be named index.js, because server.js just refers to the controllers folder, which assumes an index file

*/

const express = require("express")
const router = express.Router()
const app = express()
const Meme = require("../models/meme")
const User = require("../models/user")
const Tag = require("../models/tag")
const hbs = require("hbs")

hbs.registerHelper('each_upto', function (ary, max, options) {
    if (!ary || ary.length == 0)
        return options.inverse(this);

    var result = [];
    for (var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
})

hbs.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this)
    }
    return options.inverse(this)
})

// load all the controllers into router
router.use("/meme", require("./meme"))
router.use("/user", require("./user"))

// create the route for the index/home page
router.get("/", function (req, res) {
    console.log("GET /")
    req.session.limit = 3 //15 in the final build
    var posts = []

    User.getEmail(req.cookies.user).then((user) => {
        req.session.username = user.name
        Meme.getAll().then((memes) => {
            memes.forEach((a) => {
                if (a.type == "Public" || a.tagged.includes(req.cookies.user) || a.owner === req.cookies.user) {
                    posts.push(a)
                }
            }) //forEach
            res.render("home", {
                //user: req.session.username,
                user: req.session.username,
                memes: posts,
                limit: req.session.limit
            })
        }) //Memes.getAll
    }, (err) => {
        Meme.getAll().then((memes) => {
            memes.forEach((a) => {
                if (a.type == "Public") {
                    posts.push(a)
                }
            }) //forEach
            res.render("index", {
                //user: req.session.username,
                memes: posts,
                limit: req.session.limit
            })
        })
    })
})

router.get("/about", function (req, res) {
    console.log("GET /about")
    if (req.session.username) {
        res.render("about", {
            user: req.session.username
        })
    } else {
        res.render("about", {
            user: "Guest",
        })
    }
})

module.exports = router
