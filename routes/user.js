const express = require("express");
const userController = require("../controllers/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")
const router = express.Router({mergeParams : true});

router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signUpRoute))

router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login',failureFlash: true }),userController.loginUser)

router
.route("/logout")
.get(userController.logOutUser);


module.exports = router;