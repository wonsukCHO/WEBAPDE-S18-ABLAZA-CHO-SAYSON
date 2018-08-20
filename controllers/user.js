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
        req.session.username = user.username
        res.render("home", {
            user: user.name
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
                    //          posts
                    user: newUser.name,
                    memes
                })
            })
        }
    }, (error) => {
        res.render("index", {
            login_error: true
        })
    })
})

router.get("/logout", (req, res) => {
    console.log("GET user/logout")
    console.log("User " + req.session.username + " logged out")
    //    res.clearCookie("user") //temp 
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Succesfully destroyed session")
        }
    })
    res.redirect("/")
})

// always remember to export the router for index.js
module.exports = router