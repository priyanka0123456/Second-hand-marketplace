const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
    title: String,
    description: String,
    images: [{ type: String }], // Store image links
});

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
