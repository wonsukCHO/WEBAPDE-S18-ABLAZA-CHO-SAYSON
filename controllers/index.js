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

// load all the controllers into router
router.use("/meme", require("./meme"))
router.use("/user", require("./user"))

// create the route for the index/home page
router.get("/", function (req, res) {
    console.log("GET /")
    if (req.cookies.user) {
        Meme.getAll().then((memes) => {
            //            console.log(memes)
            User.getEmail(req.cookies.user).then((user) => {
                req.session.username = user.name
                req.session.limit = 1
                res.render("home", {
                    //user: req.session.username,
                    user: user.name,
                    memes,
                    limit: 1
                })
            })

        })

    } else {
        res.render("index")
    }
})

router.get("/about", function (req, res) {
    console.log("GET /about")
    if (req.session.username) {
        res.render("about", {
            user: req.session.username
        })

    }
})

module.exports = router
