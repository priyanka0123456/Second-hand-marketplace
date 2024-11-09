// authRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../db/User'); // Import the User schema
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const cors = require('cors')

// User login route
router.post('/', cors(), async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ status: 401, message: 'Invalid credentials' });
        }

        // Compare the entered password with the stored hashed password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (result) {
                // Passwords match, allow the user to log in
                secretKey = '4656hj6768jjk'
                const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });
                res.status(200).json({ status: 200, data: user });
            } else {
                // Passwords do not match, deny access
                return res.status(500).json({ status: 500, message: 'Invalid credentials' });
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
