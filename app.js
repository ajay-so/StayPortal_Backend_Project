const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsmate = require("ejs-mate");

const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.engine('ejs', ejsmate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


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

app.get("/", (req, res) => {
    res.send("this is the home root");
});

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
app.post("/listings", async (req,res) =>{
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings")
});

// edit route
app.get("/listings/:id/edit", async (req ,res)=>{
    const { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//update route
app.patch("/listings/:id", async (req, res) =>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect("/listings");
});

// delete route
app.delete("/listings/:id", async (req, res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
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