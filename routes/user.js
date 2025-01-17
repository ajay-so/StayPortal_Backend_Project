const express = require("express");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const router = express.Router({mergeParams : true});

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { username, gmail, password } = req.body;
        const newUser = new User({
            username,
            gmail
        });
        await User.register(newUser, password);
        req.flash("success", "Welcome to StayHub!")
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
});

router.post("/login", passport.authenticate("local", 
    { failureRedirect: '/login',failureFlash: true }),
    (req, res) => {
        req.flash("success", "Welcome back to the StayHub");
        res.redirect("/listings");
})

module.exports = router;