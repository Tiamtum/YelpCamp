const Campground = require("../models/campground");
const User = require("../models/user");
const cloudinary = require('cloudinary').v2;

module.exports.campgroundIndex = async (req,res)=>{  
    const campgrounds = await Campground.find({}).sort({_id: -1 });
    if(campgrounds)
    {
        const descriptions = []
        campgrounds.forEach((campground,idx)=>{
            const rawText = campground.description.split(" ");
            const defaultDescription = []
            rawText.forEach(string=>{
                if(string!=="")
                {
                    defaultDescription.push(string);
                }
            })
            if(campground.description.length>360){
                const shortenedDescription = []
                for(let i=0; i<Math.floor(defaultDescription.length/2); i++) //not perfect. should scale to size up to maximum; need to track character count on client end somehow 
                {
                    shortenedDescription.push(defaultDescription[i]);
                }
                descriptions.push(shortenedDescription)
            }
            else
            {
                descriptions.push(defaultDescription)
            }
        })
        res.render("campgrounds/index",{campgrounds,descriptions,pageTitle:"Campgrounds"});        
    }
    else
    {
        res.render("campgrounds/index",{pageTitle:"Campgrounds"});
    }
}

module.exports.renderNewCampgroundForm = (req,res)=>{   
    res.render("campgrounds/new",{pageTitle:"New Campground"});
}

module.exports.createCampground = async (req,res)=>{
    const userLatLong = req.body.campground.latLong;
    const commaIndex = userLatLong.indexOf(",");
    const latitude = userLatLong.substring(0,commaIndex).trim();
    const longitude = userLatLong.substring(commaIndex+1).trim(); 
    const geoData = {
        type: "Point",
        coordinates: [longitude,latitude]
    }
    const campground = new Campground(req.body.campground); 
    campground.geometry = geoData;
    campground.images = req.files.map(file => ({url: file.path, filename: file.filename}));
    campground.author = req.user._id;  
    campground.latLong = userLatLong; 
    await campground.save();
    req.flash("success","Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req,res)=>{         
    const campground = await Campground.findById(req.params.id)
    .populate({ //nested populate in order to find review authors. https://mongoosejs.com/docs/populate.html#populate_multiple_documents
        path: "reviews",
        populate:{
            path: "author",
        }
    })
    .populate("author"); //campground author
    if(campground)
    {
        const profileImages=[];
        for(review of campground.reviews)
        {
           const user = await User.findById(review.author._id);
           profileImages.push(user.profileImage.reviewPic);
        }
        res.render("campgrounds/show",{campground,profileImages, pageTitle:`${campground.title}`,loadStarCSS:true});
    }
    else
    {
        req.flash("error","Can not find that campground.");
        res.redirect("/campgrounds");
    }   
}

module.exports.renderEditForm = async (req,res)=>{ 
    const campground = await Campground.findById(req.params.id);
    console.log(campground);
    if(!campground)
    {
        req.flash("error","Can not find that campground.");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit",{campground,pageTitle:"Edit Campground"});
}

module.exports.updateCampground = async (req,res) => {
    const userLatLong = req.body.campground.latLong;
    const commaIndex = userLatLong.indexOf(",");
    const latitude = userLatLong.substring(0,commaIndex).trim();
    const longitude = userLatLong.substring(commaIndex+1).trim(); 
    const geoData = {
        type: "Point",
        coordinates: [longitude,latitude]
    }
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground},{useValidators:true})
    const images = req.files.map(file => ({url: file.path, filename: file.filename}));
    campground.images.push(...images);
    campground.geometry = geoData;
    campground.latLong = userLatLong; 
    await campground.save();
    if(req.body.deleteImages)
    {
        for(filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename); //delete from cloudinary
        }
        await campground.updateOne(
            {$pull: 
                {images: 
                    {filename:
                        {$in: req.body.deleteImages} //delete from mongo
                    }
                }
        });
    }
    req.flash("success","Successfully updated campground!");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.destroyCampground = async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}