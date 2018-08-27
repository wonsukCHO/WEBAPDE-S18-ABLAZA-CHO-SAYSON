/*

Controllers folder should contain all routes dedicated to the particular document
Controllers should not directly access and manipulate the db, it should access the models folder files

*/
const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bodyparser = require("body-parser")
const auth = require("../middlewares/auth")
const Meme = require("../models/meme")

const app = express()

const urlencoder = bodyparser.urlencoded({
    extended: true
})

router.use(urlencoder)

// localhost:3000/user/register
router.post("/signup", (req, res) => {
    console.log("POST /user/signup")
    var user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        description: req.body.description
    }

    User.create(user).then((user) => {
        console.log("successful " + user)
        req.session.username = user.name
        req.session.limit = 3
        res.cookie("user", user.email, { //default 1 day
            maxAge: 1000 * 60 * 60 * 24
        })
        Meme.getAll().then((memes) => {
            res.render("home", {
                user: req.session.username,
                memes,
                limit: req.session.limit
            })
        })
    }, (error) => {
        res.render("index", {
            register_error: true
        })
    })

})

// localhost:3000/user/login
router.post("/login", (req, res) => {
    console.log("POST /user/login")
    let user = {
        username: req.body.email,
        password: req.body.password
    }
    console.log("post login " + req.body.email)
    console.log("post login " + user)

    User.authenticate(user).then((newUser) => {
        console.log("authenticate " + newUser)
        if (newUser) {
            req.session.username = newUser.name
            req.session.limit = 3
            if (req.body.remember) {
                res.cookie("user", newUser.email, {
                    maxAge: 1000 * 60 * 60 * 24 * 7 * 3
                })

            } else {
                res.cookie("user", newUser.email, {
                    maxAge: 1000 * 60 * 60 * 24
                })
            }

            Meme.getAll().then((memes) => {
                res.render("home", {
                    user: newUser.name,
                    memes,
                    limit: req.session.limit
                })
                //                res.redirect("/")
            })
        }
    }, (error) => {
        res.render("index", {
            login_error: true,
            limit: 3
        })
    })
})

router.get("/logout", (req, res) => {
    console.log("GET user/logout")
    console.log("User " + req.session.username + " logged out")
    res.clearCookie("user") //temp 
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Succesfully destroyed session")
        }
    })
    res.redirect("/")
})

router.get("/profile", (req, res) => {
    console.log("GET user/profile")
    if (req.session.username) {
        User.get(req.session.username).then((user) => {
            res.render("profile", {
                user: user.name,
                name: user.name,
                uname: user.email,
                bio: user.description,
                memes: user.memes
            })
        })

        //Plan B
//        User.get(req.session.username).then((user) => {
//            Meme.getUserMemes(req.cookies.user).then((memes) => {
//                res.render("profile", {
//                    user: user.name,
//                    name: user.name,
//                    uname: user.email,
//                    bio: user.description,
//                    memes: memes
//                })
//            })
//
//        })
    } else {
        res.render("index", {
            signup_first: true
        })
    }
})

router.get("/account", (req, res) => {
    console.log("GET user/account")
    User.getEmail(req.query.other_user).then((user) => {
        if (user.name == req.session.username) {
            res.redirect("../user/profile")
        } else {
            var posts = []
            user.memes.forEach((a) => {
                if (a.type === "Public" || a.tagged.includes(req.cookies.user)) {
                    posts.push(a)
                }
            })
            if (req.session.username == null) {
                res.render("sideProfile", {
                    user: "Guest",
                    name: user.name,
                    uname: user.email,
                    bio: user.description,
                    memes: posts
                })
            } else if (user.name != req.session.username) {
                res.render("sideProfile", {
                    user: req.session.username,
                    name: user.name,
                    uname: user.email,
                    bio: user.description,
                    memes: posts
                })
            }
        }
    })
})
// always remember to export the router for index.js
module.exports = router
