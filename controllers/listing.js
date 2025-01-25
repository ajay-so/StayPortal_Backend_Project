const Listing = require("../models/listing.js");
const axios = require("axios");


const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing is not exists");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", { listing });
    }
}

module.exports.createListing = async (req, res, next) => {
    try {
        const q = req.body.listing.location;
        const format = 'geojson';
        const endpoint = `https://nominatim.openstreetmap.org/search?q=${q}&format=${format}&limit=1`;
        const url = req.file.path;
        const filename = req.file.filename;
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;
        newlisting.image = { url, filename };
        const apiResponse = await axios.get(endpoint);
        if (apiResponse.data.features && apiResponse.data.features.length > 0) {
            newlisting.geometry = apiResponse.data.features[0].geometry;
        } else {
            req.flash('error', 'Location not found!');
            return res.redirect('/listings/new');
        }
        await newlisting.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings")
    } catch (err) {
        console.error('Error creating listing:', err.message);
        req.flash('error', 'Something went wrong while creating the listing. Please try again.');
        res.redirect('/listings/new');
    }
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    
    let listing = await Listing.findById(id);

    req.flash("success", "Listing Edited");
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params; 
        const q = req.body.listing.location; 
        const format = 'geojson';
        const endpoint = `https://nominatim.openstreetmap.org/search?q=${q}&format=${format}&limit=1`;
        if (!req.body.listing) {
            throw new ExpressError(400, "Please provide valid data for the listing.");
        }
        const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

        if (!listing) {
            req.flash('error', 'Listing not found.');
            return res.redirect('/listings');
        }

        const apiResponse = await axios.get(endpoint);
        if (apiResponse.data.features && apiResponse.data.features.length > 0) {
            listing.geometry = apiResponse.data.features[0].geometry; 
        } else {
            req.flash('error', 'Location not found! Please provide a valid location.');
            return res.redirect(`/listings/${id}/edit`);
        }

        if (req.file) {
            const url = req.file.path;
            const filename = req.file.filename;
            listing.image = { url, filename };
        }
        await listing.save();
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect(`/listings/${id}/edit`);
    }
};

module.exports.destroy = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted");
    res.redirect("/listings")
}

module.exports.renderSearchForm = async (req, res) => {
    try {

        const { country } = req.query;

        if (!country) {
            req.flash("error", "Please provide a country to search for.");
            return res.redirect("/listings");
        }

        const lower = country.toLowerCase();
        const upper = country.toUpperCase();
        const capitalized = country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();

        const findCountryListings = await Listing.find({ $or: [{ country: lower }, { country: upper }, { country: capitalized }] });

        if (findCountryListings.length > 0) {
            res.render("listings/country.ejs", { findCountryListings });
        } else {
            req.flash("error", `No one listings for this country`);
            res.redirect("/listings");
        }

    } catch (err) {
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/listings");
    }
};

