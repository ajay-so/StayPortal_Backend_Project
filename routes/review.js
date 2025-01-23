const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const reviewController = require("../controllers/review.js")
const { validateReview, isLoggedin,isReviewAuthor } = require("../middleware.js")
const router = express.Router({mergeParams : true});


// post route review 
router.post("/",isLoggedin,validateReview, wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isLoggedin,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;