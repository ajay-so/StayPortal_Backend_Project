const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const listingController = require("../controllers/listing.js")
const { isLoggedin,isOwner,validateListing } = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })
const router = express.Router();

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

// new route
router.get("/new",isLoggedin, listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.patch(isLoggedin,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedin,isOwner, wrapAsync(listingController.destroy));

// edit route
router.get("/:id/edit",isLoggedin, wrapAsync(listingController.renderEditForm));

module.exports = router;