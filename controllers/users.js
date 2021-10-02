const User = require("../models/user");
const Campground = require("../models/campground");
const Review = require("../models/review");
const cloudinary = require('cloudinary').v2;

module.exports.renderRegisterForm = (req,res)=>{
    if(req.isAuthenticated())
    {
        return res.redirect("/campgrounds");
    }
    res.render("users/register",{pageTitle:"Register"});
}

//fix the wrapAsync/try-catch redundency
module.exports.createUser = async (req,res,next)=>{
    try{
        const {email,username,password} = req.body;
        const date = new Date().toISOString();
        const user = new User({email,username,age:"",from:"",about:"",createdAt:date,updatedAt:date, profileImage:{url:"https://res.cloudinary.com/doq4wcsuk/image/upload/v1630880562/YelpCamp/defaultProfileImage.jpg",filename:"default"}});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,error=>{
            if(error)
            {
                return next(error);
            }
            req.flash("success",`Welcome to YelpCamp, ${username}!`);
            res.redirect("/campgrounds");
        })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("register");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    if(req.isAuthenticated())
    {
        return res.redirect("/campgrounds");
    }
    res.render("users/login",{pageTitle:"Login"});
}

module.exports.loginUser = (req,res)=>{
    req.flash("success","Welcome back!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo; //clear session to avoid login-redirect bug
    res.redirect(redirectUrl);
} 

module.exports.logoutUser = (req,res)=>{
    req.logout();
    req.flash("success","Successfully logged out.");
    res.redirect("/campgrounds");
}

module.exports.renderProfileIndex = async (req,res)=>{
     const {id} = req.params;
     const user = await User.findById(id);
     const campgrounds = await Campground.find({author:id})
     .populate({    
        path:"reviews",
        match:{author:id} 
    })
    const reviews = await Review.find({author:id}).sort({_id: -1 })
    .populate("author","username").populate("campground","title");

    res.render("users/index",{campgrounds,reviews,user, pageTitle:"Profile"});  
}

module.exports.renderProfileEditForm = async (req,res)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    res.render("users/edit",{user,pageTitle:"Edit Profile"});
}

module.exports.updateProfile = async (req,res)=>{
    const {id} = req.params;

    const user = await User.findByIdAndUpdate(id,{...req.body.user},{useValidators:true})
    if(user.profileImage.filename==="default")
    {
        user.profileImage.url = req.file.path;
        user.profileImage.filename = req.file.filename;
    }

    await user.save();
    req.flash("success","Successfully updated profile!");
    res.redirect(`/profile/${user._id}`);
    
}

module.exports.renderDeleteForm = async (req,res)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    res.render("users/delete",{user,pageTitle:"Delete Account"});
}

module.exports.destroyUser = async (req,res)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    const filename = user.profileImage.filename;
    if(filename!=="default")
    {
        await cloudinary.uploader.destroy(filename);  
    }
    await User.findByIdAndDelete(id);
    req.flash("success","Your account has been deleted.");
    res.redirect("/campgrounds");
}