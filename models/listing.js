const mongoose = require("mongoose");
const schema = mongoose.Schema;

const listingSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg?auto=compress&cs=tinysrgb&w=600",
        set: (v) => v === "" ? "https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg?auto=compress&cs=tinysrgb&w=600" : v,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    }
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;