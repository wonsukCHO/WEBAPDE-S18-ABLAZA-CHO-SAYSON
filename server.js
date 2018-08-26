const express = require("express");
const hbs = require("hbs");
const bodyparser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose"); //ORM
const path = require("path");
const crypto = require("crypto")
const cookieparser = require("cookie-parser");
const User = require("./models/user")
const Meme = require("./models/meme")
const Tag = require("./models/tag")

const app = express()
const urlencoder = bodyparser.urlencoded({
    extended: false
})

var current_user //global variable to dictate the current user in session
var limit = 1

app.set("view engine", "hbs");

hbs.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
        return options.fn(this)
    }
    return options.inverse(this)
})

hbs.registerHelper('displayUser', function(block) {
    return current_user.name; //just return global variable value
})

hbs.registerHelper('each_upto', function(ary, max, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    for(var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
})

app.use(express.static(path.join(__dirname, "public"))) //so we can access outside folders 
app.use(cookieparser());
app.use(session({
    secret: "ultra secret",
    name: "WEBAPDE secret",
    resave: "true",
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 3
    }
}))

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/userdata", {
    useNewUrlParser: true
})

//mongoose.connect("mongodb://angelo:webapde4@ds131942.mlab.com:31942/userdata", {
//    useNewUrlParser: true
//})

app.use(require("./controllers"))


app.listen(3000, function () {
    console.log("Hello! Now listening at port 3000")
})


