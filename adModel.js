const mongoose = require("mongoose");

// Create an Advertisement schema
const adSchema = new mongoose.Schema({
    recieverId: { type: String },
    UserName: { type: "string", },
    UserEmail: { type: String },
    category_me: {
        type: String,
    },
    subCategory: { type: String },
    type: { type: String },
    title: { type: String },
    description: { type: String },
    price: { type: Number },
    brand: { type: String },
    location: { type: String },
    contact: { type: String },
    image: { type: String },
    created_at: {
        type: Date,
        default: Date.now, // Set the default value to the current date and time
    },
});

adSchema.pre("save", function (next) {
    if (!this.created_at) {
        this.created_at = new Date();
    }
    next();
});

// Create a model for the Advertisement schema
const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
