// mongoose.js

const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/mydb'; // Replace with your MongoDB URI and database name

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
