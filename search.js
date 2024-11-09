const express = require("express");
const router = express.Router();
const Ad = require('../db/adModel.js'); // Import your Ad model

router.get("/", async (req, res) => {
    try {
        const searchQuery = req.query.query; // Get the search query from the query string
        const regex = new RegExp(searchQuery, "i"); // Create a case-insensitive regex pattern

        const ads = await Ad.find({
            $or: [
                { title: { $regex: regex } }, // Match titles with the search query
                { description: { $regex: regex } },
                { category: { $regex: regex } } // Match descriptions with the search query
            ],
        });

        /* const sortedAds = ads.map((ad) => {
             const createdDate = new Date(ad.created_at);
             const timeDifference = currentTime - createdDate;
             return { ...ad._doc, timeDifference }; // Include the time difference in the ad object
         });
 
         // Sort the ads by time difference (ascending order)
         sortedAds.sort((ad1, ad2) => ad1.timeDifference - ad2.timeDifference);*/
        res.status(200).json(ads)
    } catch (error) {
        res.status(500).json({ error: "Error searching ads" });
    }
});
router.get('/subCategory', async (req, res) => {
    try {
        const category_me = req.query.subCategory;
        console.log(category_me);
        const currentTime = new Date();
        const regex = new RegExp(category_me, "i")
        const ads = await Ad.find({
            $or: [
                { category_me: { $regex: regex } }
            ]
        }) // Replace this with your query to fetch ads
        console.log(ads)
        if (ads.length > 0) {

            // Calculate the time difference for each ad
            const sortedAds = ads.map((ad) => {
                const createdDate = new Date(ad.created_at);
                const timeDifference = currentTime - createdDate;
                return { ...ad._doc, timeDifference }; // Include the time difference in the ad object
            });

            // Sort the ads by time difference (ascending order)
            sortedAds.sort((ad1, ad2) => ad1.timeDifference - ad2.timeDifference);
            res.status(200).json({ "results": sortedAds });
        } else {
            res.status(200).json({ error: "No ads found" })
        }
    } catch (error) {
        res.status(500).json({ error: "Error" })
    }
})

module.exports = router;
