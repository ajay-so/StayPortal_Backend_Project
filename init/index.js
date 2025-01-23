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
    initData.data = initData.data.map((obj) => ({...obj, owner : '678ce70fa88cfa26f8a04f50' }))
    await Listing.insertMany(initData.data);
    console.log("data is submit in db");
}

initDB();

