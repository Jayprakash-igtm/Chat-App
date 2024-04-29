// const express = require('express')// method-1
import express from "express"; // method-2
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";
import path, { dirname } from "path"
import { fileURLToPath } from 'url';
dotenv.config({});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5000;

const publicPath = "public";

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const corsOption = {
    origin: '*',
    credentials: true
};
app.use(cors());
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.svg|.png|.map|.avif)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, publicPath, 'index.html'));
    }
});
app.use(express.static(path.join(__dirname, publicPath)));

app.use(express.static('../frontend/build'));
// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route

app.get('/', (req, res) => {
    console.log(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at prot ${PORT}`);
});

