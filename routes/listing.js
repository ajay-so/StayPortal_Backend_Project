const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");

const { isLoggedin,isOwner,validateListing } = require("../middleware.js");

const router = express.Router();

// all listing route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// new route
router.get("/new",isLoggedin, (req, res) => {
    res.render("listings/new.ejs");
})

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing is not exists");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs", { listing });
    }
}));

// create a new listing route
router.post("/",isLoggedin, validateListing, wrapAsync(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings")
}
));

// edit route
router.get("/:id/edit",isLoggedin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    req.flash("success", "Listing Edited");
    res.render("listings/edit.ejs", { listing });
}));

//update route
router.patch("/:id",isLoggedin,isOwner, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!req.body.listing) {
        throw new ExpressError(400, "please send the valid data for listing")
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect("/listings");
}));

// delete route
router.delete("/:id",isLoggedin,isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings")
}));

module.exports = router;