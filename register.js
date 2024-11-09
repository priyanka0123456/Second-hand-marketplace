// userRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../db/User');
const Googleuser = require('../db/googleUser');
const googleUser = require('../db/googleUser');
// Import the User schema

// User registration route
router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Hash the password before storing it
        const saltRounds = 10; // Adjust the number of salt rounds as needed (10 is a common choice)
        bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ message: 'Error hashing password' });
            }

            // Save the hashedPassword in your database along with other user data
            // For example, you might use Mongoose to save the user data
            const newUser = new User({ name, email, password: hashedPassword, });
            await newUser.save();
            res.status(200).json('User created')
        })
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/google', async (req, res) => {
    try {
        const { userName, UserEmail, userProfile } = req.body;
        const existingUser = await User.findOne({ email: UserEmail });
        const existingUsers = await googleUser.findOne({ email: UserEmail });
        if (existingUser, existingUsers) {
            return res.status(201).json(existingUsers, existingUser);
        } else {
            const newUser = new googleUser({ usreName: userName, UserEmail: UserEmail, userProfile: userProfile });
            await newUser.save();
            res.status(200).json('User created',)
        }

    }
    catch (err) {
        res.status(400).json('internal server error')
    }
})
module.exports = router;

