const { createServer } = require('node:http');
const { Server } = require('socket.io')
const express = require('express')
const router = express.Router();
const cors = require('cors')




router.get('/', (req, res) => {
    const app = express();
    app.use(cors())
    const server = createServer(app);
    const io = new Server(server);
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            res.json('user disconnected');
        });
    });
})