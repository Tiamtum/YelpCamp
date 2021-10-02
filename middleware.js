const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");
const User = require("./models/user");
const {campgroundSchema,reviewSchema,userSchema,userSchemaRegister} = require("./schemas");

module.exports.isLoggedIn = (req,res,next) =>{
    //the session stores the serialized user 

    if(req.isAuthenticated())
    {
        next();
    }
    else
    {
        //we want to store the url the user is requesting, so that if they are not logged in and are 
        //trying to access a page that requires it, we can redirect them back to the page they were requesting.
        //req.session.returnTo = req.originalUrl; //BUGGED
        const url = req.originalUrl;
        const problemRouteIndex = url.indexOf("reviews");
        if(problemRouteIndex !== -1)
        {
            const newUrl = url.slice(0,problemRouteIndex);
            req.session.returnTo = newUrl;
        }
        else
        {
            req.session.returnTo = url;
        }
        req.flash("error","You must be signed in to make a new campground.");
        res.redirect("/login");
    }
}

module.exports.isUser = async (req,res,next)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    if(user._id.equals(req.user._id))
    {
        next();
    }
    else
    {
        req.flash("error","You do not have permission to do that.")
        res.redirect(`/profile/${id}`);
    }

}

//Clear the returnTo variable; may or may not be a reliable fix! Testing required.
module.exports.clearOriginalUrl = (req,res,next)=>{
    delete req.session.returnTo;
    next();
}

//validation middleware for campground data
module.exports.validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(element => element.message).join(",");
        throw new ExpressError(msg,400);
    }
    else
    {
        next();
    }
}

//validation middleware for review data
module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(element => element.message).join(",");
        throw new ExpressError(msg,400);
    }
    else
    {
        next();
    }
}
//validation middleware for user data
module.exports.validateUser = (req,res,next)=>{
    const {error} = userSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(element => element.message).join(",");
        throw new ExpressError(msg,400);
    }
    else
    {
        next();
    }
}
module.exports.validateRegistration = (req,res,next)=>{
    const {error} = userSchemaRegister.validate(req.body,{allowUnknown:true}); //allowUnknown - when true, allows object to contain unknown keys which are ignored. Defaults to false.
    if(error)
    {
        const msg = error.details.map(element => element.message).join(",");
        throw new ExpressError(msg,400);
    }
    else
    {
        next();
    }
}
//authorization middleware for campground
module.exports.isCampgroundAuthor = async (req,res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(campground.author.equals(req.user._id))
    {
        next();
    }
    else
    {
        req.flash("error","You do not have permission to do that.");
        res.redirect(`/campgrounds/${id}`);
    }
}

//authorization middleware for review 
module.exports.isReviewAuthor = async (req,res,next) => {
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(review.author.equals(req.user._id))
    {
        next();
    }
    else
    {
        req.flash("error","You do not have permission to do that.");
        res.redirect(`/campgrounds/${id}`);
    }    
}

