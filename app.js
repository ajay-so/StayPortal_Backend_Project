const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.engine('ejs', ejsmate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Error handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("./layouts/error.ejs", { status, message });
});



async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/stayhub');
}

main().then(() => {
    console.log("db is connected");
}).catch(err => {
    console.log(err);
})


app.listen(port, (req, res) => {
    console.log(`app is listining on ${port}`)

});

// home route
app.get("/", (req, res) => {
    res.send("this is the home root");
});

// all listing route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

// new route
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
})

// show route
app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

// save route
app.post("/listings",validateListing, wrapAsync( async (req,res,next) =>{
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings")
    }
));

// edit route
app.get("/listings/:id/edit", async (req ,res)=>{
    const { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//update route
app.patch("/listings/:id",validateListing, async (req, res) =>{
    const {id} = req.params;
    if(!req.body.listing){
        throw new ExpressError(400 , "please send the valid data for listing")
    }
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect("/listings");
});

// delete route
app.delete("/listings/:id", async (req, res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
});

// for the wrong route
app.all("*" , (req, res, next) => {
    next(new ExpressError(400 , "page not found!"));
})

// error route
app.use((err, req, res, next) => {
    const { status=500,message="error is occupied" } = err;
    res.render("./layouts/error.ejs", {status,message});
});



// app.get("/testlisting",async (req , res) =>{
//     let sampleListing = new Listing({
//         title : "new house",
//         description : "by the road",
//         price : 1200,
//         location : "bihar",
//         country : "india",
//     });
//     await sampleListing.save().then(res =>{
//         console.log(res);
//     }).catch(err =>{
//         console.log(err);
//     });
// });