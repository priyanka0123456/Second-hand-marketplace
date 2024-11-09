const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: String,
    UserEmail: {
        type: String,
        unique: true, // Ensure email is unique
    },
    userProfile: String
});

module.exports = mongoose.model('Googleuser', userSchema);
