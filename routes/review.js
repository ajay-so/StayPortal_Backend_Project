const express = require("express");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const { validateReview } = require("../middleware.js")
const router = express.Router({mergeParams : true});



// review route
// post route
router.post("/",validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;
    let listing = await Listing.findById(id);
    let newReview = new Review(review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
}));

// delete review route
router.delete("/:reviewId", wrapAsync(async(req , res) =>{
const { id , reviewId } = req.params;
await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
await Review.findByIdAndDelete(reviewId);
req.flash("success", "Review Deleted");
res.redirect(`/listings/${id}`);
}));

module.exports = router;