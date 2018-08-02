const express = require("express");
const hbs = require("hbs");
const bodyparser = require("body-parser");
const session = require("express-session");
const path = require("path");
const cookieparser = require("cookie-parser");

const app = express();
const urlencoder = bodyparser.urlencoded({
    extended: false
})

/** Temporary in place of database **/
var users = []
var User = function (name, email, password, description) {
    this.name = name
    this.email = email
    this.password = password
    this.description = description
}

users.push(new User("Angelo", "angelo_ablaza@dlsu.edu.ph", "webapde", "I love cookies"))
users.push(new User("Joey", "jose_vicente_sayson@dlsu.edu.ph", "webapde", "I love girls"))
users.push(new User("Cho", "won_suk_cho@dlsu.edu.ph", "webapde", "I love webapde"))
/** Temporary **/

app.set("view engine", "hbs");

app.use(cookieparser());
app.use(express.static(path.join(__dirname))) //so we can access outside folders 
app.use(session({
    secret: "ultra secret",
    name: "mega secret",
    resave: "true",
    saveUninitialized: true,
    cookie: {
        maxAge: 10000 * 60 * 60 * 24 * 7 * 3
    }
}))

app.get("/about", function (req, res) {
    console.log("GET /about")
    //    res.sendFile(path.join(__dirname, "about.html"))
    res.render("about.hbs", {
        user: req.session.username
    })
})

app.get("/home", function (req, res) {
    console.log("GET /home")
    res.render("home.hbs", {
        user: req.session.username
    })
})

app.post("/signup", urlencoder, function (req, res) {
    console.log("POST /signup")
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password
    var description = req.body.description
    users.push(new User(name, email, password, description))
    req.session.username = email

    console.log(users)
    res.render("home.hbs", {
        user: req.session.username
    })
})

app.post("/login", urlencoder, function (req, res) {
    console.log("POST /login")

    var email = req.body.email
    var password = req.body.password
    console.log(email)
    console.log(password)

    var check = users.filter((a) => {
        return (email == a.email && password == a.password)
    })

    if (check.length == 1) {
        req.session.username = email
        res.render("home.hbs", {
            user: req.session.username
        })
    }
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
    });
    res.render("index.hbs")
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
