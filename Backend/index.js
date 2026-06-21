require('dotenv').config();
const Canvas = require('./models/canvasModel');
const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('./models/userModel');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectToDatabase = require('./db');

const userRoute = require('./routes/userRoute');
const canvasRoute = require('./routes/canvasRoute');

connectToDatabase();

const app = express();

app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://collaborative-whiteboard-f8yd.vercel.app/"
    ]
}));

app.use('/users', userRoute);
app.use('/api/canvas', canvasRoute);

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://collaborative-whiteboard-f8yd.vercel.app/"
        ]
    }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication required"));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await Users.findOne({
            email: decoded.email
        });

        if (!user) {
            return next(new Error("User not found"));
        }

        socket.user = user;

        next();
    } catch (error) {
        next(new Error("Authentication failed"));
    }
});

// Socket.IO events
io.on("connection", (socket) => {

    console.log(`Socket connected: ${socket.id}`);
    
    socket.on("canvasUpdated", async () => {
        try {
            const canvasId = socket.canvasId;

            if (!canvasId) return;

            console.log(
                `Broadcasting to room ${canvasId}`
            );

            const canvas = await Canvas.findById(canvasId);

            if (!canvas) return;

            io.to(canvasId).emit(
                "loadCanvas",
                canvas.toObject()
            );
        } catch (error) {
            console.error(error);
        }
    });

    socket.on("joinCanvas", async ({ canvasId }) => {
        try {
            console.log(
                `Socket ${socket.id} joined canvas ${canvasId}`
            );

            const canvas = await Canvas.findById(canvasId)
                .populate("owner")
                .populate("shared_with");

            if (!canvas) {
                socket.emit("canvasError", {
                    message: "Canvas not found"
                });
                return;
            }

            const isOwner =
                canvas.owner._id.toString() ===
                socket.user._id.toString();

            const isShared =
                canvas.shared_with.some(
                    user =>
                        user._id.toString() ===
                        socket.user._id.toString()
                );

            if (!isOwner && !isShared) {
                socket.emit("canvasError", {
                    message:
                        "You are not authorized to access this canvas"
                });
                return;
            }

            socket.join(canvasId);
            socket.canvasId = canvasId;
            console.log(`Socket ${socket.id} joined room ${canvasId}`);
            socket.emit(
                "loadCanvas",
                canvas.toObject()
            );

        } catch (error) {
            socket.emit("canvasError", {
                message: error.message
            });
        }
    });

    socket.on("leaveCanvas", (canvasId) => {
        console.log(
            `Socket ${socket.id} left canvas ${canvasId}`
        );

        socket.leave(canvasId);
    });

    socket.on("disconnect", () => {
        console.log(
            `Socket disconnected: ${socket.id}`
        );
    });
});

const port = process.env.PORT || 3030;

// Start HTTP + Socket.IO server
server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});