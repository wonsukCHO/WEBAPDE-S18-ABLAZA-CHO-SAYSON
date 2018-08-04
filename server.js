const express = require("express");
const hbs = require("hbs");
const bodyparser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose"); //ORM
const path = require("path");
const cookieparser = require("cookie-parser");
const User = require("./model/user").User
const Meme = require("./model/meme").Meme

const app = express()
const urlencoder = bodyparser.urlencoded({
    extended: false
})

var current_user
/** Temporary in place of database **/
//var users = []
//var User = function (name, email, password, description) {
//    this.name = name
//    this.email = email
//    this.password = password
//    this.description = description
//}
//users.push(new User("Angelo", "angelo_ablaza@dlsu.edu.ph", "webapde", "I love cookies"))
//users.push(new User("Joey", "jose_sayson@dlsu.edu.ph", "webapde", "I love girls"))
//users.push(new User("Cho", "won_suk_cho@dlsu.edu.ph", "webapde", "I love webapde"))
/** Temporary **/

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname))) //so we can access outside folders 
app.use(cookieparser());
app.use(session({
    secret: "ultra secret",
    name: "mega secret",
    resave: "true",
    saveUninitialized: true,
    cookie: {
        maxAge: 10000 * 60 * 60 * 24 * 7 * 3
    }
}))

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/userdata", {
    useNewUrlParser : true
})

app.get("/about", function (req, res) {
    console.log("GET /about")
    res.render("about.hbs", {
        user: current_user.name
    })
})

app.get("/home", function (req, res) {
    console.log("GET /home")
//    res.render("home.hbs", {
//        user: req.session.username
//    })
    res.redirect("/");
})

app.post("/signup", urlencoder, function (req, res) {
    console.log("POST /signup")
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password
    var description = req.body.description
    
    var user = new User({
        name, email, password, description
    
    })
    console.log(user)
    req.session.username = user.name
    current_user = user //gets the User Object
    
    //processing
    user.save().then(()=>{
        res.render("home.hbs", {
            user: req.session.username
        })
    }, (err)=>{
        res.render("index.hbs")
    })
    
})

//app.post("/signup", urlencoder, function (req, res) {
//    console.log("POST /signup")
//    var name = req.body.name
//    var email = req.body.email
//    var password = req.body.password
//    var description = req.body.description
//    users.push(new User(name, email, password, description))
//    var user = users.find((a)=>(name == a.email))
//    req.session.username = user.name
//
//    res.render("home.hbs", {
//        user: user.name
//    })
//    
//    
//
////    console.log(users)
//    
//})

app.post("/login", urlencoder, function (req, res) {
    console.log("POST /login")
//    var user = users.find((a)=>(req.body.email == a.email))
//    var email = req.body.email
//    var password = req.body.password
    User.findOne({
        email: req.body.email,
        password: req.body.password
    }).then((user)=>{
        current_user = user
        req.session.username = current_user.name
        res.render("home.hbs", {
            user: user.name
        })
    })
    
//    console.log(email)
//    console.log(password)

//    var check = users.filter((a) => {
//        return (email == a.email && password == a.password) //returns an array
//    })
//
//    if (check.length == 1) { //if array length is 1 that means only 1 match
//        req.session.username = user.name
//        res.render("home.hbs", {
//            user: req.session.username
//        })
//    }
    
})

app.post("/search", urlencoder, function (req, res) {
    console.log("POST /search")

    var query = req.body.query
    switch (query) {
        case "normie":
            res.sendFile(path.join(__dirname, "tags-normie.html"))
            break
        case "justright":
            res.sendFile(path.join(__dirname, "tags-justright.html"))
            break
        case "dank":
            res.sendFile(path.join(__dirname, "tags-dank.html"))
            break
        default:
            console.log("No results returned")
    }
})

app.get("/logout", (req, res) => {
    console.log("GET /logout")
    console.log("User " + req.session.username + " logged out")

    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Succesfully destroyed session")
        }
    })
    res.render("index.hbs")
})

app.get("/profile", urlencoder, (req, res)=>{
    var username = req.session.username
//    user = users.find((a)=>(username == a.name)) //if we use filter -> add [0] to user in render
    
    console.log(current_user)
    
    res.render("profile.hbs", {
        name: current_user.name,
        uname: current_user.email,
        bio: current_user.description
    })
    
})

app.get("/", function (req, res) {
    console.log("GET /")
    if (req.session.username) {
        res.render("home.hbs", {
            user: req.session.username
        })
    } else {
        res.render("index.hbs")
    }

})

app.listen(3000, function () {
    console.log("Hello! Now listening at port 3000")
})
