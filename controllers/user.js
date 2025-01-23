const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signUpRoute = async (req, res) => {
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.loginUser = async (req, res) => {
    req.flash("success",`Welcome back to the StayHub`);
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);  
}

module.exports.logOutUser = (req, res, next)=>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!")
        res.redirect("/listings");
    })
}