//app.get("/about", function (req, res) {
//    console.log("GET /about")
//    res.render("about.hbs", {
//        user: current_user.name
//    })
//})
//
//app.get("/home", function (req, res) {
//    console.log("GET /home")
//    //    res.render("home.hbs", {
//    //        user: req.session.username
//    //    })
//    res.redirect("/");
//})
//
//app.post("/postMeme", urlencoder, function(req, res){
//    console.log("POST /postMeme")
//    var title = req.body.title
//    var owner = req.session.username
//    var image = req.body.link  //link to image
//    var tags = (req.body.tags).trim().split(",")
//    var type = req.body.type
//    var tagged = (req.body.users).trim().split(",")
//    
//    var meme = new Meme({
//        title,
//        owner,
//        image,
//        tags,
//        type,
//        upvotes: 0,
//        downvotes: 0
//    })
//    
//    console.log(meme)
//    meme.save().then(() => {
////        res.redirect("/")
//        res.redirect("/")
//    },(err)=>{
//        console.log(err)
//    } )
//    
//})
//
//app.post("/editMeme", urlencoder, function(req, res) {
//    console.log("POST /editMeme")
//    
//    var updatedMeme = { 
//        title : req.body.title,
//        tags: (req.body.tags).split(","),
//        type : req.body.type
//    }
//    console.log(updatedMeme)
//    Meme.findOneAndUpdate({
//        _id : req.body.id
//    }, updatedMeme).then(()=>{
//        res.redirect("/")
//    })
//})
//
//app.post("/deleteMeme", urlencoder, function(req, res){
//    console.log("POST /deleteMeme")
//    
//    Meme.remove({
//        _id: req.body.id
//    }).then(()=>{
//        res.redirect("/")
//    })
//})
//
//app.post("/upvoteMeme", urlencoder, function(req, res){
//    console.log("POST /upvoteMeme")
//    
//    Meme.findOneAndUpdate({
//        _id : req.body.id
//    }, { $inc: {upvotes: 1} }).then(()=>{
//        res.redirect("/")
//    })
//    
//})
//
//app.post("/downvoteMeme", urlencoder, function(req, res){
//    console.log("POST /downvoteMeme")
//    
//    Meme.findOneAndUpdate({
//        _id : req.body.id
//    }, { $inc: {downvotes: 1} }).then(()=>{
//        res.redirect("/")
//    })
//    
//})
//
//app.post("/signup", urlencoder, function (req, res) {
//    console.log("POST /signup")
//    var name = req.body.name
//    var email = req.body.email
//    var password = req.body.password
//    var description = req.body.description
//	
//	var hashedpassword = crypto.createHash("md5").update(password).digest("hex")
//    console.log(hashedpassword)
//    
//    User.findOne((user) => {
//        email: req.body.email
//    }).then(() => {
//        if(user){
//            res.render("index.hbs", {
//                register_error: true
//            })
//        } else{
//            var user = new User({
//                name,
//                email,
//                password: hashedpassword,
//                description
//            })
//        
//            console.log(user)
//            req.session.username = user.email
//            current_user = user //gets the User Objects
//
//            //processing
//            user.save().then(() => {
//                res.redirect("/")
//            }, (err) => {
//                res.render("index.hbs")
//            })
//        }
//       
//    })
//
//})
//
//app.get("/search", urlencoder, function (req, res) {
//    console.log("GET /search")
//
//    var query = req.query.search_item
//    
//    Meme.find({ $or: [{tags: query}, {title: query}] }).then((memes)=>{
//        res.render("tags.hbs", {
//            user: current_user.name,
//            tags: query,
//            memes
//        })
//    })
//
//})
//
//app.post("/login", urlencoder, function (req, res) {
//    console.log("POST /login")
//    var hashed = crypto.createHash("md5").update(req.body.password).digest("hex")
//    
//    User.findOne({
//        email: req.body.email,
//        password: hashed
//    }).then((user) => {
//        if(user){
//            current_user = user
//            console.log(current_user)
//            req.session.username = current_user.email
//            if(req.body.remember){
//                res.cookie("user", current_user.email, {
//                    maxAge: 1000 * 60 * 60 * 24 * 7 * 3
//                })
//            } else {
//                res.cookie("user", current_user.email, {
//                    maxAge: 1000 * 60 * 60 * 24 
//                })
//            }
//            res.redirect("/")
//        } else{
//            res.render("index.hbs", {
//                login_error: true
//            })
//        }
//    }) //then
//})
//
//
//
//app.get("/logout", (req, res) => {
//    console.log("GET /logout")
//    console.log("User " + req.session.username + " logged out")
//    res.clearCookie("user") //temp 
//    req.session.destroy((err) => {
//        if (err) {
//            console.log(err)
//        } else {
//            console.log("Succesfully destroyed session")
//        }
//    })
//    res.render("index.hbs")
//})
//
//app.get("/profile", urlencoder, (req, res) => {
//    //var username = req.query.username
//    //user = users.find((a)=>(username == a.name)) //if we use filter -> add [0] to user in render
//
//    console.log(current_user)
//    Meme.find({owner: current_user.email}).then((memes)=>{
//        res.render("profile.hbs", {
//            user: current_user.name,
//            name: current_user.name,
//            uname: current_user.email,
//            bio: current_user.description,
//            memes
//        })
//    })
//})
//
//app.get("/user", urlencoder, function (req, res){
//    console.log("GET /user")
//    console.log(req.query.other_user)
//    
//    User.findOne({
//        email: req.query.other_user
//    }).then((user)=>{
//        Meme.find({owner: user.email}).then((memes)=>{
//            res.render("profile.hbs", {
//                user: current_user.name,
//                name: user.name,
//                uname: user.email,
//                bio: user.description,
//                memes
//            })
//        })
//    })
//    
//})
//
//app.get("/more", function (req, res) {
//    console.log("GET /more")
//    limit = limit + 5
//    if (req.session.username) {
//        Meme.find().then((memes)=>{
//            res.render("home.hbs", {
//                user: current_user.name,
//                memes,
//                limit
//            })
//        })        
//    } else {
//        res.render("index.hbs")
//    }
//
//})
//
//app.get("/", function (req, res) {
//    console.log("GET /")
//    if (req.session.username) {
//        Meme.find().then((memes)=>{
//            res.render("home.hbs", {
//                user: current_user.name,
//                memes,
//                limit
//            })
//        })        
//    } else {
//        res.render("index.hbs")
//    }
//
//})

