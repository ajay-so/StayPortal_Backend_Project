const express = require("express");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")
const router = express.Router({mergeParams : true});


router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { username, gmail, password } = req.body;
        const newUser = new User({username, gmail});
        const registerduser = await User.register(newUser, password);
        req.login(registerduser,(err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to StayHub!")
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
});

router.post("/login",saveRedirectUrl, passport.authenticate("local", 
    { failureRedirect: '/login',failureFlash: true }),
    async (req, res) => {
        req.flash("success", "Welcome back to the StayHub");
        const redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);  
});

router.get("/logout", (req, res, next)=>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!")
        res.redirect("/listings");
    })
})

module.exports = router;