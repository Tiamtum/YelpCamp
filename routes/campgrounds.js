//IMPLEMENT LAZY-LOADING IMAGES

const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,clearOriginalUrl,validateCampground,isCampgroundAuthor} = require("../middleware");
const router = express.Router({mergeParams:true});
const campgrounds= require("../controllers/campgrounds");
const multer  = require('multer');
const {storage} = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
    .get(clearOriginalUrl, wrapAsync(campgrounds.campgroundIndex ))
     .post( isLoggedIn,upload.array("image"), validateCampground, wrapAsync(campgrounds.createCampground)); //FIX THIS LATER: validateCampground should not come after upload.array
 
router.get("/new", isLoggedIn , campgrounds.renderNewCampgroundForm);
router.get("/:id/edit", isLoggedIn, isCampgroundAuthor, wrapAsync(campgrounds.renderEditForm));    

router.route("/:id")
    .get(wrapAsync(campgrounds.showCampground))
    .put(isLoggedIn, isCampgroundAuthor,upload.array("image"), validateCampground, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isCampgroundAuthor,  wrapAsync(campgrounds.destroyCampground));

module.exports = router;