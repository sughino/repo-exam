import "./config/loadEnv.js";
import { Server } from 'socket.io';
import http from 'http';
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import errorHandler from "./utils/errorHandler.js";
import generalRoutes from "./routes/generalRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import getRoutes from "./routes/getRoutes.js";
import insertRoutes from "./routes/insertRoutes.js";
import modifylRoutes from "./routes/modifyRoutes.js";
import deleteRoutes from "./routes/deleteRoutes.js";
import { checkAuth } from "./middelware/checkAuth.js";

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['POST', 'PUT', 'DELETE'],
        credentials: true
    }
});
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
app.set('io', io);

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 500,
        message: {
        status: 'error',
        data: {},
        message: 'Too many requests, please try again later',
        code: 429
        }
    })
);

app.get('/', (req, res) => {
    res.redirect(process.env.FRONTEND_URL);
});
app.use("/api/general", generalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/get", checkAuth, getRoutes);
app.use("/api/insert", checkAuth, insertRoutes);
app.use("/api/modify", checkAuth, modifylRoutes);
app.use("/api/delete", checkAuth, deleteRoutes);
app.all('*', (req, res) => {return res.status(404).json({
    status: 'failure',
    data: {},
    message: 'not found',
    code: 404
})})
app.use(errorHandler);

server.listen(PORT, () => {console.log(`server running on port ${PORT}`);});