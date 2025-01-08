const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/stayhub'); 
}

main().then(()=> {
    console.log("db is connected");
}).catch(err =>{
    console.log(err);
})

const initDB = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data is submit in db");
}

initDB();

