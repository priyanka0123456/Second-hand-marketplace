const express = require("express");
const router = express.Router();
const AdModel = require('../db/adModel.js')
const Ad = require("../db/adModel.js");
const path = require('path')




// Set up multer for handling file uploads
const multer = require('multer');
const storage = multer.diskStorage({
    destination: './uploads', // Verify this destination folder exists
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });
router.use("/profile", express.static("uploads"));
router.post('/photo', upload.single('image'), (req, res) => {
    const file = req.file.filename
    const { recieverId, UserName, UserEmail, category_me, subCategory, type, title, description, price, brand, location, contact } = req.body;
    const imageUrl = `/profile/${file}`
    const newAd = new Ad({
        recieverId,
        UserName,
        UserEmail,
        category_me,
        subCategory,
        type,
        title,
        description,
        price,
        brand,
        location,
        contact,
        image: imageUrl
    })
    try {
        newAd.save()
        res.status(201).json(newAd)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


})


//update ad
router.post("/update/:id", upload.single("image"), async (req, res) => {
    const id = req.params.id
    const { UserEmail, category_me, subCategory, type, title, description, price, brand, location } = req.body;
    const images = req.files;

    // Process and save data to your database (e.g., MongoDB)
    const newAd = new AdModel({
        UserEmail,
        category_me,
        subCategory,
        type,
        title,
        description,
        price,
        brand,
        location,
        images: images
    });

    try {
        await newAd.save();
        res.status(200).send("Ad uploaded successfully.",);
    } catch (error) {
        res.status(500).send("Error uploading ad.");
    }
});
router.get('/allads', async (req, res) => {
    const currentTime = new Date();
    const ads = await AdModel.find(); // Replace this with your query to fetch ads

    // Calculate the time difference for each ad
    const sortedAds = ads.map((ad) => {
        const createdDate = new Date(ad.created_at);
        const timeDifference = currentTime - createdDate;
        return { ...ad._doc, timeDifference }; // Include the time difference in the ad object
    });

    // Sort the ads by time difference (ascending order)
    sortedAds.sort((ad1, ad2) => ad1.timeDifference - ad2.timeDifference);
    res.status(200).json(sortedAds)
})
router.get("/images/:adId", async (req, res) => {
    try {
        const ad = await AdModel.findById(req.params.adId);

        if (!ad || !ad.images || ad.images.length === 0) {
            return res.status(404).send("Image not found");
        }

        const image = ad.images[0]; // Assuming you store one image per ad

        res.contentType(image.contentType);
        res.send(image.data);
    } catch (error) {
        res.status(500).send("Error retrieving image");
    }
});

router.get("/addDetails/:id", async (req, res) => {
    const adId = req.params.id; // Get the ad ID from the URL parameters

    try {
        const ad = await AdModel.findById(adId); // Find the ad by its ID

        if (!ad) {
            return res.status(404).json({ error: "Ad not found" });
        }

        res.status(200).json(ad);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving the ad" });
    }
});
router.get('/userAds', async (req, res) => {
    const email = req.query.email;
    const UserAds = await AdModel.find({ UserEmail: email })

    if (!UserAds) {
        res.satus(404).json({ error: "No ads found" })
    } else if (UserAds) {
        res.status(200).json({ 'data': UserAds })
    }
})
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id
        const mail = await AdModel.findById(id);
        const email = mail.UserEmail
        const ad = await AdModel.findByIdAndDelete(id);
        const UserAds = await AdModel.find({ UserEmail: email })
        res.status(200).json({ 'data': UserAds })
    } catch (error) {
        res.status(400);
    }
})


module.exports = router;
