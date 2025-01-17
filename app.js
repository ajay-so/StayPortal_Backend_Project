const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");

const Session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('./models/user.js');

const app = express();
const port = 8080;

//set the middlewares
app.set("view engine", "ejs");
app.engine('ejs', ejsmate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Error handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("./layouts/error.ejs", { status, message });
});

//this is for connected with mongodb
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/stayhub');
}

//call the main function
main().then(() => {
    console.log("db is connected");
}).catch(err => {
    console.log(err);
})

//this is for start the server
app.listen(port, (req, res) => {
    console.log(`app is listining on ${port}`)

});

// home route
app.get("/", (req, res) => {
    res.send("this is the home root");
});

const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}

app.use(Session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req ,res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// app.get("/demouser", async(req , res) => {
//     const fakeuser = new User({
//         gmail : "ajay@123",
//         username : "Ajay",
//     });
//     let registeruser = await User.register(fakeuser , "ajay123");
//     res.send(registeruser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// for the wrong route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
})

// error route
app.use((err, req, res, next) => {
    const { status = 500, message = "error is occupied" } = err;
    res.render("./layouts/error.ejs", { status, message });
});
