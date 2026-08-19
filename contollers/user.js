const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try
    {
        let {name, email, username, password} = req.body;
        req.login(await User.register(new User({name, email, username}), password), (err) => {
            if(err)
            {
                return next(err);
            }
            req.flash("success", `Welcome to WanderLust ${username}`);
            res.redirect("/listings");
        });
    }
    catch(err)
    {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    let {username} = req.body;
    req.flash("success", `Welcome Back ${username}`);
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err)
        {
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    })
};

module.exports.profile = (req, res) => 
{
    res.render("users/profile.ejs");
}