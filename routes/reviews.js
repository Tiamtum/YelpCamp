const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware");

const router = express.Router({mergeParams:true}); //enables params to carry over from index

const reviews = require("../controllers/reviews");

router.post("/",isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviews.destroyReview));

module.exports = router;