import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from './routes/users.js'
import commentRoutes from './routes/comments.js'
import videoRoutes from './routes/videos.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import uploadRoutes from './routes/upload.js'
import cookieParser from "cookie-parser";
import path from 'path';
import {fileURLToPath} from 'url';
import {syncTo} from "./utils/syncTo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
dotenv.config()

const connect = () => {
    mongoose.connect(process.env.MONGO).then(() => {
        console.log("已连接至数据库！");
    }).catch((err) => {
        throw err;
    })
}

app.use(express.json());
app.use(cookieParser())

// API 路径
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

// 提供对上传文件的访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
    connect();
    syncTo()
    console.log(`已连接至服务器，运行于端口 ${PORT}！`);
});