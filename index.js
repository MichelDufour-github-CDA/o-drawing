require('dotenv').config();
const { createServer, ServerResponse } = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const {v4: uuidv4} = require('uuid');


const PORT = process.env.PORT ?? 3000;

const server = createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
    const uuid = uuidv4();
    console.log("user connected");
    socket.on("draw", (data) => {
        socket.broadcast.emit("autodraw", {...data, uuid})
    });
});

server.listen(PORT, () => {
    console.log(`http server running on http://localhost:${PORT}`);
});