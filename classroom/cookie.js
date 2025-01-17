const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
// const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");

// ---------------------------These all are the part of express-session package-----------------------------
//this is the flash message call
app.use(flash());

app.use(session(
    {
        secret: "mysecretcode",
        resave: false,
        saveUninitialized: true
    }
));

// this is a middleware it is use to every route
app.use((req, res, next) =>{
    res.locals.messages = req.flash("success");
    res.locals.messages = req.flash("error");
    next();
})

//this is for start the express server
app.listen(3030, () => {
    console.log("app is listening on 3030")
});

//this is the home route
app.get("/",(req , res) =>{
    res.send("this is the home route");
});

//this route for count the user session how many req and res are created by the user
app.get("/test", (req, res) => {
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`you sent the request ${req.session.count} times`);
});

//This route is for add the new key and we also say little bit of information in the req.session and also set the flash message like there key and also the content what is the display on the page
app.get("/register", (req , res) =>{
    const { name = "anonymous" } = req.query;
    req.session.name = name;
    if(name == "anonymous"){
        req.flash("error", "User not registered");
    }else{
        req.flash("success", "New user is register");
    }
    
    res.redirect("/hello");
});

//this route is for access the information about the req.session
app.get("/hello", (req , res) =>{
    res.render("./page.ejs", {name : req.session.name });
})

//---------------------------------These all are the part of cookie-parser-----------------------------------

// app.use(cookieParser("secretcode"));

// // this route for print the all the cookies in console
// app.get("/",(req, res) =>{
//     console.dir(req.cookies);
//     res.send("this is the home route")
// })

////this route is created by the use of send the cookies to the server usering the (res.cookies)
// app.get("/cookies",(req, res) =>{
//     res.cookie("name", "ajay");
//     res.send("this is the cookie route")
// })

//// this route is use for signed the cookie means the server automatically parse the cookies
// app.get("/signedcookies",(req, res) =>{
//     res.cookie("made-in", "india",{signed : true});
//     res.send("cookie was send");
// })

//// this route is for the access the cookies in console
// app.get("/verify",(req, res) =>{
//     console.log(req.signedCookies);
//     res.send("verifyied");
// })