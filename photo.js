const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Ad = require("../db/Test");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});

const upload = multer({ storage: storage });

router.post("/create-ad", upload.single("image"), async (req, res) => {
    try {
        const { title, description } = req.body;
        const imagePath = req.file.path;

        const newAd = new Ad({
            title: title,
            description: description,
            image: imagePath, // Assuming you have an "image" field in your Ad model
        });

        const savedAd = await newAd.save();

        res.json({ message: "Ad created successfully", ad: savedAd });
    } catch (error) {
        console.error("Error creating ad:", error);
        res.status(500).json({ error: "Error creating ad" });
    }
});

module.exports = router;
