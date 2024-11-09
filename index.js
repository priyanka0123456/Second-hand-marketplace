// app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const userRoutes = require('./routes/register.js');
const loginRoute = require('./routes/login.js') // Import the userRoutes file
const adRoute = require('./routes/ad.js')
const searchRoute = require('./routes/search.js');
const socketio = require('socket.io')

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
const server = require('http').Server(app);
const io = socketio(server);





// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydb', {
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

// Use the user registration route
app.use('/register', userRoutes);
app.use('/login', loginRoute)

app.use('/upload', adRoute);
app.use('/search', searchRoute);


//chat integration
// Listen for Socket.IO connection events
io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    // Handle the joinRoom event
    socket.on('joinRoom', (adId) => {
        // Join the chat room for the specific ad
        socket.join(adId);
        console.log(`Socket ${socket.id} joined room ${adId}`);
    });
    // Handle the sendMessage event
    socket.on('sendMessage', (message) => {
        // Send the message to the chat room
        io.to(message.ad).emit('message', message);
        console.log(`Socket ${socket.id} sent message ${message.text} to room ${message.ad}`);
    });

    // Handle the leaveRoom event
    socket.on('leaveRoom', (adId) => {
        // Leave the chat room
        socket.leave(adId);
        console.log(`Socket ${socket.id} left room ${adId}`);
    });

    // Handle the disconnect event
    socket.on('disconnect', () => {
        // Disconnect from the server
        console.log(`Socket ${socket.id} disconnected`);
    });
});

//app listeners
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
