const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});


mongoose.connect('mongodb://localhost:27017/chat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Create a message schema
const messageSchema = new mongoose.Schema({
    room: String,
    sender: String,
    receiver: String,
    text: String,
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    // Handle the joinRoom event
    socket.on('joinRoom', (room) => {
        // Join the chat room for the specific ad
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
    });
    // Handle the sendMessage event
    socket.on('sendMessage', (message) => {
        // Send the message to the chat room
        const newMessage = new Message(message);
        newMessage.save();
        io.to(message.ad).emit('message', message);
        console.log(`Socket ${socket.id} sent message ${message.text} to room ${message.ad}`);
    });
    // Handle fetchRooms event
    socket.on('fetchRooms', ({ user }) => {
        // Fetch the list of rooms for the user from your database
        // Assume a simple array for demonstration purposes
        const rooms = connectedUsers[user] || [];
        socket.emit('rooms', rooms);
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

// ... (other routes or middleware)

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
